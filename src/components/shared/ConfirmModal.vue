<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')" role="dialog" :aria-label="title" aria-modal="true">
        <div class="modal-box" ref="modalRef">
          <div class="modal-icon" :class="type">
            <svg v-if="type === 'danger'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 class="modal-title">{{ title }}</h2>
          <p class="modal-message">{{ message }}</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="$emit('cancel')">{{ cancelText }}</button>
            <button :class="['btn', type === 'danger' ? 'btn-danger' : 'btn-primary']" @click="$emit('confirm')">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
const props = defineProps({
  show: Boolean,
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, default: 'Are you sure?' },
  type: { type: String, default: 'danger' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' }
})
defineEmits(['confirm', 'cancel'])
const modalRef = ref(null)
watch(() => props.show, async (v) => {
  if (v) { await nextTick(); modalRef.value?.querySelector('button')?.focus() }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(10,37,64,0.5);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: var(--space-4);
}
.modal-box {
  background: var(--clr-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  max-width: 400px; width: 100%;
  box-shadow: var(--shadow-lg);
  text-align: center;
}
.modal-icon {
  width: 56px; height: 56px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto var(--space-4);
}
.modal-icon.danger { background: var(--clr-danger-light); color: var(--clr-danger); }
.modal-icon.info { background: var(--clr-accent-glow); color: var(--clr-accent-dark); }
.modal-title { font-size: 1.1rem; margin-bottom: var(--space-2); }
.modal-message { color: var(--clr-text-secondary); font-size: 0.9rem; margin-bottom: var(--space-6); }
.modal-actions { display: flex; gap: var(--space-3); justify-content: center; }
</style>
