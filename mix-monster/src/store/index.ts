import Vue from 'vue';
import Vuex from 'vuex';
import { Category, Collection } from '@/types/collection';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    collections: [
      { id: '0', title: 'hallo', categories: [] as Category[] } as Collection,
      { id: '1', title: 'tschüss', categories: [] as Category[] } as Collection,
    ],
    counter: 2,
  },
  mutations: {
    addCollection(state, collection : Collection) {
      state.collections.push(collection);
      state.counter += 1;
    },
    updateCollection(state, collection: Collection) {
      const index = state.collections.map((x) => x.id).indexOf(collection.id);
      Vue.set(state.collections, index, collection);
    },
    deleteCollection(state, collection: Collection) {
      const index = state.collections.map((x) => x.id).indexOf(collection.id);
      state.collections.splice(index, 1);
    },
  },
  actions: {
    createCollection({ commit, state }, collection : Collection) {
      // Todo
      const newCollection = { ...collection };
      newCollection.id = `${state.counter}`;
      commit('addCollection', newCollection);
    },
    updateCollection({ commit }, collection : Collection) {
      // Todo
      commit('updateCollection', collection);
    },
    removeCollection({ commit }, collection : Collection) {
      // Todo
      commit('deleteCollection', collection);
    },
  },
  modules: {
  },
});
