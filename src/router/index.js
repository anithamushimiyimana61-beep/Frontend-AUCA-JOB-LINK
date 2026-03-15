import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Lazy-loaded views
const LandingView = () => import('@/views/LandingView.vue')
const LoginView = () => import('@/views/auth/LoginView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')

// Student views
const StudentLayout = () => import('@/views/student/StudentLayout.vue')
const StudentDashboard = () => import('@/views/student/StudentDashboard.vue')
const JobListingView = () => import('@/views/student/JobListingView.vue')
const JobDetailView = () => import('@/views/student/JobDetailView.vue')
const MyApplicationsView = () => import('@/views/student/MyApplicationsView.vue')
const StudentProfileView = () => import('@/views/student/StudentProfileView.vue')

// Admin views
const AdminLayout = () => import('@/views/admin/AdminLayout.vue')
const AdminDashboard = () => import('@/views/admin/AdminDashboard.vue')
const ManageJobsView = () => import('@/views/admin/ManageJobsView.vue')
const CreateJobView = () => import('@/views/admin/CreateJobView.vue')
const EditJobView = () => import('@/views/admin/EditJobView.vue')
const ApplicationsView = () => import('@/views/admin/ApplicationsView.vue')

const NotFoundView = () => import('@/views/NotFoundView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/admin-login', name: 'admin-login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },

    // Student routes
    {
      path: '/student',
      component: StudentLayout,
      meta: { requiresAuth: true, role: 'student' },
      children: [
        { path: '', redirect: { name: 'student-dashboard' } },
        { path: 'dashboard', name: 'student-dashboard', component: StudentDashboard },
        { path: 'jobs', name: 'job-listing', component: JobListingView },
        { path: 'jobs/:id', name: 'job-detail', component: JobDetailView },
        { path: 'my-applications', name: 'my-applications', component: MyApplicationsView },
        { path: 'profile', name: 'student-profile', component: StudentProfileView },
      ]
    },

    // Admin routes
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '', redirect: { name: 'admin-dashboard' } },
        { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboard },
        { path: 'jobs', name: 'manage-jobs', component: ManageJobsView },
        { path: 'jobs/create', name: 'create-job', component: CreateJobView },
        { path: 'jobs/edit/:id', name: 'edit-job', component: EditJobView },
        { path: 'applications', name: 'admin-applications', component: ApplicationsView },
      ]
    },

    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

// Auth Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  auth.restoreSession()

  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }
    if (to.meta.role && auth.user.role !== to.meta.role) {
      // Redirect to correct dashboard
      return next({ name: auth.isAdmin ? 'admin-dashboard' : 'student-dashboard' })
    }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return next({ name: auth.isAdmin ? 'admin-dashboard' : 'student-dashboard' })
  }

  next()
})

export default router
