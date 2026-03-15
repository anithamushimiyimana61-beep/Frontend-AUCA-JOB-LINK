<template>
  <div class="app-layout" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- Sidebar Overlay (mobile) -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
      aria-hidden="true"
    ></div>

    <!-- Sidebar -->
    <aside class="sidebar" :aria-hidden="!sidebarOpen && isMobile" role="navigation" aria-label="Student navigation">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <div class="brand-logo" aria-hidden="true">JL</div>
          <span class="brand-name">AUCA <strong>Job-Link</strong></span>
        </div>
        <button
          class="sidebar-close btn btn-ghost btn-icon"
          @click="sidebarOpen = false"
          aria-label="Close navigation"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <!-- User info -->
      <div class="sidebar-user">
        <div class="user-avatar" aria-hidden="true">{{ authStore.userInitials }}</div>
        <div class="user-info">
          <p class="user-name">{{ authStore.user?.name }}</p>
          <p class="user-role">
            <span class="badge badge-accent">Student</span>
          </p>
        </div>
      </div>

      <!-- Nav Links -->
      <nav class="sidebar-nav" aria-label="Student menu">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="nav-link"
          :class="{ active: isActive(item) }"
          :aria-current="isActive(item) ? 'page' : undefined"
          @click="sidebarOpen = false"
        >
          <span class="nav-icon" aria-hidden="true" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </RouterLink>
      </nav>

      <!-- Logout -->
      <div class="sidebar-footer">
        <button class="nav-link logout-btn" @click="handleLogout" aria-label="Sign out of your account">
          <span class="nav-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </span>
          <span class="nav-label">Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Top bar -->
      <header class="topbar" role="banner">
        <button
          class="btn btn-ghost btn-icon topbar-menu"
          @click="sidebarOpen = true"
          aria-label="Open navigation menu"
          aria-expanded="sidebarOpen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <div class="topbar-title">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>

        <div class="topbar-actions">
          <RouterLink to="/student/jobs" class="btn btn-primary btn-sm" aria-label="Browse all job listings">
            Browse Jobs
          </RouterLink>
        </div>
      </header>

      <!-- Page Content -->
      <main id="main-content" class="page-content">
        <Transition name="fade" mode="out-in">
          <RouterView />
        </Transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useApplicationsStore } from '@/stores/applicationsStore'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const appsStore = useApplicationsStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

appsStore.init()

const sidebarOpen = ref(false)
const isMobile = computed(() => window.innerWidth < 768)

const myAppsCount = computed(() =>
  authStore.user ? appsStore.getByUser(authStore.user.id).length : 0
)

const navItems = computed(() => [
  {
    label: 'Dashboard', to: '/student/dashboard', name: 'student-dashboard',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
  },
  {
    label: 'Browse Jobs', to: '/student/jobs', name: 'job-listing',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>'
  },
  {
    label: 'My Applications', to: '/student/my-applications', name: 'my-applications',
    badge: myAppsCount.value > 0 ? myAppsCount.value : null,
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
  },
  {
    label: 'My Profile', to: '/student/profile', name: 'student-profile',
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  },
])

const pageTitle = computed(() => {
  const titles = {
    'student-dashboard': 'Dashboard',
    'job-listing': 'Browse Jobs',
    'job-detail': 'Job Details',
    'my-applications': 'My Applications',
    'student-profile': 'My Profile',
  }
  return titles[route.name] || 'AUCA Job-Link'
})

function isActive(item) {
  return route.name === item.name || (item.name === 'job-listing' && route.name === 'job-detail')
}

function handleLogout() {
  authStore.logout()
  toast.success('You have been signed out.')
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--clr-bg);
}
.sidebar {
  position: fixed;
  top: 0; left: 0; bottom: 0;
  width: var(--sidebar-width);
  background: var(--clr-primary);
  display: flex;
  flex-direction: column;
  z-index: 200;
  transition: transform var(--transition-base);
  overflow-y: auto;
}
.sidebar-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 199;
  backdrop-filter: blur(2px);
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-5);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.sidebar-brand { display: flex; align-items: center; gap: var(--space-3); }
.brand-logo {
  width: 32px; height: 32px;
  background: var(--clr-accent);
  color: var(--clr-primary);
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-weight: 800; font-size: 0.75rem; flex-shrink: 0;
}
.brand-name { font-family: var(--font-display); font-size: 0.9rem; color: rgba(255,255,255,0.8); }
.brand-name strong { color: var(--clr-accent); }
.sidebar-close { color: rgba(255,255,255,0.5); }
.sidebar-close:hover { color: #fff; background: rgba(255,255,255,0.08); }
.sidebar-user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.user-avatar {
  width: 38px; height: 38px;
  background: var(--clr-accent);
  color: var(--clr-primary);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-weight: 700; font-size: 0.85rem; flex-shrink: 0;
}
.user-name { font-size: 0.875rem; font-weight: 600; color: #fff; }
.user-role { margin-top: 2px; }
.sidebar-nav {
  flex: 1;
  padding: var(--space-4) var(--space-3);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 10px var(--space-3);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255,255,255,0.65);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  text-decoration: none;
}
.nav-link:hover { background: rgba(255,255,255,0.08); color: #fff; }
.nav-link.active { background: var(--clr-accent-glow); color: var(--clr-accent); font-weight: 600; }
.nav-icon { display: flex; align-items: center; flex-shrink: 0; }
.nav-label { flex: 1; }
.nav-badge {
  background: var(--clr-accent);
  color: var(--clr-primary);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
}
.sidebar-footer {
  padding: var(--space-3);
  border-top: 1px solid rgba(255,255,255,0.08);
}
.logout-btn { color: rgba(255,255,255,0.5); }
.logout-btn:hover { background: rgba(239,68,68,0.1); color: #fc8181; }
.main-wrapper {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.topbar {
  position: sticky; top: 0;
  height: var(--topbar-height);
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: 0 var(--space-6);
  z-index: 100;
  box-shadow: var(--shadow-sm);
}
.topbar-menu { display: none; }
.topbar-title { flex: 1; }
.page-title { font-size: 1.1rem; font-weight: 700; }
.page-content { flex: 1; padding: var(--space-6); }

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar-open .sidebar {
    transform: translateX(0);
  }
  .main-wrapper { margin-left: 0; }
  .topbar-menu { display: flex; }
  .page-content { padding: var(--space-4); }
}
</style>
