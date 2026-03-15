<template>
  <div class="admin-dashboard">
    <section class="welcome-banner" aria-labelledby="admin-welcome">
      <div class="welcome-banner-left">
        <img src="/auca-logo.png" alt="AUCA Logo" class="banner-logo" />
        <div>
          <h2 id="admin-welcome">Admin Dashboard</h2>
          <p>Manage job listings and monitor applications.</p>
        </div>
      </div>
      <RouterLink to="/admin/jobs/create" class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Post New Job
      </RouterLink>
    </section>

    <!-- Dashboard Banner -->
    <div class="dashboard-banner">
      <img src="/Screenshot 2026-03-02 125402.png" alt="AUCA Job-Link Admin Dashboard Banner" class="dashboard-banner-image" />
    </div>

    <!-- Stats -->
    <div class="stats-grid" role="list" aria-label="Platform statistics">
      <div class="stat-card" role="listitem" v-for="s in stats" :key="s.label">
        <div class="stat-icon" :style="{ background: s.bg, color: s.color }" aria-hidden="true" v-html="s.icon"></div>
        <div>
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <!-- Jobs Table Preview -->
    <section class="card" aria-labelledby="jobs-table-heading">
      <div class="card-header">
        <h3 id="jobs-table-heading">Recent Job Listings</h3>
        <RouterLink to="/admin/jobs" class="btn btn-ghost btn-sm">Manage all</RouterLink>
      </div>
      <div class="table-wrapper" role="region" aria-label="Recent job listings" tabindex="0">
        <table class="data-table" aria-label="Job listings">
          <thead>
            <tr>
              <th scope="col">Job Title</th>
              <th scope="col">Company</th>
              <th scope="col">Type</th>
              <th scope="col">Applicants</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in recentJobs" :key="job.id">
              <td>
                <div class="job-cell">
                  <div class="job-logo" :style="{ background: job.logoColor + '18', color: job.logoColor }" aria-hidden="true">{{ job.logo }}</div>
                  <div>
                    <p class="job-cell-title">{{ job.title }}</p>
                    <p class="job-cell-location">{{ job.location }}</p>
                  </div>
                </div>
              </td>
              <td>{{ job.company }}</td>
              <td><span class="badge badge-primary">{{ job.type }}</span></td>
              <td>{{ job.applicants }}</td>
              <td>
                <span :class="['badge', job.status === 'active' ? 'badge-success' : 'badge-danger']">
                  {{ job.status }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <RouterLink :to="`/admin/jobs/edit/${job.id}`" class="btn btn-secondary btn-sm" :aria-label="`Edit ${job.title}`">Edit</RouterLink>
                </div>
              </td>
            </tr>
            <tr v-if="!recentJobs.length">
              <td colspan="6" style="text-align:center; color: var(--clr-text-muted); padding: 32px;">No jobs yet</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useJobsStore } from '@/stores/jobsStore'
import { useApplicationsStore } from '@/stores/applicationsStore'

const jobsStore = useJobsStore()
const appsStore = useApplicationsStore()
jobsStore.initJobs()
appsStore.init()

const recentJobs = computed(() => jobsStore.jobs.slice(0, 5))

const stats = computed(() => [
  {
    label: 'Total Jobs', value: jobsStore.totalJobs,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    bg: '#e0fdf4', color: '#059669'
  },
  {
    label: 'Active Listings', value: jobsStore.activeCount,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    bg: '#eff6ff', color: '#3b82f6'
  },
  {
    label: 'Total Applicants', value: jobsStore.totalApplicants,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    bg: '#fdf4ff', color: '#9333ea'
  },
  {
    label: 'Applications', value: appsStore.totalApplications,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    bg: '#fffbeb', color: '#d97706'
  },
])
</script>

<style scoped>
.admin-dashboard { display: flex; flex-direction: column; gap: var(--space-6); }
.welcome-banner { background: linear-gradient(135deg, #0e2744, #1a3a5c); border-radius: var(--radius-xl); padding: var(--space-8); display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; }
.welcome-banner-left { display: flex; align-items: center; gap: var(--space-4); }
.banner-logo { width: 56px; height: 56px; object-fit: contain; border-radius: var(--radius-md); background: rgba(255,255,255,0.1); padding: 4px; flex-shrink: 0; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-4); }
.stat-card { background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: var(--space-5); display: flex; align-items: center; gap: var(--space-4); }
.stat-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-value { font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text); display: block; line-height: 1; }
.stat-label { font-size: 0.78rem; color: var(--clr-text-muted); font-weight: 500; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: var(--space-5) var(--space-5) var(--space-4); border-bottom: 1px solid var(--clr-border); }
.card-header h3 { font-size: 1rem; font-weight: 700; }
.table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.data-table th { padding: var(--space-3) var(--space-5); text-align: left; font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em; background: var(--clr-bg); border-bottom: 1px solid var(--clr-border); }
.data-table td { padding: var(--space-4) var(--space-5); border-bottom: 1px solid var(--clr-border); vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: var(--clr-bg); }
.job-cell { display: flex; align-items: center; gap: var(--space-3); }
.job-logo { width: 32px; height: 32px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.75rem; font-weight: 800; flex-shrink: 0; }
.job-cell-title { font-weight: 600; white-space: nowrap; }
.job-cell-location { font-size: 0.78rem; color: var(--clr-text-muted); }
.table-actions { display: flex; gap: var(--space-2); }
.dashboard-banner { margin: var(--space-6) 0; text-align: center; }
.dashboard-banner-image { max-width: 100%; height: auto; max-height: 250px; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); }
@media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
</style>
