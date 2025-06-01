import 'vue-class-component/hooks';
import Vue from 'vue';
import Keycloak from 'keycloak-js';
import App from './App.vue';
import createRouter from './router';
import createStore from './store';
import vuetify from './plugins/vuetify';

const keycloak = Keycloak('/keycloak.json');
Vue.prototype.$keycloak = keycloak;
Vue.config.productionTip = false;

const store = createStore(keycloak);
const router = createRouter(store, keycloak);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

// keycloak.init({
//   onLoad: 'check-sso',
//   silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
//   pkceMethod: 'S256',
// })
//   .then((authenticated) => {
//     if (authenticated) {
//       console.log('User is authenticated on app startup.');
//       store.dispatch('setKeycloakToken', keycloak.token);
//     } else {
//       console.log('User is NOT authenticated on app startup.');
//     }
//
//     new Vue({
//       router,
//       store,
//       vuetify,
//       render: (h) => h(App),
//     }).$mount('#app');
//   })
//   .catch((error) => {
//     console.error('Failed to initialize Keycloak adapter:', error);
//
//     new Vue({
//       router,
//       store,
//       vuetify,
//       render: (h) => h(App),
//     }).$mount('#app');
//   });

// import 'vue-class-component/hooks';
// import Vue from 'vue';
// import Keycloak from 'keycloak-js';
// import App from './App.vue';
// import router from './router';
// import createStore from './store';
// import vuetify from './plugins/vuetify';
//
// const keycloak = Keycloak();
// Vue.prototype.$keycloak = keycloak;
// Vue.config.productionTip = false;
//
// const store = createStore(keycloak);
//
// new Vue({
//   router,
//   store,
//   vuetify,
//   render: (h) => h(App),
// }).$mount('#app');

// keycloak.init({ onLoad: 'login-required', redirectUri: 'http://localhost:8080/collections' }).then((auth) => {
//   if (!auth) {
//     window.location.reload();
//   } else {
//     const store = createStore(keycloak);
//     new Vue({
//       router,
//       store,
//       vuetify,
//       render: (h) => h(App),
//       async created() {
//         await store.dispatch('getCollections');
//       },
//     }).$mount('#app');
//   }
//
//   // Token Refresh
//   setInterval(() => {
//     keycloak.updateToken(70).then((refreshed) => {
//       if (refreshed) {
//         console.log(`Token refreshed ${refreshed}`);
//       } else if (keycloak.tokenParsed?.exp && keycloak.timeSkew) {
//         console.warn(`Token still valid for ${
//           Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000)
//         } seconds`);
//       }
//     }).catch(() => {
//       console.error('Failed to refresh token');
//     });
//   }, 6000);
// }).catch((e) => {
//   console.log(e);
//   console.error('Authenticated Failed');
// });
