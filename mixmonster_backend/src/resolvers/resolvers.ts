import { Resolvers } from '../types/generated/schema-types';
import { Context } from '../types/basic';
import { DBCollection } from '../models/collection'
import {Document, Types} from 'mongoose'

const getCollectionIfOwner = async (context: Context, collectionId: string)
  : Promise<Document<any, any, DBCollection> & DBCollection & {_id: Types.ObjectId}> => {
  const collection = await context.db.Collection.findOne({ _id: collectionId });

  if(!collection || collection.author !== context.currentUser.id) {
    throw new Error('Not authorized to modify this collection.');
  }
  return collection;
}

const resolvers : Resolvers = {
  Query: {
    getCollection: async (parent, args, context) => {
      const collection = await context.db.Collection.findOne({ _id: args.id });

      if(!collection) throw new Error('Collection not found.');
      return collection;
    },
    getCollections: async (parent, args, context) => {
      return context.db.Collection.find({ author: context.currentUser.id });
    }
  },
  Mutation: {
    createCollection: async (parent, args, context) => {
      return (new context.db.Collection({ author: context.currentUser.id, ...args.input })).save();
    },
    updateCollection: async (parent, args, context) => {
      const collection = await getCollectionIfOwner(context, args.id);
      Object.assign(collection, args.update);

      return collection.save();
    },
    deleteCollection: async (parent, args, context) => {
      await getCollectionIfOwner(context, args.id);

      const { deletedCount } = await context.db.Collection.deleteOne({ _id: args.id });
      return deletedCount > 0;
    },
    deleteAllCollections: async (parent, args, context) => {
      const { deletedCount } = await context.db.Collection.deleteMany();
      return deletedCount > 0;
    }
  }
};

export default resolvers;
