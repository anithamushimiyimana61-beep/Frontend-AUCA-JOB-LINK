<template>
  <div class="edit-job">
    <RouterLink to="/admin/jobs" class="back-link" aria-label="Back to manage jobs">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      Back to Jobs
    </RouterLink>

    <div v-if="!job" class="empty-state" role="alert">
      <h3>Job not found.</h3>
      <RouterLink to="/admin/jobs" class="btn btn-primary btn-sm">Back to Jobs</RouterLink>
    </div>

    <template v-else>
      <div class="page-intro">
        <h2 class="page-heading">Edit: {{ job.title }}</h2>
        <p class="page-sub">Update the job details and save changes.</p>
      </div>
      <div class="card card-body">
        <JobForm
          :initial="job"
          submit-label="Save Changes"
          :submitting="submitting"
          @submit="handleUpdate"
          @cancel="router.push('/admin/jobs')"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useJobsStore } from '@/stores/jobsStore'
import { useToast } from '@/composables/useToast'
import JobForm from '@/components/admin/JobForm.vue'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const toast = useToast()
jobsStore.initJobs()

const job = computed(() => jobsStore.getJobById(route.params.id))
const submitting = ref(false)

async function handleUpdate(data) {
  submitting.value = true
  await new Promise(r => setTimeout(r, 600))
  jobsStore.updateJob(route.params.id, data)
  toast.success('Job updated successfully!')
  router.push('/admin/jobs')
  submitting.value = false
}
</script>

<style scoped>
.edit-job { display: flex; flex-direction: column; gap: var(--space-5); max-width: 800px; }
.back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.875rem; color: var(--clr-text-secondary); transition: color var(--transition-fast); }
.back-link:hover { color: var(--clr-accent-dark); }
.page-heading { font-size: 1.3rem; }
.page-sub { color: var(--clr-text-muted); font-size: 0.875rem; }
</style>
