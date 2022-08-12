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
    component: () => import('../views/Collections.vue'),
  },
  {
    path: '/impressum',
    name: 'Impressum',
    component: () => import('../views/Impressum.vue'),
  },
  {
    path: '/privacy',
    name: 'Datenschutz',
    component: () => import('../views/Privacy.vue'),
  },
  {
    path: '/collections/edit/:collectionId',
    name: 'EditCollection',
    component: () => import('../views/EditCollection.vue'),
    props: true,
  },
  {
    path: '/collections/create',
    name: 'CreateCollection',
    component: () => import('../views/CreateCollection.vue'),
  },
  {
    path: '/collections/preview/:collectionId',
    name: 'PreviewCollection',
    component: () => import('../views/PreviewCollection.vue'),
    props: true,
  },
  {
    path: '/collections/use/:collectionId',
    name: 'UseCollection',
    component: () => import('../views/UseCollection.vue'),
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
