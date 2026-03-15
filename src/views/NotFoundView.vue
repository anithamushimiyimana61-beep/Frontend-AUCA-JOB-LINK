<template>
  <div class="not-found" role="main">
    <div class="not-found-content">
      <div class="not-found-code" aria-hidden="true">404</div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <div class="not-found-actions">
        <button class="btn btn-secondary" @click="router.back()">Go Back</button>
        <RouterLink to="/" class="btn btn-primary">Go Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: var(--clr-bg);
  padding: var(--space-8);
}
.not-found-content { text-align: center; max-width: 400px; }
.not-found-code {
  font-family: var(--font-display);
  font-size: 7rem; font-weight: 800;
  color: var(--clr-surface-2);
  line-height: 1;
  margin-bottom: var(--space-4);
  letter-spacing: -4px;
}
h1 { font-size: 1.6rem; margin-bottom: var(--space-3); }
p { color: var(--clr-text-secondary); margin-bottom: var(--space-8); }
.not-found-actions { display: flex; gap: var(--space-4); justify-content: center; }
</style>
