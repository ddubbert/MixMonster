import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/store';
import Home from '@/views/Home.vue';
import { exchangeToken, getValidAccessToken, loginUrl } from '@/utils/KeycloakManager';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { AccessTokenPayload } from '@/types/accessTokenPayload';

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

    if (requiresAuth) {
      const accessToken = await getValidAccessToken(fetch);
      if (accessToken) {
        await store.dispatch('setKeycloakToken', accessToken);
        next();
      } else {
        try {
          const redirectUri = window.location.origin + to.path;
          const { code } = to.query;
          if (code && typeof code === 'string') {
            const tokenPayload: AccessTokenPayload = await exchangeToken(redirectUri, code, fetch);
            tokenPayload.expiresIn *= 1000;
            await store.dispatch('setKeycloakToken', tokenPayload);
            next();
          } else {
            const url = loginUrl(redirectUri);
            window.location.href = url;
          }
        } catch (e) {
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
