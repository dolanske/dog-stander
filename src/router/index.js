import { createWebHistory } from 'vue-router'

import Application from './routes/Application.vue'

export const setupRouter = {
  history: createWebHistory(),
  routes: [
    {
      path: '/app',
      component: Application,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/app',
    },
  ],
}
