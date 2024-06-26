import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/tabclass',
    name: 'tabclass',
    component: () => import(/* webpackChunkName: "tabregioni" */ '../views/tabclass.vue')
  },
  {
    path: '/grafclass',
    name: 'grafclass',
    component: () => import(/* webpackChunkName: "tabregioni" */ '../views/grafclass.vue')
  },
  {
    path: '/tabregione',
    name: 'tabregione',
    component: () => import(/* webpackChunkName: "tabregioni" */ '../views/tabregione.vue')
  }
  ,
  {
    path: '/grafregione',
    name: 'grafregione',
    component: () => import(/* webpackChunkName: "tabregioni" */ '../views/grafregione.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
