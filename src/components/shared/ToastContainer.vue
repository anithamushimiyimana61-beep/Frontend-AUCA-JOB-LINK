<template>
  <Teleport to="body">
    <div class="toast-wrapper" role="region" aria-label="Notifications" aria-live="polite">
      <TransitionGroup name="toast" tag="div" class="toast-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          role="alert"
        >
          <span class="toast-icon" aria-hidden="true">
            <template v-if="toast.type === 'success'">✓</template>
            <template v-else-if="toast.type === 'error'">✕</template>
            <template v-else-if="toast.type === 'warning'">!</template>
            <template v-else>i</template>
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button
            class="toast-close"
            @click="dismiss(toast.id)"
            :aria-label="`Dismiss ${toast.type} notification`"
          >×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  pointer-events: none;
}
.toast-list { display: flex; flex-direction: column; gap: 10px; }
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 280px;
  max-width: 380px;
  pointer-events: all;
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
}
.toast-success { border-left: 4px solid var(--clr-success); }
.toast-error { border-left: 4px solid var(--clr-danger); }
.toast-warning { border-left: 4px solid var(--clr-gold); }
.toast-info { border-left: 4px solid var(--clr-accent); }
.toast-icon {
  width: 20px; height: 20px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 700; flex-shrink: 0;
}
.toast-success .toast-icon { background: var(--clr-success-light); color: var(--clr-success); }
.toast-error .toast-icon { background: var(--clr-danger-light); color: var(--clr-danger); }
.toast-warning .toast-icon { background: var(--clr-warning-light); color: var(--clr-warning); }
.toast-info .toast-icon { background: var(--clr-accent-glow); color: var(--clr-accent-dark); }
.toast-message { flex: 1; color: var(--clr-text); }
.toast-close {
  background: none; border: none; font-size: 1.1rem;
  color: var(--clr-text-muted); cursor: pointer; padding: 0 2px;
  line-height: 1;
}
.toast-close:hover { color: var(--clr-text); }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(30px); }
.toast-leave-to { opacity: 0; transform: translateX(30px); }
@media (max-width: 480px) {
  .toast-wrapper { right: 12px; left: 12px; }
  .toast { min-width: unset; }
}
</style>
