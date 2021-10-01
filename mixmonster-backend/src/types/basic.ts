import { ExecutionContext } from 'graphql-helix/dist/types'
import { DB } from '../db';

export type UserType = {
  authId: string;
  id: string;
};

export interface Context extends ExecutionContext {
  currentUser: UserType;
  db: DB;
}
