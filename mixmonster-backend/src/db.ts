import { connect } from 'mongoose';
import { UserModel, DBUser } from './models/user';
import { CollectionModel, DBCollection } from './models/collection';
import { Model } from 'mongoose'

export interface DB {
  User: Model<DBUser>,
  Collection: Model<DBCollection>,
}

export async function connectDB(): Promise<DB> {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE, DB_AUTHSOURCE } = process.env;

  if (DB_USER && DB_PASSWORD) {
    await connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?authSource=${DB_AUTHSOURCE}`);
  } else {
    await connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
  }

  return {
    User: UserModel,
    Collection: CollectionModel,
  };
}
