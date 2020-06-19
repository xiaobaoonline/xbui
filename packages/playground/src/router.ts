import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/filter',
      name: 'filter',
      component: () => import(/* webpackChunkName: "filter" */ './views/filter/FilterEdit.vue'),
    },
    {
      path: '/table',
      name: 'table',
      component: () => import(/* webpackChunkName: "table" */ './views/table/TableEdit.vue'),
    },
  ],
})
