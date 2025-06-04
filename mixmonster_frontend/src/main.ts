import 'vue-class-component/hooks';
import Vue from 'vue';
import App from './App.vue';
import createRouter from './router';
import createStore from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

const store = createStore();
const router = createRouter(store);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
