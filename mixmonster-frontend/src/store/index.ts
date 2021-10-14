import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import Keycloak from 'keycloak-js';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  Collection,
  CreateCollection,
  CreateCollectionMutation,
  CreateCollectionMutationVariables, DeleteCollection, DeleteCollectionMutation,
  GetCollections,
  GetCollectionsQuery,
  UpdateCollection,
  UpdateCollectionMutation,
  UpdateCollectionMutationVariables,
} from '@/types/generated/graphql';

Vue.use(Vuex);

export default function createStore(keycloak: Keycloak.KeycloakInstance):
  Store<{ collections: Collection[] }> {
  const link = createHttpLink({
    uri: 'http://localhost:4000/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const { token } = keycloak;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const cache = new InMemoryCache();

  const apolloClient = new ApolloClient({
    link: authLink.concat(link),
    cache,
  });

  return new Vuex.Store({
    state: {
      collections: [] as Collection[],
    },
    getters: {
      getCollections: (state) => (collectionId: string): Collection | undefined => state
        .collections.find((collection) => collection.id === collectionId),
    },
    mutations: {
      addCollection(state, collection: Collection) {
        state.collections.push(collection);
      },
      updateCollection(state, collection: Collection) {
        const index = state.collections.map((x) => x.id)
          .indexOf(collection.id);
        Vue.set(state.collections, index, collection);
      },
      deleteCollection(state, id: string) {
        const index = state.collections.map((x) => x.id)
          .indexOf(id);
        state.collections.splice(index, 1);
      },
    },
    actions: {
      async getCollections({ state }) {
        const requestedCollections = (await apolloClient
          .query<GetCollectionsQuery>({ query: GetCollections })).data.getCollections;
        state.collections.splice(0, state.collections.length, ...requestedCollections);
      },
      async createCollection(
        { commit },
        variables: CreateCollectionMutationVariables,
      ) {
        const createdCollection = (await apolloClient
          .mutate<CreateCollectionMutation>({
            mutation: CreateCollection,
            variables,
          })).data?.createCollection;

        if (createdCollection) {
          commit('addCollection', createdCollection);
        }
      },
      async updateCollection(
        { commit },
        variables: UpdateCollectionMutationVariables,
      ) {
        const updatedCollection = (await apolloClient
          .mutate<UpdateCollectionMutation>({
            mutation: UpdateCollection,
            variables,
          })).data?.updateCollection;

        if (updatedCollection) {
          commit('updateCollection', updatedCollection);
        }
      },
      async removeCollection({ commit }, id: string) {
        const deletedCollection = (await apolloClient
          .mutate<DeleteCollectionMutation>({
            mutation: DeleteCollection,
            variables: { id },
          })).data?.deleteCollection;

        if (deletedCollection) commit('deleteCollection', id);
      },
    },
    modules: {},
  });
}
