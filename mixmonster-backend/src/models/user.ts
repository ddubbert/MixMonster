import { User } from '../types/generated/schema-types';
import { Schema, model } from 'mongoose';

export interface DBUser extends User {
  authId: String;
}

const userSchema = new Schema<DBUser>({
  authId: { type: Schema.Types.String, required: true },
});

const UserModel = model<DBUser>('User', userSchema);

export { userSchema, UserModel };
