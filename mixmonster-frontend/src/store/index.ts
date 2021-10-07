import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import Keycloak from 'keycloak-js';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import {
  Collection,
  CreateCollection,
  CreateCollectionMutation,
  CreateCollectionMutationVariables,
  GetCollections,
  GetCollectionsQuery,
  UpdateCollection,
  UpdateCollectionMutation,
  UpdateCollectionMutationVariables,
} from '@/types/generated/graphql';

Vue.use(Vuex);

export default function createStore(keycloak: Keycloak.KeycloakInstance):
  Store<{ collections: Collection[]; counter: number }> {
  const link = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: `Bearer ${keycloak.token}`,
    },
  });

  const cache = new InMemoryCache();

  const apolloClient = new ApolloClient({
    link,
    cache,
  });

  return new Vuex.Store({
    state: {
      collections: [] as Collection[],
      counter: 2,
    },
    getters: {
      getCollection: (state) => (collectionId: string): Collection | undefined => state
        .collections.find((collection) => collection.id === collectionId),
    },
    mutations: {
      addCollection(state, collection: Collection) {
        state.collections.push(collection);
        state.counter += 1;
      },
      updateCollection(state, collection: Collection) {
        const index = state.collections.map((x) => x.id)
          .indexOf(collection.id);
        Vue.set(state.collections, index, collection);
      },
      deleteCollection(state, collection: Collection) {
        const index = state.collections.map((x) => x.id)
          .indexOf(collection.id);
        state.collections.splice(index, 1);
      },
    },
    actions: {
      async getCollections({ state }) {
        const requestedCollections = (await apolloClient
          .query<GetCollectionsQuery>({ query: GetCollections })).data.getCollections;
        state.collections.splice(0, state.collections.length, ...requestedCollections);
      },
      async createCollection({
        commit,
      }, collection: Collection) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...input } = collection;
        const variables : CreateCollectionMutationVariables = { input };

        const createdCollection = (await apolloClient
          .mutate<CreateCollectionMutation>({
            mutation: CreateCollection,
            variables,
          })).data?.createCollection;

        if (createdCollection) {
          commit('addCollection', createdCollection);
        }
      },
      async updateCollection({ commit }, collection: Collection) {
        const { id, ...update } = collection;
        const variables : UpdateCollectionMutationVariables = { id, update };

        const updatedCollection = (await apolloClient
          .mutate<UpdateCollectionMutation>({
            mutation: UpdateCollection,
            variables,
          })).data?.updateCollection;

        if (updatedCollection) {
          commit('updateCollection', updatedCollection);
        }
      },
      async removeCollection({ commit }, collection: Collection) {
        // Todo
        commit('deleteCollection', collection);
      },
    },
    modules: {},
  });
}
