import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  criteria?: Maybe<Array<Maybe<Criteria>>>;
  criteriaRollAmount: Scalars['Int'];
  selectable: Scalars['Boolean'];
  title: Scalars['String'];
};

export type CategoryInput = {
  criteriaRollAmount?: Maybe<Scalars['Int']>;
  selectable?: Maybe<Scalars['Boolean']>;
  title: Scalars['String'];
};

export type Collection = {
  __typename?: 'Collection';
  allowReRoll: Scalars['Boolean'];
  categories?: Maybe<Array<Maybe<Category>>>;
  id: Scalars['String'];
  title: Scalars['String'];
};

export type CollectionInput = {
  allowReRoll?: Maybe<Scalars['Boolean']>;
  categories?: Maybe<Array<Maybe<CategoryInput>>>;
  title: Scalars['String'];
};

export type Criteria = {
  __typename?: 'Criteria';
  image?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type CriteriaInput = {
  image?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCollection: Collection;
  deleteAllCollections: Scalars['Boolean'];
  deleteCollection: Scalars['Boolean'];
  deleteUsers: Scalars['Boolean'];
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
  getCollections?: Maybe<Array<Maybe<Collection>>>;
  getUser: User;
  getUsers?: Maybe<Array<Maybe<User>>>;
};


export type QueryGetCollectionArgs = {
  id: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
};

export type GetCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionsQuery = { __typename?: 'Query', getCollections?: Array<{ __typename?: 'Collection', id: string, title: string, categories?: Array<{ __typename?: 'Category', title: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined };


export const GetCollections = gql`
    query getCollections {
  getCollections {
    id
    title
    categories {
      title
    }
  }
}
    `;