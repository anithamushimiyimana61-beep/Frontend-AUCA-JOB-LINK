<template>
  <div class="my-applications">
    <div class="page-header">
      <div>
        <h2 class="page-heading">My Applications</h2>
        <p class="page-sub">Track the status of all your job applications.</p>
      </div>
    </div>

    <div v-if="myApps.length === 0" class="empty-state">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <h3>No Applications Yet</h3>
      <p>You haven't applied to any jobs. Start exploring opportunities!</p>
      <RouterLink to="/student/jobs" class="btn btn-primary btn-sm" style="margin-top:16px">Browse Jobs</RouterLink>
    </div>

    <div v-else class="apps-list" role="list" aria-label="Your job applications">
      <TransitionGroup name="fade" tag="div" class="apps-list-inner">
        <article
          v-for="app in myApps"
          :key="app.id"
          class="app-card card"
          role="listitem"
          :aria-label="`Application for ${getJob(app.jobId)?.title || 'Unknown'} - Status: ${app.status}`"
        >
          <div class="app-card-body">
            <div class="app-left">
              <div class="company-logo" :style="{ background: getJob(app.jobId)?.logoColor + '18', color: getJob(app.jobId)?.logoColor }" aria-hidden="true">
                {{ getJob(app.jobId)?.logo || '?' }}
              </div>
              <div class="app-info">
                <h3 class="app-title">{{ getJob(app.jobId)?.title || 'Job no longer available' }}</h3>
                <p class="app-company">{{ getJob(app.jobId)?.company }}</p>
                <div class="app-meta">
                  <span class="meta-chip">{{ getJob(app.jobId)?.type }}</span>
                  <span class="meta-chip">{{ getJob(app.jobId)?.location }}</span>
                  <span class="meta-chip">Applied {{ formatDate(app.appliedDate) }}</span>
                </div>
              </div>
            </div>
            <div class="app-right">
              <span :class="['badge', statusBadge(app.status)]" :aria-label="`Application status: ${app.status}`">
                {{ statusLabel(app.status) }}
              </span>
              <RouterLink
                v-if="getJob(app.jobId)"
                :to="`/student/jobs/${app.jobId}`"
                class="btn btn-secondary btn-sm"
                :aria-label="`View details for ${getJob(app.jobId)?.title}`"
              >
                View Job
              </RouterLink>
            </div>
          </div>

          <!-- Cover Letter Preview -->
          <div class="cover-preview" v-if="app.coverLetter">
            <p class="cover-label">Cover Letter</p>
            <p class="cover-text">{{ truncate(app.coverLetter, 180) }}</p>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useJobsStore } from '@/stores/jobsStore'
import { useApplicationsStore } from '@/stores/applicationsStore'

const authStore = useAuthStore()
const jobsStore = useJobsStore()
const appsStore = useApplicationsStore()

jobsStore.initJobs()
appsStore.init()

const myApps = computed(() =>
  authStore.user ? appsStore.getByUser(authStore.user.id) : []
)

function getJob(id) { return jobsStore.getJobById(id) }
function formatDate(d) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' })
}
function truncate(s, n) { return s.length > n ? s.slice(0, n) + '…' : s }
function statusBadge(s) {
  return { pending: 'badge-gold', shortlisted: 'badge-success', rejected: 'badge-danger', accepted: 'badge-accent' }[s] || 'badge-primary'
}
function statusLabel(s) {
  return { pending: '⏳ Pending', shortlisted: '⭐ Shortlisted', rejected: '✕ Rejected', accepted: '✓ Accepted' }[s] || s
}
</script>

<style scoped>
.my-applications { display: flex; flex-direction: column; gap: var(--space-5); }
.page-header { margin-bottom: var(--space-2); }
.page-heading { font-size: 1.3rem; }
.page-sub { color: var(--clr-text-muted); font-size: 0.875rem; }
.apps-list-inner { display: flex; flex-direction: column; gap: var(--space-4); }
.app-card { overflow: hidden; }
.app-card-body { padding: var(--space-5); display: flex; align-items: flex-start; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; }
.app-left { display: flex; align-items: flex-start; gap: var(--space-4); flex: 1; min-width: 0; }
.company-logo { width: 44px; height: 44px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1rem; font-weight: 800; flex-shrink: 0; }
.app-title { font-size: 1rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.app-company { font-size: 0.85rem; color: var(--clr-text-secondary); margin-bottom: var(--space-2); }
.app-meta { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.meta-chip { font-size: 0.75rem; color: var(--clr-text-muted); background: var(--clr-surface-2); border-radius: var(--radius-full); padding: 2px 8px; }
.app-right { display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-3); flex-shrink: 0; }
.cover-preview { padding: 0 var(--space-5) var(--space-5); border-top: 1px solid var(--clr-surface-2); padding-top: var(--space-4); }
.cover-label { font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-1); }
.cover-text { font-size: 0.85rem; color: var(--clr-text-secondary); line-height: 1.5; }
</style>
