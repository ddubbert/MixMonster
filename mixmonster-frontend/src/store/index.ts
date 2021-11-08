import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import Keycloak from 'keycloak-js';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  Collection,
  CreateCollection,
  CreateCollectionMutation,
  CreateCollectionMutationVariables,
  DeleteCollection,
  DeleteCollectionMutation,
  GetCollection,
  GetCollectionQuery,
  GetCollections,
  GetCollectionsQuery,
  UpdateCollection,
  UpdateCollectionMutation,
  UpdateCollectionMutationVariables,
} from '@/types/generated/graphql';

Vue.use(Vuex);

export default function createStore(keycloak: Keycloak.KeycloakInstance):
  Store<{ collections: Collection[] }> {
  let reloadTokenInterval = 0;

  const link = createHttpLink({
    uri: 'http://localhost:4000/graphql',
  });

  const cache = new InMemoryCache();

  let apolloClient = new ApolloClient({
    cache,
  });

  return new Vuex.Store({
    state: {
      token: undefined as string | undefined,
      collections: [] as Collection[],
    },
    getters: {
      getCollection: (state) => (collectionId: string): Collection | undefined => state
        .collections
        .find((col) => col.id === collectionId),
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
      async getCollection({ state }, collectionId: string) {
        const requestedCollection = (await apolloClient
          .query<GetCollectionQuery>({
            query: GetCollection,
            variables: { id: collectionId },
          })).data.getCollection;
        state.collections.push(requestedCollection);
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
      async logout({ state }, redirectUri: string) {
        clearInterval(reloadTokenInterval);
        state.collections.splice(0);
        state.token = undefined;
        await keycloak.logout({ redirectUri });
      },
      async login({ state }, redirectUri: string) {
        try {
          const auth = await keycloak.init({
            onLoad: 'login-required',
            redirectUri,
          });

          if (auth) {
            state.token = keycloak.token;
            apolloClient = new ApolloClient({
              link: setContext((_, { headers }) => {
                const { token } = keycloak;
                return {
                  headers: {
                    ...headers,
                    authorization: token ? `Bearer ${token}` : '',
                  },
                };
              }).concat(link),
              cache,
            });

            reloadTokenInterval = setInterval(() => {
              keycloak.updateToken(70)
                .then((refreshed) => {
                  if (refreshed) {
                    console.log(`Token refreshed ${refreshed}`);
                  } else if (keycloak.tokenParsed?.exp && keycloak.timeSkew) {
                    console.warn(`Token still valid for ${
                      Math.round(
                        keycloak.tokenParsed.exp
                        + keycloak.timeSkew
                        - new Date().getTime()
                        / 1000,
                      )
                    } seconds`);
                  }
                })
                .catch(() => {
                  console.error('Failed to refresh token');
                });
            }, 20000);
          }

          return auth;
        } catch (e) {
          console.log(e);
          console.error('Authenticated Failed');
          return false;
        }
      },
    },
    modules: {},
  });
}
