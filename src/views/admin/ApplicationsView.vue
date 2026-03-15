<template>
  <div class="applications-view">
    <div class="page-intro">
      <h2 class="page-heading">All Applications</h2>
      <p class="page-sub">Review and manage student applications for posted jobs.</p>
    </div>

    <!-- Filter tabs -->
    <div class="filter-tabs" role="tablist" aria-label="Filter applications by status">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-btn', { active: activeTab === tab.key }]"
        role="tab"
        :aria-selected="activeTab === tab.key"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span class="tab-count">{{ tabCount(tab.key) }}</span>
      </button>
    </div>

    <div v-if="!filteredApps.length" class="empty-state" role="status">
      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <h3>No applications</h3>
      <p>No applications in this category yet.</p>
    </div>

    <div v-else class="apps-grid" role="list" aria-label="Student applications">
      <article
        v-for="app in filteredApps"
        :key="app.id"
        class="app-card card"
        role="listitem"
        :aria-label="`Application for ${getJob(app.jobId)?.title}`"
      >
        <div class="app-card-top">
          <div class="app-info">
            <h3 class="app-title">{{ getJob(app.jobId)?.title || 'Unknown Job' }}</h3>
            <p class="app-company">{{ getJob(app.jobId)?.company }}</p>
            <div class="app-meta">
              <span class="meta-chip">Student ID: {{ getUserName(app.userId) }}</span>
              <span class="meta-chip">Applied {{ formatDate(app.appliedDate) }}</span>
              <span class="meta-chip" v-if="getJob(app.jobId)">{{ getJob(app.jobId).type }}</span>
            </div>
          </div>
          <span :class="['badge', statusBadge(app.status)]">{{ statusLabel(app.status) }}</span>
        </div>

        <div v-if="app.coverLetter" class="cover-section">
          <p class="cover-label">Cover Letter</p>
          <p class="cover-text">{{ app.coverLetter }}</p>
        </div>

        <div class="app-actions">
          <p class="action-label">Update status:</p>
          <div class="status-buttons" role="group" :aria-label="`Status actions for application ${app.id}`">
            <button
              v-for="s in statuses"
              :key="s.key"
              :class="['status-btn', s.key, { active: app.status === s.key }]"
              @click="updateStatus(app.id, s.key)"
              :aria-pressed="app.status === s.key"
              :aria-label="`Mark as ${s.label}`"
            >
              {{ s.label }}
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useJobsStore } from '@/stores/jobsStore'
import { useApplicationsStore } from '@/stores/applicationsStore'
import { useToast } from '@/composables/useToast'

const jobsStore = useJobsStore()
const appsStore = useApplicationsStore()
const toast = useToast()
jobsStore.initJobs()
appsStore.init()

const activeTab = ref('all')
const tabs = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
]
const statuses = [
  { key: 'pending', label: 'Pending' },
  { key: 'shortlisted', label: 'Shortlist' },
  { key: 'accepted', label: 'Accept' },
  { key: 'rejected', label: 'Reject' },
]

const filteredApps = computed(() =>
  activeTab.value === 'all'
    ? appsStore.applications
    : appsStore.applications.filter(a => a.status === activeTab.value)
)

function tabCount(key) {
  return key === 'all' ? appsStore.applications.length : appsStore.applications.filter(a => a.status === key).length
}
function getJob(id) { return jobsStore.getJobById(id) }
function getUserName(uid) { return uid || 'Unknown' }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' }) : '–' }
function statusBadge(s) { return { pending: 'badge-gold', shortlisted: 'badge-success', rejected: 'badge-danger', accepted: 'badge-accent' }[s] || 'badge-primary' }
function statusLabel(s) { return { pending: '⏳ Pending', shortlisted: '⭐ Shortlisted', rejected: '✕ Rejected', accepted: '✓ Accepted' }[s] || s }

function updateStatus(appId, status) {
  appsStore.updateStatus(appId, status)
  toast.success(`Application marked as ${status}.`)
}
</script>

<style scoped>
.applications-view { display: flex; flex-direction: column; gap: var(--space-5); }
.page-heading { font-size: 1.3rem; }
.page-sub { color: var(--clr-text-muted); font-size: 0.875rem; }
.filter-tabs { display: flex; gap: var(--space-2); flex-wrap: wrap; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: var(--space-2); width: fit-content; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: var(--radius-md); border: none; font-size: 0.875rem; font-weight: 500; color: var(--clr-text-secondary); background: none; cursor: pointer; transition: all var(--transition-fast); }
.tab-btn:hover { background: var(--clr-surface-2); color: var(--clr-text); }
.tab-btn.active { background: var(--clr-primary); color: #fff; font-weight: 600; }
.tab-count { font-size: 0.72rem; background: rgba(0,0,0,0.08); border-radius: var(--radius-full); padding: 1px 7px; font-weight: 700; }
.tab-btn.active .tab-count { background: rgba(255,255,255,0.2); }
.apps-grid { display: flex; flex-direction: column; gap: var(--space-4); }
.app-card { overflow: hidden; }
.app-card-top { padding: var(--space-5); display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-4); flex-wrap: wrap; }
.app-title { font-size: 1rem; font-weight: 700; margin-bottom: 2px; }
.app-company { font-size: 0.85rem; color: var(--clr-text-secondary); margin-bottom: var(--space-2); }
.app-meta { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.meta-chip { font-size: 0.75rem; color: var(--clr-text-muted); background: var(--clr-surface-2); border-radius: var(--radius-full); padding: 2px 8px; }
.cover-section { padding: 0 var(--space-5) var(--space-4); border-top: 1px solid var(--clr-surface-2); padding-top: var(--space-4); }
.cover-label { font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.cover-text { font-size: 0.85rem; color: var(--clr-text-secondary); line-height: 1.6; }
.app-actions { padding: var(--space-4) var(--space-5); background: var(--clr-bg); border-top: 1px solid var(--clr-border); display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
.action-label { font-size: 0.78rem; font-weight: 600; color: var(--clr-text-muted); }
.status-buttons { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.status-btn { padding: 5px 12px; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 600; border: 1.5px solid transparent; cursor: pointer; transition: all var(--transition-fast); background: transparent; }
.status-btn.pending { border-color: var(--clr-gold); color: var(--clr-warning); }
.status-btn.pending.active, .status-btn.pending:hover { background: var(--clr-warning-light); }
.status-btn.shortlisted { border-color: var(--clr-success); color: var(--clr-success); }
.status-btn.shortlisted.active, .status-btn.shortlisted:hover { background: var(--clr-success-light); }
.status-btn.accepted { border-color: var(--clr-accent-dark); color: var(--clr-accent-dark); }
.status-btn.accepted.active, .status-btn.accepted:hover { background: var(--clr-accent-glow); }
.status-btn.rejected { border-color: var(--clr-danger); color: var(--clr-danger); }
.status-btn.rejected.active, .status-btn.rejected:hover { background: var(--clr-danger-light); }
</style>
