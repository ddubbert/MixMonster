import { ExecutionContext } from 'graphql-helix/dist/types'
import { DB } from '../db';

// TODO
export type UserType = {
  id: string;
};

export interface Context extends ExecutionContext {
  currentUser: UserType;
  db: DB;
}
