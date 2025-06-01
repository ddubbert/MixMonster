import Vue from 'vue';
import Vuex, { Store, StoreOptions } from 'vuex';
import Keycloak from 'keycloak-js';
import {
  ApolloClient, InMemoryCache, createHttpLink, NormalizedCacheObject,
} from '@apollo/client';
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

let reloadTokenInterval: number | undefined;
let apolloClient: ApolloClient<NormalizedCacheObject>;
let errorTimeout: number | undefined;

export interface RootState {
  token: string | undefined;
  collections: Collection[];
  error: string;
  rootUrl: string;
  icon: string;
}

Vue.use(Vuex);

export default function createStore(keycloakInstance: Keycloak.KeycloakInstance): Store<RootState> {
  const httpLink = createHttpLink({
    uri: `http://${process.env.VUE_APP_FRONTEND_HOST}:${process.env.VUE_APP_FRONTEND_PORT}/graphql`,
  });

  const cache = new InMemoryCache();

  apolloClient = new ApolloClient({
    link: httpLink,
    cache,
  });

  const rootUrl = `http://${process.env.VUE_APP_FRONTEND_HOST}:${process.env.VUE_APP_FRONTEND_PORT}`;
  const randomIcon = `${rootUrl}/mixmonster_${Math.floor(Math.random() * 6) + 1}.png`;

  const storeOptions: StoreOptions<RootState> = {
    state: {
      token: undefined,
      collections: [],
      error: '',
      rootUrl,
      icon: randomIcon,
    },
    getters: {
      getCollection: (state) => (collectionId: string): Collection | undefined => state
        .collections
        .find((col) => col.id === collectionId),
      isAuthenticated: (state): boolean => !!state.token && keycloakInstance.authenticated === true,
    },
    mutations: {
      setToken(state, token: string | undefined) {
        state.token = token;
      },
      addCollection(state, collection: Collection) {
        state.collections.push(collection);
      },
      addCollections(state, collections: Collection[]) {
        state.collections = collections;
      },
      updateCollection(state, collection: Collection) {
        const index = state.collections.map((x) => x.id)
          .indexOf(collection.id);
        if (index > -1) {
          Vue.set(state.collections, index, collection);
        }
      },
      deleteCollection(state, id: string) {
        const index = state.collections.map((x) => x.id)
          .indexOf(id);
        if (index > -1) {
          state.collections.splice(index, 1);
        }
      },
      activateError(state, text: string) {
        clearTimeout(errorTimeout);
        state.error = text;
        errorTimeout = setTimeout(() => {
          state.error = '';
        }, 10000);
      },
    },
    actions: {
      setKeycloakToken({ commit }, token: string | undefined) {
        commit('setToken', token);

        if (token) {
          const authLink = setContext((_, { headers }) => ({
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : '',
            },
          }));

          apolloClient = new ApolloClient({
            link: authLink.concat(httpLink),
            cache,
          });

          if (reloadTokenInterval) {
            clearInterval(reloadTokenInterval);
          }
          reloadTokenInterval = setInterval(() => {
            keycloakInstance.updateToken(70)
              .then((refreshed) => {
                if (refreshed) {
                  console.log(`Token refreshed ${refreshed}`);
                  commit('setToken', keycloakInstance.token);
                } else if (keycloakInstance.tokenParsed?.exp && keycloakInstance.timeSkew) {
                  console.warn(`Token still valid for ${
                    Math.round(
                      keycloakInstance.tokenParsed.exp
                    + keycloakInstance.timeSkew
                    - new Date().getTime()
                    / 1000,
                    )
                  } seconds`);
                }
              })
              .catch(() => {
                console.error('Failed to refresh token. User might need to re-login.');
                commit('activateError', 'Sitzung abgelaufen. Bitte erneut anmelden.');
              });
          }, 20000);
        } else {
          apolloClient = new ApolloClient({
            link: httpLink,
            cache,
          });
          if (reloadTokenInterval) {
            clearInterval(reloadTokenInterval);
            reloadTokenInterval = undefined;
          }
        }
      },

      async login({ commit }, redirectUri: string) {
        try {
          await keycloakInstance.login({ redirectUri });
          return true;
        } catch (e) {
          console.error('Explicit login failed or was cancelled:', e);
          commit('activateError', 'Login fehlgeschlagen.');
          return false;
        }
      },

      async logout({ commit }) {
        clearInterval(reloadTokenInterval);
        reloadTokenInterval = undefined;
        commit('setToken', undefined);
        commit('addCollections', []); // Clear collections on logout
        apolloClient = new ApolloClient({
          link: httpLink,
          cache,
        });
        await keycloakInstance.logout({ redirectUri: `${window.location.origin}/` });
      },

      async getCollections({ commit, getters }) {
        if (!getters.isAuthenticated) {
          commit('activateError', 'Nicht authentifiziert zum Abrufen von Sammlungen.');
          return;
        }
        try {
          const requestedCollections = (await apolloClient
            .query<GetCollectionsQuery>({ query: GetCollections })).data.getCollections;
          commit('addCollections', requestedCollections);
        } catch (e) {
          console.error('Error fetching collections:', e);
          commit('activateError', 'Datenserver ist nicht erreichbar oder GraphQL-Fehler.');
        }
      },

      async getCollection(
        { state, commit, getters },
        collectionId: string,
      ): Promise<Collection | undefined> {
        if (!getters.isAuthenticated) {
          commit('activateError', 'Nicht authentifiziert zum Abrufen von Sammlungen.');
          return undefined;
        }
        try {
          const requestedCollection = (await apolloClient
            .query<GetCollectionQuery>({
              query: GetCollection,
              variables: { id: collectionId },
            })).data.getCollection;

          const existingIndex = state.collections.findIndex(
            (col) => col.id === requestedCollection.id,
          );
          if (existingIndex > -1) {
            commit('updateCollection', requestedCollection);
          } else {
            commit('addCollection', requestedCollection);
          }
          return requestedCollection;
        } catch (e) {
          console.error('Error fetching collection:', e);
          commit('activateError', 'MixMonster nicht gefunden oder GraphQL-Fehler.');
          return undefined;
        }
      },
      async createCollection(
        { commit, getters },
        variables: CreateCollectionMutationVariables,
      ) {
        if (!getters.isAuthenticated) {
          commit('activateError', 'Nicht authentifiziert zum Erstellen von Sammlungen.');
          return;
        }
        try {
          const createdCollection = (await apolloClient
            .mutate<CreateCollectionMutation>({
              mutation: CreateCollection,
              variables,
            })).data?.createCollection;

          if (createdCollection) {
            commit('addCollection', createdCollection);
          }
        } catch (e) {
          console.error('Error creating collection:', e);
          commit('activateError', 'Erstellung des MixMonsters fehlgeschlagen.');
        }
      },
      async updateCollection(
        { commit, getters },
        variables: UpdateCollectionMutationVariables,
      ) {
        if (!getters.isAuthenticated) {
          commit('activateError', 'Nicht authentifiziert zum Aktualisieren von Sammlungen.');
          return;
        }
        try {
          const updatedCollection = (await apolloClient
            .mutate<UpdateCollectionMutation>({
              mutation: UpdateCollection,
              variables,
            })).data?.updateCollection;

          if (updatedCollection) {
            commit('updateCollection', updatedCollection);
          }
        } catch (e) {
          console.error('Error updating collection:', e);
          commit('activateError', 'Aktualisierung des MixMonsters fehlgeschlagen.');
        }
      },
      async removeCollection({ commit, getters }, id: string) {
        if (!getters.isAuthenticated) {
          commit('activateError', 'Nicht authentifiziert zum Entfernen von Sammlungen.');
          return;
        }
        try {
          const deletedCollection = (await apolloClient
            .mutate<DeleteCollectionMutation>({
              mutation: DeleteCollection,
              variables: { id },
            })).data?.deleteCollection;

          if (deletedCollection) commit('deleteCollection', id);
        } catch (e) {
          console.error('Error removing collection:', e);
          commit('activateError', 'Entfernen des MixMonsters fehlgeschlagen.');
        }
      },
    },
    modules: {},
  };

  return new Vuex.Store(storeOptions);
}

