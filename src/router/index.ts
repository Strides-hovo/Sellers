import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router';

const router: Router = createRouter({
  history: createWebHistory('/Sellers/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/Sellers.vue')
    },
  ]
})

export default router
