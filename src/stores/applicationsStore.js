import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const APPS_KEY = 'auca_job_link_applications'

export const useApplicationsStore = defineStore('applications', () => {
  const applications = ref([])

  function init() {
    try {
      const saved = localStorage.getItem(APPS_KEY)
      applications.value = saved ? JSON.parse(saved) : []
    } catch {
      applications.value = []
    }
  }

  function persist() {
    localStorage.setItem(APPS_KEY, JSON.stringify(applications.value))
  }

  const totalApplications = computed(() => applications.value.length)

  function hasApplied(userId, jobId) {
    return applications.value.some(a => a.userId === userId && a.jobId === jobId)
  }

  function getByUser(userId) {
    return applications.value.filter(a => a.userId === userId)
  }

  function getByJob(jobId) {
    return applications.value.filter(a => a.jobId === jobId)
  }

  function apply(userId, jobId, coverLetter) {
    if (hasApplied(userId, jobId)) return false
    applications.value.push({
      id: 'app-' + Date.now(),
      userId,
      jobId,
      coverLetter,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    })
    persist()
    return true
  }

  function updateStatus(appId, status) {
    const app = applications.value.find(a => a.id === appId)
    if (app) {
      app.status = status
      persist()
    }
  }

  return {
    applications, totalApplications,
    init, hasApplied, getByUser, getByJob, apply, updateStatus
  }
})
