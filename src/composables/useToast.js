import { ref } from 'vue'

const toasts = ref([])

let _id = 0

export function useToast() {
  function show(message, type = 'success', duration = 3500) {
    const id = ++_id
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  function success(msg) { show(msg, 'success') }
  function error(msg) { show(msg, 'error', 4500) }
  function info(msg) { show(msg, 'info') }
  function warning(msg) { show(msg, 'warning') }

  function dismiss(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, show, success, error, info, warning, dismiss }
}
