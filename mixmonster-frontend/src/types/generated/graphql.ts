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
  getCollections: Array<Collection>;
  getUser: User;
  getUsers: Array<User>;
};


export type QueryGetCollectionArgs = {
  id: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
};

export type CollectionDataFragment = { __typename?: 'Collection', id: string, title: string, allowReRoll: boolean, categories: Array<{ __typename?: 'Category', title: string, selectable: boolean, criteriaRollAmount: number, criteria: Array<{ __typename?: 'Criteria', title: string, image?: string | null | undefined }> }> };

export type GetCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCollectionsQuery = { __typename?: 'Query', getCollections: Array<{ __typename?: 'Collection', id: string, title: string, allowReRoll: boolean, categories: Array<{ __typename?: 'Category', title: string, selectable: boolean, criteriaRollAmount: number, criteria: Array<{ __typename?: 'Criteria', title: string, image?: string | null | undefined }> }> }> };

export type CreateCollectionMutationVariables = Exact<{
  input: CollectionInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection: { __typename?: 'Collection', id: string, title: string, allowReRoll: boolean, categories: Array<{ __typename?: 'Category', title: string, selectable: boolean, criteriaRollAmount: number, criteria: Array<{ __typename?: 'Criteria', title: string, image?: string | null | undefined }> }> } };

export type UpdateCollectionMutationVariables = Exact<{
  id: Scalars['String'];
  update: CollectionInput;
}>;


export type UpdateCollectionMutation = { __typename?: 'Mutation', updateCollection: { __typename?: 'Collection', id: string, title: string, allowReRoll: boolean, categories: Array<{ __typename?: 'Category', title: string, selectable: boolean, criteriaRollAmount: number, criteria: Array<{ __typename?: 'Criteria', title: string, image?: string | null | undefined }> }> } };

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type DeleteCollectionMutation = { __typename?: 'Mutation', deleteCollection: boolean };

export const CollectionData = gql`
    fragment collectionData on Collection {
  id
  title
  allowReRoll
  categories {
    title
    selectable
    criteriaRollAmount
    criteria {
      title
      image
    }
  }
}
    `;
export const GetCollections = gql`
    query getCollections {
  getCollections {
    ...collectionData
  }
}
    ${CollectionData}`;
export const CreateCollection = gql`
    mutation createCollection($input: CollectionInput!) {
  createCollection(input: $input) {
    ...collectionData
  }
}
    ${CollectionData}`;
export const UpdateCollection = gql`
    mutation updateCollection($id: String!, $update: CollectionInput!) {
  updateCollection(id: $id, update: $update) {
    ...collectionData
  }
}
    ${CollectionData}`;
export const DeleteCollection = gql`
    mutation deleteCollection($id: String!) {
  deleteCollection(id: $id)
}
    `;