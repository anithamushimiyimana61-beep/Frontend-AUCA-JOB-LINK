<template>
  <div class="job-detail">
    <!-- Back -->
    <RouterLink to="/student/jobs" class="back-link" aria-label="Back to job listings">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      Back to Jobs
    </RouterLink>

    <!-- Job not found -->
    <div v-if="!job" class="empty-state" role="status">
      <h3>Job not found</h3>
      <RouterLink to="/student/jobs" class="btn btn-primary btn-sm">Browse Jobs</RouterLink>
    </div>

    <template v-else>
      <div class="job-detail-grid">
        <!-- Main Content -->
        <main>
          <div class="job-header card card-body">
            <div class="job-header-top">
              <div class="company-logo" :style="{ background: job.logoColor + '18', color: job.logoColor }">
                {{ job.logo }}
              </div>
              <div class="job-badges">
                <span class="badge badge-accent">{{ job.type }}</span>
                <span class="badge badge-primary">{{ job.level }}</span>
                <span class="badge badge-gold">{{ job.category }}</span>
              </div>
            </div>
            <h1 class="job-title">{{ job.title }}</h1>
            <p class="job-company">{{ job.company }}</p>
            <div class="job-meta-row">
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ job.location }}
              </span>
              <span class="meta-item" v-if="job.salary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {{ job.salary }}
              </span>
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Deadline: {{ formatDate(job.deadline) }}
              </span>
              <span class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                {{ job.applicants }} applicants
              </span>
            </div>
          </div>

          <div class="card card-body" style="margin-top:16px">
            <h2 class="section-heading">Job Description</h2>
            <p class="job-description">{{ job.description }}</p>
          </div>

          <div class="card card-body" style="margin-top:16px">
            <h2 class="section-heading">Requirements</h2>
            <p class="job-description">{{ job.requirements }}</p>
          </div>
        </main>

        <!-- Sidebar Actions -->
        <aside aria-label="Application actions">
          <div class="apply-card card card-body">
            <div v-if="alreadyApplied" class="applied-state">
              <div class="applied-icon" aria-hidden="true">✓</div>
              <h3>Application Submitted</h3>
              <p>You have already applied for this position.</p>
              <RouterLink to="/student/my-applications" class="btn btn-secondary btn-full btn-sm">
                View My Applications
              </RouterLink>
            </div>
            <template v-else>
              <h2 class="apply-heading">Apply for this Role</h2>
              <p class="apply-sub">Submit your application with a cover letter.</p>
              <button
                class="btn btn-primary btn-full"
                @click="showApplyModal = true"
                :disabled="isExpired"
                :aria-label="`Apply for ${job.title} at ${job.company}`"
              >
                {{ isExpired ? 'Deadline Passed' : 'Apply Now' }}
              </button>
              <p v-if="isExpired" class="deadline-warning" role="alert">
                The application deadline has passed.
              </p>
            </template>

            <div class="apply-details">
              <div class="detail-row">
                <span class="detail-label">Posted</span>
                <span class="detail-val">{{ formatDate(job.postedDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Deadline</span>
                <span class="detail-val" :class="{ expired: isExpired }">{{ formatDate(job.deadline) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-val">{{ job.type }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </template>

    <!-- Apply Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showApplyModal" class="modal-overlay" @click.self="showApplyModal = false" role="dialog" aria-labelledby="apply-modal-title" aria-modal="true">
          <div class="modal-box" ref="modalRef">
            <div class="modal-header">
              <h2 id="apply-modal-title">Apply for {{ job?.title }}</h2>
              <button class="btn btn-ghost btn-icon" @click="showApplyModal = false" aria-label="Close application form">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form @submit.prevent="handleApply" novalidate aria-label="Job application form">
              <div class="form-group" style="margin-bottom:20px">
                <label for="cover-letter" class="form-label">
                  Cover Letter <span class="required" aria-label="required">*</span>
                </label>
                <textarea
                  id="cover-letter"
                  v-model="coverLetter"
                  @blur="coverTouched = true"
                  class="form-textarea"
                  :class="{ error: coverError && coverTouched }"
                  placeholder="Introduce yourself and explain why you are a great fit for this role…"
                  rows="7"
                  :aria-invalid="!!(coverError && coverTouched)"
                  :aria-describedby="coverError && coverTouched ? 'cover-error' : 'cover-hint'"
                  required
                ></textarea>
                <Transition name="fade">
                  <p v-if="coverError && coverTouched" id="cover-error" class="form-error" role="alert">
                    {{ coverError }}
                  </p>
                  <p v-else id="cover-hint" class="form-hint">Minimum 50 characters. Be specific about your skills and motivation.</p>
                </Transition>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" @click="showApplyModal = false">Cancel</button>
                <button type="submit" class="btn btn-primary" :disabled="applying">
                  <span v-if="applying" class="spinner" aria-hidden="true"></span>
                  {{ applying ? 'Submitting…' : 'Submit Application' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useJobsStore } from '@/stores/jobsStore'
import { useApplicationsStore } from '@/stores/applicationsStore'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const authStore = useAuthStore()
const jobsStore = useJobsStore()
const appsStore = useApplicationsStore()
const toast = useToast()

jobsStore.initJobs()
appsStore.init()

const job = computed(() => jobsStore.getJobById(route.params.id))
const alreadyApplied = computed(() =>
  authStore.user ? appsStore.hasApplied(authStore.user.id, route.params.id) : false
)
const isExpired = computed(() => job.value ? new Date(job.value.deadline) < new Date() : false)

const showApplyModal = ref(false)
const coverLetter = ref('')
const coverTouched = ref(false)
const applying = ref(false)

const coverError = computed(() => {
  if (!coverLetter.value.trim()) return 'Cover letter is required.'
  if (coverLetter.value.trim().length < 50) return 'Cover letter must be at least 50 characters.'
  return null
})

function formatDate(d) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('en-RW', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function handleApply() {
  coverTouched.value = true
  if (coverError.value) return
  applying.value = true
  await new Promise(r => setTimeout(r, 800))
  const success = appsStore.apply(authStore.user.id, route.params.id, coverLetter.value)
  if (success) {
    showApplyModal.value = false
    coverLetter.value = ''
    coverTouched.value = false
    toast.success('Application submitted successfully!')
  } else {
    toast.error('You have already applied for this job.')
  }
  applying.value = false
}
</script>

<style scoped>
.job-detail { display: flex; flex-direction: column; gap: var(--space-5); max-width: 1000px; }
.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.875rem; color: var(--clr-text-secondary);
  transition: color var(--transition-fast);
}
.back-link:hover { color: var(--clr-accent-dark); }
.job-detail-grid { display: grid; grid-template-columns: 1fr 300px; gap: var(--space-5); align-items: start; }
.job-header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-3); }
.company-logo { width: 52px; height: 52px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; }
.job-badges { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.job-title { font-size: 1.5rem; margin-bottom: 4px; }
.job-company { font-size: 1rem; font-weight: 600; color: var(--clr-text-secondary); margin-bottom: var(--space-4); }
.job-meta-row { display: flex; gap: var(--space-5); flex-wrap: wrap; }
.meta-item { display: flex; align-items: center; gap: 5px; font-size: 0.85rem; color: var(--clr-text-secondary); }
.section-heading { font-size: 1rem; margin-bottom: var(--space-4); color: var(--clr-text); }
.job-description { font-size: 0.9rem; line-height: 1.75; color: var(--clr-text-secondary); white-space: pre-line; }
.apply-card { position: sticky; top: calc(var(--topbar-height) + 16px); }
.apply-heading { font-size: 1rem; margin-bottom: var(--space-2); }
.apply-sub { font-size: 0.85rem; color: var(--clr-text-muted); margin-bottom: var(--space-4); }
.deadline-warning { font-size: 0.8rem; color: var(--clr-danger); text-align: center; margin-top: var(--space-3); }
.apply-details { margin-top: var(--space-5); padding-top: var(--space-5); border-top: 1px solid var(--clr-border); display: flex; flex-direction: column; gap: var(--space-3); }
.detail-row { display: flex; justify-content: space-between; font-size: 0.85rem; }
.detail-label { color: var(--clr-text-muted); }
.detail-val { font-weight: 500; }
.detail-val.expired { color: var(--clr-danger); }
.applied-state { text-align: center; padding: var(--space-4) 0; }
.applied-icon { width: 48px; height: 48px; background: var(--clr-success-light); color: var(--clr-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; margin: 0 auto var(--space-3); }
.applied-state h3 { margin-bottom: var(--space-2); }
.applied-state p { font-size: 0.85rem; color: var(--clr-text-muted); margin-bottom: var(--space-4); }
/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(10,37,64,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: var(--space-4); }
.modal-box { background: var(--clr-surface); border-radius: var(--radius-xl); padding: var(--space-8); max-width: 520px; width: 100%; box-shadow: var(--shadow-lg); }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-6); }
.modal-header h2 { font-size: 1.1rem; }
.modal-actions { display: flex; gap: var(--space-3); justify-content: flex-end; }
@media (max-width: 768px) { .job-detail-grid { grid-template-columns: 1fr; } .apply-card { position: static; } }
</style>
