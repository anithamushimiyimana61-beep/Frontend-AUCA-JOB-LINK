<template>
  <article class="job-card" :class="{ compact }" tabindex="0" @keydown.enter="$emit('click', job)">
    <div class="job-card-header">
      <div class="company-logo" :style="{ background: job.logoColor + '18', color: job.logoColor }">
        {{ job.logo }}
      </div>
      <div class="job-meta">
        <span class="badge badge-accent">{{ job.type }}</span>
        <span class="badge badge-primary">{{ job.level }}</span>
      </div>
    </div>
    <div class="job-card-body">
      <h3 class="job-title">{{ job.title }}</h3>
      <p class="job-company">{{ job.company }}</p>
      <p class="job-location">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {{ job.location }}
      </p>
      <p v-if="!compact" class="job-desc">{{ truncate(job.description, 100) }}</p>
    </div>
    <div class="job-card-footer">
      <span class="job-salary" v-if="job.salary">{{ job.salary }}</span>
      <span class="job-deadline">Deadline: {{ formatDate(job.deadline) }}</span>
    </div>
    <slot name="actions" />
  </article>
</template>

<script setup>
defineProps({
  job: { type: Object, required: true },
  compact: { type: Boolean, default: false }
})
defineEmits(['click'])

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '…' : str
}
function formatDate(d) {
  if (!d) return '–'
  return new Date(d).toLocaleDateString('en-RW', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.job-card {
  background: var(--clr-surface);
  border: 1.5px solid var(--clr-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  transition: all var(--transition-base);
  cursor: pointer;
  outline: none;
}
.job-card:hover, .job-card:focus-visible {
  border-color: var(--clr-accent);
  box-shadow: var(--shadow-md), 0 0 0 3px var(--clr-accent-glow);
  transform: translateY(-2px);
}
.job-card-header { display: flex; align-items: center; justify-content: space-between; }
.company-logo {
  width: 44px; height: 44px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 1.1rem; font-weight: 800;
  flex-shrink: 0;
}
.job-meta { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.job-card-body { flex: 1; }
.job-title {
  font-family: var(--font-display);
  font-size: 1rem; font-weight: 700;
  color: var(--clr-text);
  margin-bottom: 4px;
}
.job-company { font-size: 0.875rem; font-weight: 600; color: var(--clr-text-secondary); margin-bottom: 4px; }
.job-location {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.8rem; color: var(--clr-text-muted);
  margin-bottom: var(--space-2);
}
.job-desc { font-size: 0.85rem; color: var(--clr-text-secondary); line-height: 1.5; }
.job-card-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--clr-surface-2);
  font-size: 0.8rem;
}
.job-salary { font-weight: 600; color: var(--clr-accent-dark); }
.job-deadline { color: var(--clr-text-muted); }
</style>