// import Vue from 'vue';
// import Vuex, { Store } from 'vuex';
// import Keycloak from 'keycloak-js';
// import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import {
//   Collection,
//   CreateCollection,
//   CreateCollectionMutation,
//   CreateCollectionMutationVariables,
//   DeleteCollection,
//   DeleteCollectionMutation,
//   GetCollection,
//   GetCollectionQuery,
//   GetCollections,
//   GetCollectionsQuery,
//   UpdateCollection,
//   UpdateCollectionMutation,
//   UpdateCollectionMutationVariables,
// } from '@/types/generated/graphql';
//
// Vue.use(Vuex);
//
// export default function createStore(keycloak: Keycloak.KeycloakInstance):
//   Store<{ collections: Collection[] }> {
//   let reloadTokenInterval = 0;
//
//   const link = createHttpLink({
//     uri: `http://${process.env.VUE_APP_FRONTEND_HOST}:${process.env.VUE_APP_FRONTEND_PORT}/graphql`,
//   });
//
//   const cache = new InMemoryCache();
//
//   let apolloClient = new ApolloClient({
//     link,
//     cache,
//   });
//
//   let errorTimeout: number | undefined;
//
//   const rootUrl = `http://${process.env.VUE_APP_FRONTEND_HOST}:${process.env.VUE_APP_FRONTEND_PORT}`;
//   const randomIcon = `${rootUrl}/mixmonster_${Math.floor(Math.random() * 6) + 1}.png`;
//
//   return new Vuex.Store({
//     state: {
//       token: undefined as string | undefined,
//       collections: [] as Collection[],
//       error: '',
//       rootUrl,
//       icon: randomIcon,
//     },
//     getters: {
//       getCollection: (state) => (collectionId: string): Collection | undefined => state
//         .collections
//         .find((col) => col.id === collectionId),
//     },
//     mutations: {
//       addCollection(state, collection: Collection) {
//         state.collections.push(collection);
//       },
//       updateCollection(state, collection: Collection) {
//         const index = state.collections.map((x) => x.id)
//           .indexOf(collection.id);
//         Vue.set(state.collections, index, collection);
//       },
//       deleteCollection(state, id: string) {
//         const index = state.collections.map((x) => x.id)
//           .indexOf(id);
//         state.collections.splice(index, 1);
//       },
//       activateError(state, text: string) {
//         clearTimeout(errorTimeout);
//         state.error = text;
//         errorTimeout = setTimeout(() => {
//           state.error = '';
//         }, 10000);
//       },
//     },
//     actions: {
//       async getCollections({ state, commit }) {
//         try {
//           const requestedCollections = (await apolloClient
//             .query<GetCollectionsQuery>({ query: GetCollections })).data.getCollections;
//           state.collections.splice(0, state.collections.length, ...requestedCollections);
//         } catch {
//           commit('activateError', 'Datenserver ist nicht erreichbar.');
//         }
//       },
//       async getCollection(
//         { state, commit },
//         collectionId: string,
//       ): Promise<Collection | undefined> {
//         try {
//           const requestedCollection = (await apolloClient
//             .query<GetCollectionQuery>({
//               query: GetCollection,
//               variables: { id: collectionId },
//             })).data.getCollection;
//
//           state.collections.push(requestedCollection);
//           return requestedCollection;
//         } catch (e) {
//           commit('activateError', 'MixMonster nicht gefunden.');
//           return undefined;
//         }
//       },
//       async createCollection(
//         { commit },
//         variables: CreateCollectionMutationVariables,
//       ) {
//         try {
//           const createdCollection = (await apolloClient
//             .mutate<CreateCollectionMutation>({
//               mutation: CreateCollection,
//               variables,
//             })).data?.createCollection;
//
//           if (createdCollection) {
//             commit('addCollection', createdCollection);
//           }
//         } catch {
//           commit('activateError', 'Erstellung des MixMonsters fehlgeschlagen.');
//         }
//       },
//       async updateCollection(
//         { commit },
//         variables: UpdateCollectionMutationVariables,
//       ) {
//         try {
//           const updatedCollection = (await apolloClient
//             .mutate<UpdateCollectionMutation>({
//               mutation: UpdateCollection,
//               variables,
//             })).data?.updateCollection;
//
//           if (updatedCollection) {
//             commit('updateCollection', updatedCollection);
//           }
//         } catch {
//           commit('activateError', 'Aktualisierung des MixMonsters fehlgeschlagen.');
//         }
//       },
//       async removeCollection({ commit }, id: string) {
//         try {
//           const deletedCollection = (await apolloClient
//             .mutate<DeleteCollectionMutation>({
//               mutation: DeleteCollection,
//               variables: { id },
//             })).data?.deleteCollection;
//
//           if (deletedCollection) commit('deleteCollection', id);
//         } catch {
//           commit('activateError', 'Entfernen des MixMonsters fehlgeschlagen.');
//         }
//       },
//       async logout({ state }, redirectUri: string) {
//         clearInterval(reloadTokenInterval);
//         state.collections.splice(0);
//         state.token = undefined;
//         await keycloak.logout({ redirectUri });
//       },
//       async login({ state, commit }, redirectUri: string) {
//         try {
//           const auth = await keycloak.init({
//             onLoad: 'login-required',
//             redirectUri,
//           });
//
//           if (auth) {
//             state.token = keycloak.token;
//             apolloClient = new ApolloClient({
//               link: setContext((_, { headers }) => {
//                 const { token } = keycloak;
//                 return {
//                   headers: {
//                     ...headers,
//                     authorization: token ? `Bearer ${token}` : '',
//                   },
//                 };
//               }).concat(link),
//               cache,
//             });
//
//             reloadTokenInterval = setInterval(() => {
//               keycloak.updateToken(70)
//                 .then((refreshed) => {
//                   if (refreshed) {
//                     console.log(`Token refreshed ${refreshed}`);
//                   } else if (keycloak.tokenParsed?.exp && keycloak.timeSkew) {
//                     console.warn(`Token still valid for ${
//                       Math.round(
//                         keycloak.tokenParsed.exp
//                         + keycloak.timeSkew
//                         - new Date().getTime()
//                         / 1000,
//                       )
//                     } seconds`);
//                   }
//                 })
//                 .catch(() => {
//                   console.error('Failed to refresh token');
//                 });
//             }, 20000);
//           }
//
//           return auth;
//         } catch (e) {
//           commit('activateError', 'Login fehlgeschlagen.');
//           return false;
//         }
//       },
//     },
//     modules: {},
//   });
// }
