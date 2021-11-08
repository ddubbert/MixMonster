import * as XLSX from 'sheetjs-style';
import * as SHEETJS from 'xlsx';
import { Category, Collection, Criteria } from '@/types/generated/graphql';

type JsonMap = { [key: string]: number | string };

export default class ExcelManager {
  private static readonly ENTITY_FONT_SIZE = 18;

  private static readonly HEADER_FONT_SIZE = 14;

  private static readonly DEFAULT_FONT_SIZE = 12;

  private static readonly COLLECTION_HEADERS = ['Sammlungs-Titel', 'Erneutes Würfeln gestatten?'];

  private static readonly CATEGORY_HEADERS = [
    'Kategorie-Titel',
    'Vorauswahl ermöglichen',
    'Anzahl generierter Zufallskriterien',
  ];

  private static readonly CRITERIA_HEADERS = ['Kriterien-Titel', 'Kriterien-Bilder'];

  private static readonly SPACER = ['', ''];

  private static readonly COLLECTION_SPACER : string[] =
    Array(ExcelManager.COLLECTION_HEADERS.length).fill('');

  private static readonly CATEGORY_SPACER : string[] =
    Array(ExcelManager.CATEGORY_HEADERS.length).fill('');

  private static readonly CRITERIA_SPACER : string[] =
    Array(ExcelManager.CRITERIA_HEADERS.length).fill('');

  // private readonly KRITERIA_SPACER = ...Array(this._HEADERS.length - 1);

  private static getCriteriaValues(criteria: Criteria): string[] {
    return [criteria.title || '', criteria.image || ''];
  }

  private static getCategoryValues(category: Category): (string | number)[] {
    return [category.title, +category.selectable, category.criteriaRollAmount];
  }

  private static getCategoryWhitespacesFor(categoryIndex: number) : string[] {
    return [
      ...ExcelManager.COLLECTION_SPACER,
      ...Array(categoryIndex + 1).fill(ExcelManager.SPACER).flatMap((x) => x),
      ...Array(categoryIndex).fill(ExcelManager.CATEGORY_SPACER).flatMap((x) => x),
    ];
  }

  private static getCriteriaWhitespacesFor(categoryIndex: number) : string[] {
    return [
      ...ExcelManager.getCategoryWhitespacesFor(categoryIndex),
      ...ExcelManager.CATEGORY_SPACER,
      ...Array(categoryIndex).fill(ExcelManager.CRITERIA_SPACER).flatMap((x) => x),
    ];
  }

  private static getValueRowsFor(collection: Collection): (string | number)[][] {
    return collection.categories.reduce((acc, category, catIndex) => {
      const newAcc = [...acc];
      newAcc[0].push(
        ...ExcelManager.SPACER,
        ...ExcelManager.getCategoryValues(category),
      );

      const whitespaces = ExcelManager.getCriteriaWhitespacesFor(catIndex);

      category.criteria.forEach((criteria, critIndex) => {
        if (!newAcc[critIndex]) {
          newAcc.push([
            ...whitespaces,
            ...ExcelManager.getCriteriaValues(criteria),
          ]);
        } else {
          const whitespaceDifference = whitespaces.length - newAcc[critIndex].length;
          if (whitespaceDifference > 0) {
            newAcc[critIndex].push(...whitespaces.slice(0, whitespaceDifference));
          }
          newAcc[critIndex].push(...ExcelManager.getCriteriaValues(criteria));
        }
      });

      return newAcc;
    }, [[collection.title, +collection.allowReRoll]]);
  }

  private static createHeaderRowFor(collection: Collection): string[] {
    return collection.categories.reduce((acc) => [
      ...acc,
      ...ExcelManager.SPACER,
      ...ExcelManager.CATEGORY_HEADERS,
      ...ExcelManager.CRITERIA_HEADERS,
    ], [
      ...ExcelManager.COLLECTION_HEADERS,
    ]);
  }

  private static createEntityRowFor(collection: Collection): string[] {
    return collection.categories.reduce((acc, cat, i) => [
      ...acc,
      ...ExcelManager.SPACER,
      `Kategorie ${i + 1}`,
      ...ExcelManager.CATEGORY_SPACER.slice(0, -1),
      ...ExcelManager.CRITERIA_SPACER,
    ], [
      'Sammlung',
      ...Array(ExcelManager.COLLECTION_HEADERS.length - 1).fill(''),
    ]);
  }

  private static formatRow(worksheet: XLSX.WorkSheet, rowIndex: number, format: unknown) : void {
    const ref = worksheet['!ref'];
    if (!ref) return;

    const range = XLSX.utils.decode_range(ref);
    const lastRowIndex = range.e.r;
    const amountColumns = range.e.c + 1;

    if (rowIndex >= lastRowIndex) return;

    [...Array(amountColumns)].forEach((_, colIndex) => {
      const cell = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      // eslint-disable-next-line no-param-reassign
      if (worksheet[cell].v) worksheet[cell].s = format;
    });
  }

