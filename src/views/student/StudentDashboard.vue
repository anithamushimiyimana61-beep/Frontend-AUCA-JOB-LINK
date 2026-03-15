<template>
  <div class="dashboard">
    <!-- Welcome Banner -->
    <section class="welcome-banner" aria-labelledby="welcome-heading">
      <div class="welcome-banner-left">
        <img src="/auca-logo.png" alt="AUCA Logo" class="banner-logo" />
        <div class="welcome-text">
          <h2 id="welcome-heading">Welcome back, {{ firstName }}! 👋</h2>
          <p>Discover new opportunities and track your applications.</p>
        </div>
      </div>
      <RouterLink to="/student/jobs" class="btn btn-primary">Browse All Jobs</RouterLink>
    </section>

    <!-- Dashboard Banner -->
    <div class="dashboard-banner">
      <img src="/Screenshot 2026-03-02 125402.png" alt="AUCA Job-Link Dashboard Banner" class="dashboard-banner-image" />
    </div>

    <!-- Stats -->
    <div class="stats-grid" role="list" aria-label="Your statistics">
      <div class="stat-card" role="listitem" v-for="s in stats" :key="s.label">
        <div class="stat-icon" :style="{ background: s.bg, color: s.color }" aria-hidden="true" v-html="s.icon"></div>
        <div class="stat-info">
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <!-- Two columns -->
    <div class="dashboard-grid">
      <!-- Recent Jobs -->
      <section aria-labelledby="recent-jobs-heading">
        <div class="section-header">
          <h2 id="recent-jobs-heading" class="section-title">Latest Opportunities</h2>
          <RouterLink to="/student/jobs" class="btn btn-ghost btn-sm">View all</RouterLink>
        </div>
        <div class="jobs-list" v-if="recentJobs.length">
          <JobCard
            v-for="job in recentJobs"
            :key="job.id"
            :job="job"
            compact
            @click="goToJob(job.id)"
            :aria-label="`${job.title} at ${job.company}`"
          >
            <template #actions>
              <div class="card-actions">
                <RouterLink :to="`/student/jobs/${job.id}`" class="btn btn-primary btn-sm">View</RouterLink>
              </div>
            </template>
          </JobCard>
        </div>
        <div v-else class="empty-state">
          <p>No jobs posted yet. Check back soon!</p>
        </div>
      </section>

      <!-- My Applications -->
      <section aria-labelledby="my-apps-heading">
        <div class="section-header">
          <h2 id="my-apps-heading" class="section-title">My Applications</h2>
          <RouterLink to="/student/my-applications" class="btn btn-ghost btn-sm">View all</RouterLink>
        </div>
        <div v-if="myApplications.length">
          <div class="app-item" v-for="app in myApplications.slice(0,4)" :key="app.id">
            <div class="app-info">
              <p class="app-job-title">{{ getJob(app.jobId)?.title || 'Unknown Job' }}</p>
              <p class="app-company">{{ getJob(app.jobId)?.company || '' }}</p>
            </div>
            <span :class="['badge', statusBadge(app.status)]">{{ app.status }}</span>
          </div>
        </div>
        <div v-else class="empty-state small">
          <p>You haven't applied to any jobs yet.</p>
          <RouterLink to="/student/jobs" class="btn btn-primary btn-sm" style="margin-top:12px">Find Jobs</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useJobsStore } from '@/stores/jobsStore'
import { useApplicationsStore } from '@/stores/applicationsStore'
import JobCard from '@/components/shared/JobCard.vue'

const authStore = useAuthStore()
const jobsStore = useJobsStore()
const appsStore = useApplicationsStore()
const router = useRouter()

jobsStore.initJobs()
appsStore.init()

const firstName = computed(() => authStore.user?.name?.split(' ')[0] || 'Student')
const myApplications = computed(() =>
  authStore.user ? appsStore.getByUser(authStore.user.id) : []
)
const recentJobs = computed(() => jobsStore.activeJobs.slice(0, 3))

const stats = computed(() => [
  {
    label: 'Open Positions', value: jobsStore.activeCount,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    bg: '#e0fdf4', color: '#059669'
  },
  {
    label: 'My Applications', value: myApplications.value.length,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    bg: '#eff6ff', color: '#3b82f6'
  },
  {
    label: 'Pending Review', value: myApplications.value.filter(a => a.status === 'pending').length,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    bg: '#fffbeb', color: '#d97706'
  },
  {
    label: 'Shortlisted', value: myApplications.value.filter(a => a.status === 'shortlisted').length,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    bg: '#fdf4ff', color: '#9333ea'
  },
])

function getJob(id) { return jobsStore.getJobById(id) }
function goToJob(id) { router.push(`/student/jobs/${id}`) }
function statusBadge(s) {
  return { pending: 'badge-gold', shortlisted: 'badge-success', rejected: 'badge-danger', accepted: 'badge-accent' }[s] || 'badge-primary'
}
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: var(--space-6); }
.welcome-banner {
  background: linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-primary-light) 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--space-4); flex-wrap: wrap;
}
.welcome-banner-left { display: flex; align-items: center; gap: var(--space-4); }
.banner-logo { width: 56px; height: 56px; object-fit: contain; border-radius: var(--radius-md); background: rgba(255,255,255,0.1); padding: 4px; flex-shrink: 0; }
.welcome-text h2 { font-size: 1.4rem; color: #fff; margin-bottom: 4px; }
.welcome-text p { color: rgba(255,255,255,0.65); font-size: 0.9rem; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-4); }
.stat-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex; align-items: center; gap: var(--space-4);
}
.stat-icon { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-value { font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--clr-text); display: block; line-height: 1; }
.stat-label { font-size: 0.78rem; color: var(--clr-text-muted); font-weight: 500; }
.dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); }
.section-title { font-size: 1rem; font-weight: 700; }
.jobs-list { display: flex; flex-direction: column; gap: var(--space-3); }
.card-actions { padding: 0 var(--space-5) var(--space-4); }
.app-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-4);
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
}
.app-job-title { font-weight: 600; font-size: 0.9rem; }
.app-company { font-size: 0.8rem; color: var(--clr-text-muted); }
.empty-state.small { text-align: center; padding: var(--space-8); background: var(--clr-surface); border-radius: var(--radius-lg); border: 1px dashed var(--clr-border); color: var(--clr-text-muted); font-size: 0.875rem; }
.dashboard-banner { margin: var(--space-6) 0; text-align: center; }
.dashboard-banner-image { max-width: 100%; height: auto; max-height: 250px; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); }
@media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }
@media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
</style>
