<template>
  <div class="profile-page">
    <div class="profile-header card card-body">
      <div class="avatar-large" aria-hidden="true">{{ authStore.userInitials }}</div>
      <div class="profile-info">
        <h2 class="profile-name">{{ authStore.user?.name }}</h2>
        <p class="profile-email">{{ authStore.user?.email }}</p>
        <div class="profile-badges">
          <span class="badge badge-accent">Student</span>
          <span v-if="authStore.user?.program" class="badge badge-primary">{{ authStore.user?.program }}</span>
          <span v-if="authStore.user?.year" class="badge badge-gold">{{ authStore.user?.year }}</span>
        </div>
      </div>
    </div>

    <div class="profile-grid">
      <!-- Details -->
      <section class="card card-body" aria-labelledby="details-heading">
        <h3 id="details-heading" class="section-heading">Account Details</h3>
        <div class="detail-list">
          <div class="detail-item">
            <span class="detail-label">Full Name</span>
            <span class="detail-val">{{ authStore.user?.name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Email</span>
            <span class="detail-val">{{ authStore.user?.email }}</span>
          </div>
          <div class="detail-item" v-if="authStore.user?.studentId">
            <span class="detail-label">Student ID</span>
            <span class="detail-val">{{ authStore.user?.studentId }}</span>
          </div>
          <div class="detail-item" v-if="authStore.user?.program">
            <span class="detail-label">Program</span>
            <span class="detail-val">{{ authStore.user?.program }}</span>
          </div>
          <div class="detail-item" v-if="authStore.user?.year">
            <span class="detail-label">Year</span>
            <span class="detail-val">{{ authStore.user?.year }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Role</span>
            <span class="detail-val">Student / Job Seeker</span>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="card card-body" aria-labelledby="stats-heading">
        <h3 id="stats-heading" class="section-heading">Activity Overview</h3>
        <div class="stats-stack">
          <div class="stat-row" v-for="s in profileStats" :key="s.label">
            <span class="stat-row-label">{{ s.label }}</span>
            <span class="stat-row-value">{{ s.value }}</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Notice -->
    <div class="notice alert alert-warning" role="note">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <span>This is a demo application. Profile editing is not available in this version.</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useApplicationsStore } from '@/stores/applicationsStore'

const authStore = useAuthStore()
const appsStore = useApplicationsStore()
appsStore.init()

const myApps = computed(() => authStore.user ? appsStore.getByUser(authStore.user.id) : [])
const profileStats = computed(() => [
  { label: 'Total Applications', value: myApps.value.length },
  { label: 'Pending Review', value: myApps.value.filter(a => a.status === 'pending').length },
  { label: 'Shortlisted', value: myApps.value.filter(a => a.status === 'shortlisted').length },
  { label: 'Accepted', value: myApps.value.filter(a => a.status === 'accepted').length },
  { label: 'Rejected', value: myApps.value.filter(a => a.status === 'rejected').length },
])
</script>

<style scoped>
.profile-page { display: flex; flex-direction: column; gap: var(--space-5); max-width: 800px; }
.profile-header { display: flex; align-items: center; gap: var(--space-6); flex-wrap: wrap; }
.avatar-large {
  width: 80px; height: 80px;
  background: var(--clr-primary);
  color: var(--clr-accent);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 1.8rem; font-weight: 800; flex-shrink: 0;
}
.profile-name { font-size: 1.4rem; margin-bottom: 4px; }
.profile-email { color: var(--clr-text-muted); font-size: 0.9rem; margin-bottom: var(--space-3); }
.profile-badges { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }
.section-heading { font-size: 0.95rem; margin-bottom: var(--space-5); padding-bottom: var(--space-3); border-bottom: 1px solid var(--clr-border); }
.detail-list { display: flex; flex-direction: column; gap: var(--space-4); }
.detail-item { display: flex; flex-direction: column; gap: 2px; }
.detail-label { font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.detail-val { font-size: 0.9rem; color: var(--clr-text); font-weight: 500; }
.stats-stack { display: flex; flex-direction: column; gap: var(--space-3); }
.stat-row { display: flex; justify-content: space-between; align-items: center; padding: var(--space-3); background: var(--clr-bg); border-radius: var(--radius-sm); }
.stat-row-label { font-size: 0.875rem; color: var(--clr-text-secondary); }
.stat-row-value { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--clr-primary); }
.notice { margin-top: var(--space-2); }
@media (max-width: 640px) { .profile-grid { grid-template-columns: 1fr; } }
</style>
