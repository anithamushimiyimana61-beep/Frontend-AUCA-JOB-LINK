<template>
  <div class="manage-jobs">
    <div class="page-actions">
      <div class="search-box">
        <label for="admin-search" class="sr-only">Search jobs</label>
        <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input id="admin-search" v-model="search" class="form-input search-input" placeholder="Search jobs…" type="search" />
      </div>
      <RouterLink to="/admin/jobs/create" class="btn btn-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Post Job
      </RouterLink>
    </div>

    <section class="card" aria-labelledby="all-jobs-heading">
      <div class="card-header">
        <h2 id="all-jobs-heading" style="font-size:1rem;font-weight:700">All Job Listings ({{ filteredJobs.length }})</h2>
      </div>
      <div class="table-wrapper" role="region" aria-label="All job listings" tabindex="0">
        <table class="data-table" aria-label="Job management table">
          <thead>
            <tr>
              <th scope="col">Job</th>
              <th scope="col">Category</th>
              <th scope="col">Type</th>
              <th scope="col">Deadline</th>
              <th scope="col">Applicants</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in filteredJobs" :key="job.id">
              <td>
                <div class="job-cell">
                  <div class="job-logo" :style="{ background: job.logoColor + '18', color: job.logoColor }" aria-hidden="true">{{ job.logo }}</div>
                  <div>
                    <p class="job-cell-title">{{ job.title }}</p>
                    <p class="job-cell-company">{{ job.company }}</p>
                  </div>
                </div>
              </td>
              <td><span class="badge badge-primary">{{ job.category }}</span></td>
              <td><span class="badge badge-accent">{{ job.type }}</span></td>
              <td :class="{ 'expired-text': isExpired(job.deadline) }">{{ formatDate(job.deadline) }}</td>
              <td>{{ job.applicants }}</td>
              <td>
                <button
                  :class="['status-toggle', job.status]"
                  @click="jobsStore.toggleJobStatus(job.id)"
                  :aria-label="`${job.status === 'active' ? 'Deactivate' : 'Activate'} ${job.title}`"
                  :aria-pressed="job.status === 'active'"
                >
                  {{ job.status === 'active' ? 'Active' : 'Inactive' }}
                </button>
              </td>
              <td>
                <div class="table-actions">
                  <RouterLink :to="`/admin/jobs/edit/${job.id}`" class="btn btn-secondary btn-sm" :aria-label="`Edit ${job.title}`">Edit</RouterLink>
                  <button class="btn btn-danger btn-sm" @click="confirmDelete(job)" :aria-label="`Delete ${job.title}`">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredJobs.length">
              <td colspan="7" class="empty-table">No jobs found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <ConfirmModal
      :show="showDeleteModal"
      title="Delete Job Listing"
      :message="`Are you sure you want to delete '${jobToDelete?.title}'? This action cannot be undone.`"
      confirmText="Delete"
      @confirm="doDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useJobsStore } from '@/stores/jobsStore'
import { useToast } from '@/composables/useToast'
import ConfirmModal from '@/components/shared/ConfirmModal.vue'

const jobsStore = useJobsStore()
const toast = useToast()
jobsStore.initJobs()

const search = ref('')
const showDeleteModal = ref(false)
const jobToDelete = ref(null)

const filteredJobs = computed(() => {
  const q = search.value.toLowerCase()
  return q ? jobsStore.jobs.filter(j =>
    j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q)
  ) : jobsStore.jobs
})

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' }) : '–'
}
function isExpired(d) { return d && new Date(d) < new Date() }
function confirmDelete(job) { jobToDelete.value = job; showDeleteModal.value = true }
function doDelete() {
  jobsStore.deleteJob(jobToDelete.value.id)
  toast.success(`"${jobToDelete.value.title}" deleted.`)
  showDeleteModal.value = false
  jobToDelete.value = null
}
</script>

<style scoped>
.manage-jobs { display: flex; flex-direction: column; gap: var(--space-5); }
.page-actions { display: flex; gap: var(--space-4); align-items: center; flex-wrap: wrap; }
.search-box { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); pointer-events: none; }
.search-input { padding-left: 36px; }
.card-header { padding: var(--space-5) var(--space-5) var(--space-4); border-bottom: 1px solid var(--clr-border); }
.table-wrapper { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.data-table th { padding: var(--space-3) var(--space-5); text-align: left; font-size: 0.75rem; font-weight: 600; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 0.05em; background: var(--clr-bg); border-bottom: 1px solid var(--clr-border); }
.data-table td { padding: var(--space-4) var(--space-5); border-bottom: 1px solid var(--clr-border); vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: var(--clr-bg); }
.job-cell { display: flex; align-items: center; gap: var(--space-3); }
.job-logo { width: 32px; height: 32px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 0.75rem; font-weight: 800; flex-shrink: 0; }
.job-cell-title { font-weight: 600; }
.job-cell-company { font-size: 0.78rem; color: var(--clr-text-muted); }
.status-toggle { padding: 3px 10px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; border: none; cursor: pointer; transition: all var(--transition-fast); }
.status-toggle.active { background: var(--clr-success-light); color: var(--clr-success); }
.status-toggle.inactive { background: var(--clr-danger-light); color: var(--clr-danger); }
.expired-text { color: var(--clr-danger); font-weight: 500; }
.table-actions { display: flex; gap: var(--space-2); }
.empty-table { text-align: center; color: var(--clr-text-muted); padding: var(--space-10); }
</style>
