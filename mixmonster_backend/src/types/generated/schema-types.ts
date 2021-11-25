import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../basic';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Category = {
  __typename?: 'Category';
  criteria: Array<Criteria>;
  criteriaRollAmount: Scalars['Int'];
  selectable: Scalars['Boolean'];
  title: Scalars['String'];
};

export type CategoryInput = {
  criteria?: Maybe<Array<CriteriaInput>>;
  criteriaRollAmount?: Maybe<Scalars['Int']>;
  selectable?: Maybe<Scalars['Boolean']>;
  title: Scalars['String'];
};

export type Collection = {
  __typename?: 'Collection';
  allowReRoll: Scalars['Boolean'];
  categories: Array<Category>;
  id: Scalars['String'];
  title: Scalars['String'];
};

export type CollectionInput = {
  allowReRoll?: Maybe<Scalars['Boolean']>;
  categories?: Maybe<Array<CategoryInput>>;
  title: Scalars['String'];
};

export type Criteria = {
  __typename?: 'Criteria';
  image?: Maybe<Scalars['String']>;
  showTitle?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
};

export type CriteriaInput = {
  image?: Maybe<Scalars['String']>;
  showTitle?: Maybe<Scalars['Boolean']>;
  title?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCollection: Collection;
  deleteAllCollections: Scalars['Boolean'];
  deleteCollection: Scalars['Boolean'];
  updateCollection: Collection;
};


export type MutationCreateCollectionArgs = {
  input: CollectionInput;
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['String'];
};


export type MutationUpdateCollectionArgs = {
  id: Scalars['String'];
  update: CollectionInput;
};

export type Query = {
  __typename?: 'Query';
  getCollection: Collection;
  getCollections: Array<Collection>;
};


export type QueryGetCollectionArgs = {
  id: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Category: ResolverTypeWrapper<Category>;
  CategoryInput: CategoryInput;
  Collection: ResolverTypeWrapper<Collection>;
  CollectionInput: CollectionInput;
  Criteria: ResolverTypeWrapper<Criteria>;
  CriteriaInput: CriteriaInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Category: Category;
  CategoryInput: CategoryInput;
  Collection: Collection;
  CollectionInput: CollectionInput;
  Criteria: Criteria;
  CriteriaInput: CriteriaInput;
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
};

export type CategoryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  criteria?: Resolver<Array<ResolversTypes['Criteria']>, ParentType, ContextType>;
  criteriaRollAmount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  selectable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  allowReRoll?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CriteriaResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Criteria'] = ResolversParentTypes['Criteria']> = {
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  showTitle?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'input'>>;
  deleteAllCollections?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  deleteCollection?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCollectionArgs, 'id'>>;
  updateCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationUpdateCollectionArgs, 'id' | 'update'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<QueryGetCollectionArgs, 'id'>>;
  getCollections?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Category?: CategoryResolvers<ContextType>;
  Collection?: CollectionResolvers<ContextType>;
  Criteria?: CriteriaResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

