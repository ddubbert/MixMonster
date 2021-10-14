import { Category, Collection, Criteria } from '@/types/generated/graphql';

export default class CSVManager {
  separator = ',';

  criteriaString(crit: Criteria, i: number) : string {
    const pre = i === 0 ? '' : `${this.separator}${this.separator}`;
    return `${pre}${crit.title || ''}${this.separator}${crit.image || ''}\n`;
  }

  categoryString(cat: Category) : string {
    return `${this.separator}${cat.title}${this.separator}${cat.criteria.reduce(
      (eAcc, crit, i) => `${eAcc}${this.criteriaString(crit, i)}`,
      '',
    )}`;
  }

  createCSV(collection: Collection) : string {
    const headers = ['Szenarien', 'Kategorien', 'Kriterien', 'Bilder'].join(this.separator);
    const csvString = `${collection.title}${collection.categories.reduce(
      (acc, cat) => `${acc}${this.categoryString(cat)}`,
      '',
    )}`;
    return `${headers}\n${csvString}`;
  }

  createCollectionFrom(csv: string): Collection[] {
    const rows = csv.split('\n').map((row) => row.split(this.separator));
    rows.splice(0, 1);

    return rows.reduce((acc, row, i) => {
      const temp = [...acc];
      if (row[0]) {
        temp.push({
          id: i.toString(),
          title: row[0],
          categories: [],
          allowReRoll: true,
        });
      }
      const tempL = temp.length - 1;
      if (row[1] && tempL >= 0) {
        temp[tempL].categories.push({
          title: row[1],
          criteriaRollAmount: 1,
          selectable: true,
          criteria: [],
        });
      }
      if (row[2] && tempL >= 0) {
        temp[tempL].categories[temp[tempL].categories.length - 1].criteria
          .push({ title: row[2], image: row[3] });
      }
      return temp;
    }, [] as Collection[]);
  }
}
