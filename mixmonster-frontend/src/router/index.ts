import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/collections',
    name: 'Collections',
    component: () => import(/* webpackChunkName: "collections" */ '../views/Collections.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/collections/edit/:collectionId',
    name: 'EditCollection',
    component: () => import(/* webpackChunkName: "editCollection" */ '../views/EditCollection.vue'),
    props: true,
  },
  {
    path: '/collections/create',
    name: 'CreateCollection',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateCollection.vue'),
  },
  {
    path: '/collections/preview/:collectionId',
    name: 'PreviewCollection',
    component: () => import(/* webpackChunkName: "about" */ '../views/PreviewCollection.vue'),
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
