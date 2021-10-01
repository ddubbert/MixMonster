import { Collection } from '../types/generated/schema-types';
import { categorySchema } from './category';
import { Schema, model, ObjectId } from 'mongoose';

export interface DBCollection extends Collection {
  author: String;
}

const collectionSchema = new Schema<DBCollection>({
  author: { type: Schema.Types.String, required: true },
  title: { type: Schema.Types.String, required: true },
  allowReRoll: { type: Schema.Types.Boolean, required: true },
  categories: [categorySchema],
});

const CollectionModel = model<DBCollection>('Collection', collectionSchema);

export { collectionSchema, CollectionModel };
