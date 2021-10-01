import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
  {
    path: '/collections',
    name: 'Collections',
    component: () => import(/* webpackChunkName: "about" */ '../views/Collections.vue'),
  },
  {
    path: '/create-collection',
    name: 'CreateCollection',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateCollection.vue'),
  },
  {
    path: '/edit-collection/:collectionIndex',
    name: 'EditCollection',
    component: () => import(/* webpackChunkName: "about" */ '../views/EditCollection.vue'),
    props: true,
  },
  {
    path: '/preview-collection/:collectionIndex',
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
