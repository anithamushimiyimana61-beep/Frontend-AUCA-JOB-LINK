<template>
  <div class="job-listing">
    <!-- Search & Filters -->
    <div class="filters-bar" role="search" aria-label="Job search and filters">
      <div class="search-box">
        <label for="job-search" class="sr-only">Search jobs</label>
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          id="job-search"
          v-model="jobsStore.searchQuery"
          type="search"
          class="form-input search-input"
          placeholder="Search by title, company, location…"
          aria-label="Search jobs"
        />
      </div>

      <div class="filters">
        <div class="form-group">
          <label for="filter-type" class="sr-only">Filter by job type</label>
          <select id="filter-type" v-model="jobsStore.filterType" class="form-select filter-select" aria-label="Filter by type">
            <option value="">All Types</option>
            <option>Full-time</option>
            <option>Internship</option>
            <option>Part-time</option>
            <option>Contract</option>
          </select>
        </div>

        <div class="form-group">
          <label for="filter-category" class="sr-only">Filter by category</label>
          <select id="filter-category" v-model="jobsStore.filterCategory" class="form-select filter-select" aria-label="Filter by category">
            <option value="">All Categories</option>
            <option>Technology</option>
            <option>Finance</option>
            <option>Healthcare</option>
            <option>Education</option>
            <option>Engineering</option>
            <option>Marketing</option>
          </select>
        </div>

        <div class="form-group">
          <label for="filter-level" class="sr-only">Filter by level</label>
          <select id="filter-level" v-model="jobsStore.filterLevel" class="form-select filter-select" aria-label="Filter by level">
            <option value="">All Levels</option>
            <option>Graduate</option>
            <option>Undergraduate</option>
          </select>
        </div>

        <button
          v-if="hasFilters"
          class="btn btn-ghost btn-sm"
          @click="jobsStore.clearFilters()"
          aria-label="Clear all filters"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Results count -->
    <div class="results-info" aria-live="polite" aria-atomic="true">
      <p v-if="jobsStore.filteredJobs.length">
        Showing <strong>{{ jobsStore.filteredJobs.length }}</strong> job{{ jobsStore.filteredJobs.length !== 1 ? 's' : '' }}
        <span v-if="jobsStore.searchQuery"> for "<em>{{ jobsStore.searchQuery }}</em>"</span>
      </p>
    </div>

    <!-- Jobs grid -->
    <TransitionGroup name="fade" tag="div" class="jobs-grid" v-if="jobsStore.filteredJobs.length">
      <JobCard
        v-for="job in jobsStore.filteredJobs"
        :key="job.id"
        :job="job"
        @click="goToJob(job.id)"
        :aria-label="`${job.title} at ${job.company}, ${job.type}, ${job.level}`"
      >
        <template #actions>
          <div class="card-actions">
            <RouterLink :to="`/student/jobs/${job.id}`" class="btn btn-primary btn-sm btn-full">
              View Details
            </RouterLink>
          </div>
        </template>
      </JobCard>
    </TransitionGroup>

    <!-- Empty state -->
    <div v-else class="empty-state" role="status">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <h3>No jobs found</h3>
      <p>Try adjusting your search or filters.</p>
      <button class="btn btn-primary btn-sm" @click="jobsStore.clearFilters()" style="margin-top:16px">Clear Filters</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useJobsStore } from '@/stores/jobsStore'
import JobCard from '@/components/shared/JobCard.vue'

const jobsStore = useJobsStore()
const router = useRouter()
jobsStore.initJobs()

const hasFilters = computed(() =>
  jobsStore.searchQuery || jobsStore.filterType || jobsStore.filterCategory || jobsStore.filterLevel
)

function goToJob(id) { router.push(`/student/jobs/${id}`) }
</script>

<style scoped>
.job-listing { display: flex; flex-direction: column; gap: var(--space-5); }
.filters-bar {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  display: flex; flex-direction: column; gap: var(--space-4);
}
.search-box { position: relative; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted); pointer-events: none; }
.search-input { padding-left: 38px; }
.filters { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: flex-end; }
.filter-select { min-width: 140px; }
.results-info { font-size: 0.875rem; color: var(--clr-text-secondary); }
.jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-5); }
.card-actions { padding: 0 var(--space-5) var(--space-4); }
@media (max-width: 600px) {
  .filter-select { min-width: unset; flex: 1; }
  .filters { flex-direction: column; }
}
</style>
