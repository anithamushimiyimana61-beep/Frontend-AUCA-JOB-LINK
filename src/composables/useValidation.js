import { ref, reactive } from 'vue'

export function useValidation(rules) {
  const errors = reactive({})
  const touched = reactive({})

  function validate(field, value) {
    const fieldRules = rules[field]
    if (!fieldRules) return true

    for (const rule of fieldRules) {
      const result = rule(value)
      if (result !== true) {
        errors[field] = result
        return false
      }
    }
    delete errors[field]
    return true
  }

  function touch(field, value) {
    touched[field] = true
    validate(field, value)
  }

  function validateAll(data) {
    let valid = true
    for (const field of Object.keys(rules)) {
      touched[field] = true
      if (!validate(field, data[field])) valid = false
    }
    return valid
  }

  function reset() {
    for (const k of Object.keys(errors)) delete errors[k]
    for (const k of Object.keys(touched)) delete touched[k]
  }

  return { errors, touched, validate, touch, validateAll, reset }
}

// Common validators
export const validators = {
  required: (msg = 'This field is required') => (v) => (v && String(v).trim().length > 0) ? true : msg,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : 'Enter a valid email address',
  minLength: (n, msg) => (v) => (v && v.length >= n) ? true : (msg || `Minimum ${n} characters required`),
  maxLength: (n, msg) => (v) => (!v || v.length <= n) ? true : (msg || `Maximum ${n} characters allowed`),
  auca_email: (v) => /^[^\s@]+@auca\.ac\.rw$/.test(v) ? true : 'Use your AUCA email (@auca.ac.rw)',
  deadline: (v) => {
    if (!v) return 'Deadline is required'
    const d = new Date(v)
    if (isNaN(d.getTime())) return 'Invalid date'
    if (d <= new Date()) return 'Deadline must be in the future'
    return true
  },
  url: (v) => !v || /^https?:\/\/.+/.test(v) ? true : 'Enter a valid URL (https://...)'
}
