import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/store';
import Home from '@/views/Home.vue';
import { exchangeToken, getValidAccessToken, loginUrl } from '@/utils/KeycloakManager';

Vue.use(VueRouter);

function createRouter(store: Store<RootState>): VueRouter {
  const routes: Array<RouteConfig> = [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: false },
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: false },
    },
    {
      path: '/collections',
      name: 'Collections',
      component: () => import('../views/Collections.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/impressum',
      name: 'Impressum',
      component: () => import('../views/Impressum.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/privacy',
      name: 'Datenschutz',
      component: () => import('../views/Privacy.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/disclaimer',
      name: 'Haftung',
      component: () => import('../views/Disclaimer.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/collections/edit/:collectionId',
      name: 'EditCollection',
      component: () => import('../views/EditCollection.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/collections/create',
      name: 'CreateCollection',
      component: () => import('../views/CreateCollection.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/collections/preview/:collectionId',
      name: 'PreviewCollection',
      component: () => import('../views/PreviewCollection.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/collections/use/:collectionId',
      name: 'UseCollection',
      component: () => import('../views/UseCollection.vue'),
      props: true,
      meta: { requiresAuth: false },
    },
    // Catch-all for 404 or redirect to home if not found
    {
      path: '*',
      redirect: '/',
    },
  ];

  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
  });

  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    console.log(window.location.origin + to.fullPath);
    console.log(to.params);

    if (requiresAuth) {
      const accessToken = await getValidAccessToken(fetch);
      if (accessToken) {
        await store.dispatch('setKeycloakToken', accessToken);
        next();
      } else {
        try {
          console.log(`Authenticating for protected route: ${to.fullPath}`);
          const redirectUri = window.location.origin + to.fullPath;
          const { code } = to.query;
          if (code && typeof code === 'string') {
            const token = await exchangeToken(redirectUri, code, fetch);
            await store.dispatch('setKeycloakToken', token);
            next();
          } else {
            const url = loginUrl(redirectUri);
            window.location.href = url;
          }
          // const auth = await Vue.prototype.$keycloak.init({
          //   onLoad: 'login-required',
          //   redirectUri: window.location.origin + to.fullPath,
          // });
          // console.log(auth);
          // if (auth) {
          //   console.log(Vue.prototype.$keycloak.token);
          //   store.commit('setToken', Vue.prototype.$keycloak.token);
          //   next();
          // }
        } catch (e) {
          console.error('Authentication failed during navigation guard:', e);
          store.dispatch('activateError', 'Login für diese Seite erforderlich oder fehlgeschlagen.');
          next({ name: 'Home' });
        }
      }
    } else {
      next();
    }
  });

  return router;
}

export default createRouter;
