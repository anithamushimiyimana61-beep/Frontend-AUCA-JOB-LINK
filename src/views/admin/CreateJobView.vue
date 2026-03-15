<template>
  <div class="create-job">
    <div class="page-intro">
      <h2 class="page-heading">Post a New Job</h2>
      <p class="page-sub">Fill in the details below. All required fields must be completed before publishing.</p>
    </div>

    <div class="card card-body">
      <JobForm
        submit-label="Publish Job"
        :submitting="submitting"
        @submit="handleCreate"
        @cancel="router.push('/admin/jobs')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobsStore'
import { useToast } from '@/composables/useToast'
import JobForm from '@/components/admin/JobForm.vue'

const router = useRouter()
const jobsStore = useJobsStore()
const toast = useToast()
const submitting = ref(false)

async function handleCreate(data) {
  submitting.value = true
  await new Promise(r => setTimeout(r, 600))
  jobsStore.addJob(data)
  toast.success('Job posted successfully!')
  router.push('/admin/jobs')
  submitting.value = false
}
</script>

<style scoped>
.create-job { display: flex; flex-direction: column; gap: var(--space-5); max-width: 800px; }
.page-heading { font-size: 1.3rem; }
.page-sub { color: var(--clr-text-muted); font-size: 0.875rem; }
</style>
