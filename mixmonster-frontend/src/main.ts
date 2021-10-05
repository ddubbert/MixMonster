import 'vue-class-component/hooks';
import Vue from 'vue';
import Keycloak from 'keycloak-js';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

const keycloak = Keycloak();
Vue.prototype.$keycloak = keycloak;
Vue.config.productionTip = false;

keycloak.init({ onLoad: 'login-required', redirectUri: 'http://localhost:8080/' }).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.log('Authorized');
    new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app');
  }

  // Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.log(`Token refreshed ${refreshed}`);
      } else {
        console.warn('Token not refreshed.');
        if (keycloak.tokenParsed?.exp && keycloak.timeSkew) {
          console.warn(`Token still valid for ${
            Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000)
          } seconds`);
        }
      }
    }).catch(() => {
      console.error('Failed to refresh token');
    });
  }, 6000);
}).catch((e) => {
  console.log(e);
  console.error('Authenticated Failed');
});

// new Vue({
//   router,
//   store,
//   vuetify,
//   render: (h) => h(App),
// }).$mount('#app');
