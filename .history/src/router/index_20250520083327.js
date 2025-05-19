import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactView from '@/views/ContactView.vue'
import AboutView from '../views/AboutView.vue'
import PlantadviceView from '@/views/PlantadviceView.vue'
import BirdView from '@/views/BirdView.vue'
import PlantDetailView from '@/views/PlantDetailView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import LayoutView from '@/views/LayoutView.vue'
import GardenGuideView from '@/views/GardenGuideView.vue'
import NestingGuideView from '@/views/NestingGuideView.vue'
import LearningHub from '@/views/LearningHub.vue'
import GardenLearning from '@/views/GardenLearning.vue'
import QuizView from '@/views/QuizView.vue'
import BirdLearning from '@/views/BirdLearning.vue'
import PlantingCalendarView from '@/views/PlantingCalendarView.vue'
import BiodiversityDashboard from '@/views/BiodiversityDashboard.vue'
import TableAuView from '@/views/TableAuView.vue'

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
      path: '/layout',
      name: 'Layout',
      component: LayoutView,
      meta: { requiresAuth: true },
    },
    {
      path: '/plant/:plantName',
      name: 'PlantDetail',
      component: PlantDetailView,
      props: (route) => ({
        plantName: route.params.plantName,
        recommendedPlantNamesString: route.query.recommendedPlantNames || '', // Map query to prop
        hemisphere: route.query.hemisphere || 'southern', // Map query to prop
      }),
      meta: { requiresAuth: true },
    },
    {
      path: '/gardenguide',
      name: 'Gardenguie',
      component: GardenGuideView,
      meta: { requiresAuth: true },
    },
    {
      path: '/plant/:plantName/calendar',
      name: 'PlantingCalendar',
      component: PlantingCalendarView,
      props: (route) => ({
        plantName: route.params.plantName, // From route param
        userHemisphere: route.query.hemisphere || 'southern', // From query
        recommendedPlantNamesString: route.query.recommendedPlantNames || '', // From query
      }),
      meta: { requiresAuth: true },
    },
    {
      path: '/nesting',
      name: 'nesting',
      component: NestingGuideView,
      meta: { requiresAuth: true },
    },
    {
      path: '/learninghub',
      name: 'learninghub',
      component: LearningHub,
      meta: { requiresAuth: true },
    },
    {
      path: '/birdlearning',
      name: 'Birdlearning',
      component: BirdLearning,
      meta: { requiresAuth: true },
    },
    {
      path: '/gardenlearning',
      name: 'gardenlearning',
      component: GardenLearning,
      meta: { requiresAuth: true },
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: QuizView,
      meta: { requiresAuth: true },
    },
    {
      path: '/bio',
      name: 'Bio',
      component: BiodiversityDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/table',
      name: 'table',
      component: TableAuView,
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
