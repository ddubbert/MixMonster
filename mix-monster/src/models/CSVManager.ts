import { Category, Collection, Expression } from '@/types/collection';

export default class CSVManager {
  separator = ',';

  createCSV(collection: Collection) : string {
    const headers = ['Szenarien', 'Kategorien', 'Ausprägungen', 'Bilder'].join(this.separator);
    const csvString = `${collection.title}${collection.categories
      .reduce((acc, cat) => `${acc}${this.separator}${cat.title}${this.separator}${
        cat.expressions.reduce((eAcc, exp, i) => {
          const pre = i === 0 ? '' : `${this.separator}${this.separator}`;
          return `${eAcc}${pre}${exp.title}${this.separator}${exp.image || ''}\n`;
        }, '')}`, '')}`;
    return `${headers}\n${csvString}`;
  }

  createCollectionFrom(csv: string): Collection[] {
    const rows = csv.split('\n').map((row) => row.split(this.separator));
    rows.splice(0, 1);

    return rows.reduce((acc, row) => {
      const temp = [...acc];
      if (row[0]) temp.push({ title: row[0], categories: [] as Category[] } as Collection);
      const tempL = temp.length - 1;
      if (row[1] && tempL >= 0) {
        temp[tempL].categories.push({ title: row[1], expressions: [] as Expression[] });
      }
      if (row[2] && tempL >= 0) {
        temp[tempL].categories[temp[tempL].categories.length - 1].expressions
          .push({ title: row[2], image: row[3] });
      }
      return temp;
    }, [] as Collection[]);
  }
}
