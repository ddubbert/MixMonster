import {Category, Criteria} from '../types/generated/schema-types';
import { Schema } from 'mongoose';

export interface DBCriteria extends Criteria {
}

export interface DBCategory extends Category {
}

const criteriaSchema = new Schema<DBCriteria>({
  title: { type: Schema.Types.String, required: true },
  image: String,
});

const categorySchema = new Schema<DBCategory>({
  title: { type: Schema.Types.String, required: true },
  selectable: { type: Schema.Types.Boolean, required: true },
  criteriaRollAmount: { type: Schema.Types.Number, required: true },
  criteria: [criteriaSchema],
});

// categorySchema.virtual('id').get(function() {
//   return this._id;
// });

export { criteriaSchema, categorySchema };
