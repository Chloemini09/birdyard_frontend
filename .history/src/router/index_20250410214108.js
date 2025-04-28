import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactView from '@/views/ContactView.vue'
import AboutView from '../views/AboutView.vue'
import PlantadviceView from '@/views/PlantadviceView.vue'
import BirdView from '@/views/BirdView.vue'
import PlantDetailView from '@/views/PlantDetailView.vue'
import WelcomeView from '@/views/WelcomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView,
      meta: { requiresAuth: false },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: true },
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: { requiresAuth: true },
    },
    {
      path: '/plantadvice',
      name: 'plantadvice',
      component: PlantadviceView,
      meta: { requiresAuth: true },
    },
    {
      path: '/bird',
      name: 'bird',
      component: BirdView,
      meta: { requiresAuth: true },
    },
    {
      path: '/plant/:plantName',
      name: 'PlantDetail',
      component: PlantDetailView,
      props: true,
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'welcome' })
  } else {
    next()
  }
})

export default router
