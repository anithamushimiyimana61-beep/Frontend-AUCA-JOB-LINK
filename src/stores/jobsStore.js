import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const JOBS_KEY = 'auca_job_link_jobs'

const INITIAL_JOBS = [
  {
    id: 'job-001',
    title: 'Frontend Developer',
    company: 'Irembo Ltd',
    location: 'Kigali, Rwanda',
    type: 'Full-time',
    category: 'Technology',
    level: 'Graduate',
    salary: 'RWF 400,000 – 600,000/month',
    description: 'We are looking for a passionate Frontend Developer to join our growing team. You will build digital public services used by millions of Rwandans.',
    requirements: 'Degree in Computer Science or related field. Proficiency in Vue.js or React. Strong CSS and HTML skills. 1+ years of experience preferred.',
    deadline: '2026-04-15',
    postedDate: '2026-03-01',
    status: 'active',
    applicants: 12,
    logo: 'I',
    logoColor: '#0ea5e9'
  },
  {
    id: 'job-002',
    title: 'Data Analyst Intern',
    company: 'Bank of Kigali',
    location: 'Kigali, Rwanda',
    type: 'Internship',
    category: 'Finance',
    level: 'Undergraduate',
    salary: 'RWF 150,000/month',
    description: "Join BK's data team to analyze financial data, produce reports, and support decision-making across business units.",
    requirements: 'Currently pursuing a degree in Statistics, IT, or Finance. Knowledge of Excel and basic SQL. Analytical mindset.',
    deadline: '2026-04-05',
    postedDate: '2026-03-05',
    status: 'active',
    applicants: 28,
    logo: 'B',
    logoColor: '#7c3aed'
  },
  {
    id: 'job-003',
    title: 'IT Support Technician',
    company: 'Rwanda Revenue Authority',
    location: 'Kigali, Rwanda',
    type: 'Full-time',
    category: 'Technology',
    level: 'Graduate',
    salary: 'RWF 350,000/month',
    description: 'Provide technical support, maintain IT infrastructure, and assist staff with hardware and software issues.',
    requirements: 'BSc in IT or Computer Science. A+ or Network+ certification is a plus. Strong communication skills.',
    deadline: '2026-03-30',
    postedDate: '2026-02-20',
    status: 'active',
    applicants: 9,
    logo: 'R',
    logoColor: '#059669'
  },
  {
    id: 'job-004',
    title: 'Software Engineering Intern',
    company: 'Andela Rwanda',
    location: 'Remote / Kigali',
    type: 'Internship',
    category: 'Technology',
    level: 'Undergraduate',
    salary: 'USD 500/month',
    description: 'Work alongside senior engineers on real-world software projects, contribute to open-source, and grow your skills in a global environment.',
    requirements: 'Currently enrolled in CS or IT program. Strong foundation in JavaScript or Python. Portfolio or GitHub profile required.',
    deadline: '2026-04-20',
    postedDate: '2026-03-08',
    status: 'active',
    applicants: 45,
    logo: 'A',
    logoColor: '#dc2626'
  },
  {
    id: 'job-005',
    title: 'Network Administrator',
    company: 'MTN Rwanda',
    location: 'Kigali, Rwanda',
    type: 'Full-time',
    category: 'Technology',
    level: 'Graduate',
    salary: 'RWF 500,000 – 700,000/month',
    description: 'Manage and maintain MTN\'s network infrastructure, monitor performance, ensure uptime, and implement security protocols.',
    requirements: 'BSc in Networking or IT. CCNA or equivalent certification. 2+ years of experience.',
    deadline: '2026-04-10',
    postedDate: '2026-03-10',
    status: 'active',
    applicants: 7,
    logo: 'M',
    logoColor: '#f59e0b'
  }
]

export const useJobsStore = defineStore('jobs', () => {
  // State
  const jobs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const filterType = ref('')
  const filterCategory = ref('')
  const filterLevel = ref('')

  // Load from localStorage or seed
  function initJobs() {
    try {
      const saved = localStorage.getItem(JOBS_KEY)
      jobs.value = saved ? JSON.parse(saved) : [...INITIAL_JOBS]
    } catch {
      jobs.value = [...INITIAL_JOBS]
    }
  }

  function persist() {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs.value))
  }

  // Computed
  const activeJobs = computed(() =>
    jobs.value.filter(j => j.status === 'active')
  )

  const filteredJobs = computed(() => {
    let result = activeJobs.value
    const q = searchQuery.value.toLowerCase()
    if (q) {
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q)
      )
    }
    if (filterType.value) result = result.filter(j => j.type === filterType.value)
    if (filterCategory.value) result = result.filter(j => j.category === filterCategory.value)
    if (filterLevel.value) result = result.filter(j => j.level === filterLevel.value)
    return result
  })

  const totalJobs = computed(() => jobs.value.length)
  const activeCount = computed(() => activeJobs.value.length)
  const totalApplicants = computed(() => jobs.value.reduce((s, j) => s + (j.applicants || 0), 0))

  // CRUD
  function getJobById(id) {
    return jobs.value.find(j => j.id === id) || null
  }

  function addJob(jobData) {
    const newJob = {
      ...jobData,
      id: 'job-' + Date.now(),
      postedDate: new Date().toISOString().split('T')[0],
      applicants: 0,
      status: 'active'
    }
    jobs.value.unshift(newJob)
    persist()
    return newJob
  }

  function updateJob(id, updates) {
    const idx = jobs.value.findIndex(j => j.id === id)
    if (idx !== -1) {
      jobs.value[idx] = { ...jobs.value[idx], ...updates }
      persist()
      return true
    }
    return false
  }

  function deleteJob(id) {
    const idx = jobs.value.findIndex(j => j.id === id)
    if (idx !== -1) {
      jobs.value.splice(idx, 1)
      persist()
      return true
    }
    return false
  }

  function toggleJobStatus(id) {
    const job = jobs.value.find(j => j.id === id)
    if (job) {
      job.status = job.status === 'active' ? 'inactive' : 'active'
      persist()
    }
  }

  function clearFilters() {
    searchQuery.value = ''
    filterType.value = ''
    filterCategory.value = ''
    filterLevel.value = ''
  }

  return {
    jobs, loading, error,
    searchQuery, filterType, filterCategory, filterLevel,
    activeJobs, filteredJobs, totalJobs, activeCount, totalApplicants,
    initJobs, getJobById, addJob, updateJob, deleteJob, toggleJobStatus, clearFilters
  }
})
