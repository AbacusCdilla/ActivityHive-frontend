import { createRouter, createWebHashHistory } from 'vue-router';
import LessonCart from '../components/LessonCart.vue';
import CheckoutPage from '../components/CheckoutPage.vue';
import Lessons from '../components/LessonList.vue';

const routes = [
  { path: '/cart', component: LessonCart },
  { path: '/checkout', component: CheckoutPage },
  { path: '/lessons', component: Lessons },
  { path: '/', redirect: '/lessons' }, // default route
];

const router = createRouter({
  history: createWebHashHistory(), // ✅ Use Hash History for GitHub Pages
  routes,
});

export default router;