  private static fitColumnsToHeaders(
    rows: (string | number)[][],
    rowFontSizes: number[],
  ): { wch: number }[] {
    if (rowFontSizes.length !== rows.length) return [];

    return rows[0].map((a, i) => ({
      wch: Math.max(
        ...rows.map(
          (row, t) => (
            row[i] && row[i].toString().length
              ? (row[i].toString().length + 2) * (rowFontSizes[t] / ExcelManager.DEFAULT_FONT_SIZE)
              : 10
          ),
        ),
      ),
    }));
  }

  private static createCollectionSheet(collection: Collection): XLSX.WorkSheet {
    const collectionData = [
      ExcelManager.createEntityRowFor(collection),
      [],
      ExcelManager.createHeaderRowFor(collection),
      ...ExcelManager.getValueRowsFor(collection),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(collectionData);

    ExcelManager.formatRow(
      worksheet,
      0,
      {
        font: {
          bold: true,
          sz: ExcelManager.ENTITY_FONT_SIZE,
        },
        alignment: {
          wrapText: false,
        },
      },
    );

    ExcelManager.formatRow(
      worksheet,
      2,
      {
        font: {
          bold: true,
          sz: ExcelManager.HEADER_FONT_SIZE,
        },
        alignment: {
          wrapText: false,
        },
        border: {
          bottom: { style: 'thin', rgb: 'FAFF' },
        },
      },
    );

    worksheet['!cols'] = ExcelManager.fitColumnsToHeaders(
      collectionData.slice(0, 3),
      [ExcelManager.ENTITY_FONT_SIZE, 0, ExcelManager.HEADER_FONT_SIZE],
    );

    return worksheet;
  }

  static createWorkbookFor(collection: Collection) : XLSX.WorkBook {
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workBook,
      ExcelManager.createCollectionSheet(collection),
      `Sammlung - ${collection.title}`,
    );

    return workBook;
  }

  private static getCategoryDataFrom(worksheet: XLSX.WorkSheet): Category[] {
    const jsonWorksheet: JsonMap[] = SHEETJS.utils.sheet_to_json(worksheet);
    const amountCategories: number = Object
      .keys(jsonWorksheet[0])
      .filter((key) => key.includes(ExcelManager.CATEGORY_HEADERS[0]))
      .length;

    return [...Array(amountCategories)].map((val, index) => {
      const append = index === 0 ? '' : `_${index}`;
      const title = jsonWorksheet[0][`${ExcelManager.CATEGORY_HEADERS[0]}${append}`];
      const selectable = !!jsonWorksheet[0][`${ExcelManager.CATEGORY_HEADERS[1]}${append}`];
      const criteriaRollAmount = jsonWorksheet[0][`${ExcelManager.CATEGORY_HEADERS[2]}${append}`];

      const initial: Criteria[] = [];
      const criteria: Criteria[] = jsonWorksheet.reduce((acc, sheet) => {
        const critTitle = sheet[`${ExcelManager.CRITERIA_HEADERS[0]}${append}`];
        const critImage = sheet[`${ExcelManager.CRITERIA_HEADERS[1]}${append}`];

        if (!critTitle && !critImage) return acc;

        return [...acc, {
          title: typeof critTitle === 'string' ? critTitle : '',
          image: typeof critImage === 'string' ? critImage : '',
        }];
      }, initial);

      return {
        title: typeof title === 'string' ? title : '',
        selectable,
        criteriaRollAmount: typeof criteriaRollAmount === 'number' ? criteriaRollAmount : 1,
        criteria,
      };
    });
  }

  private static getCollectionDataFrom(worksheet: XLSX.WorkSheet): Collection {
    const jsonWorksheet: JsonMap[] = SHEETJS.utils.sheet_to_json(worksheet);
    const title = jsonWorksheet[0][ExcelManager.COLLECTION_HEADERS[0]];
    const allowReRoll = !!jsonWorksheet[0][ExcelManager.COLLECTION_HEADERS[1]];

    return {
      id: '',
      title: typeof title === 'string' ? title : '',
      allowReRoll,
      categories: ExcelManager.getCategoryDataFrom(worksheet),
    };
  }

  private static getCellBoundariesFor(worksheet: XLSX.WorkSheet): string {
    const ref = worksheet['!ref'];
    if (!ref) throw new Error('Datei kann nicht gelesen werden.');

    const range = SHEETJS.utils.decode_range(ref);
    const lastRowIndex = range.e.r;
    const lastColIndex = range.e.c;
    const endCell = SHEETJS.utils.encode_cell({ r: lastRowIndex, c: lastColIndex });

    for (let index = 0; index <= lastRowIndex; index += 1) {
      const startCell = SHEETJS.utils.encode_cell({ r: index, c: 0 });

      if (worksheet[startCell] && worksheet[startCell].v === ExcelManager.COLLECTION_HEADERS[0]) {
        return `${startCell}:${endCell}`;
      }
    }

    throw new Error('Dateiinhalt ist falsch formatiert.');
  }

  static createCollectionFrom(workbook: SHEETJS.WorkBook): Collection[] {
    return Object.entries(workbook.Sheets).reduce((acc, [, sheet]) => {
      const worksheet = { ...sheet };
      const ref = worksheet['!ref'];
      if (!ref) return acc;

      worksheet['!ref'] = ExcelManager.getCellBoundariesFor(worksheet);

      return [...acc, ExcelManager.getCollectionDataFrom(worksheet)];
    }, [] as Collection[]);
  }
}
