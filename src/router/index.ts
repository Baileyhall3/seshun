import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import UserProfile from '@/views/UserProfile.vue';
import Search from '@/views/Search.vue';
import SeshunsCalendar from '@/views/SeshunsCalendar.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import BusinessSetupStep1 from '@/views/BusinessSetupStep1.vue';
import BusinessSetupStep2 from '@/views/BusinessSetupStep2.vue';
import BusinessSetupStep3 from '@/views/BusinessSetupStep3.vue';
import BusinessSetupComplete from '@/views/BusinessSetupComplete.vue';
import BusinessDashboard from '@/views/BusinessDashboard.vue';
import EditProfile from '@/views/EditProfile.vue';
import ProfileDetails from '@/views/ProfileDetails.vue';
import BusinessSettings from '@/views/BusinessSettings.vue';
import BusinessSettingsWorkingHrs from '@/views/BusinessSettingsWorkingHrs.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-profile',
    name: 'Profile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-profile/edit-profile',
    name: 'Edit Profile',
    component: EditProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-profile/profile-details',
    name: 'Profile Details',
    component: ProfileDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-calendar',
    name: 'My Calendar',
    component: SeshunsCalendar,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/business-setup/step1',
    name: 'Business Setup Step 1',
    component: BusinessSetupStep1,
    meta: { requiresAuth: true }
  },
  {
    path: '/business-setup/step2',
    name: 'Business Setup Step 2',
    component: BusinessSetupStep2,
    meta: { requiresAuth: true }
  },
  {
    path: '/business-setup/step3',
    name: 'Business Setup Step 3',
    component: BusinessSetupStep3,
    meta: { requiresAuth: true }
  },
  {
    path: '/business-setup/complete',
    name: 'Business Setup Complete',
    component: BusinessSetupComplete,
    meta: { requiresAuth: true }
  },
  {
    path: '/business-dashboard',
    name: 'Business Dashboard',
    component: BusinessDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/business-settings',
    name: 'Business Settings',
    component: BusinessSettings,
    meta: { requiresAuth: true }
  },
  {
    path: '/business-settings/working-times',
    name: 'Business Working Times',
    component: BusinessSettingsWorkingHrs,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      // Import user store here to avoid circular dependency
      const { isAuthenticated, initializeAuth } = await import('@/stores/userStore');
      
      // Check if already authenticated
      if (isAuthenticated.value) {
        next();
        return;
      }
      
      // Try to initialize auth (check for existing session)
      const authResult = await initializeAuth();
      
      if (!authResult) {
        // Redirect to login if not authenticated
        next('/login');
        return;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      next('/login');
      return;
    }
  }
  next();
});

export default router
