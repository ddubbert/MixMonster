export interface Expression {
  title: string;
  image?: string;
  file?: File;
}

export interface Category {
  title: string;
  expressions: Expression[];
}

export interface Collection {
  id: string;
  title: string;
  categories: Category[];
}
