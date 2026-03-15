<template>
  <div class="login-page">
    <div class="login-left" aria-hidden="true">
      <div class="login-left-content">
        <img src="/auca-logo.png" alt="AUCA Logo" class="auca-logo" />
        <h2>AUCA Job-Link</h2>
        <p>Join the AUCA community and start your career journey today.</p>
        <div class="login-quotes">
          <blockquote>"Education is the most powerful weapon which you can use to change the world."</blockquote>
          <cite>— Nelson Mandela</cite>
        </div>
      </div>
    </div>

    <main id="main-content" class="login-right">
      <div class="login-box">
        <RouterLink to="/login" class="back-link" aria-label="Back to login">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Sign In
        </RouterLink>

        <div class="login-header">
          <h1 class="login-title">Create Account</h1>
          <p class="login-sub">Register for your AUCA Job-Link account</p>
        </div>

        <Transition name="fade">
          <div v-if="errorMsg" class="alert alert-error" role="alert" aria-live="assertive">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ errorMsg }}
          </div>
        </Transition>

        <form @submit.prevent="handleRegister" novalidate aria-label="Registration form">
          <div class="form-group">
            <label for="name" class="form-label">Full Name <span class="required" aria-label="required">*</span></label>
            <input
              id="name"
              v-model.trim="form.name"
              @blur="touch('name', form.name)"
              type="text"
              class="form-input"
              :class="{ error: errors.name && touched.name }"
              placeholder="Your full name"
              autocomplete="name"
              required
            />
            <Transition name="fade">
              <p v-if="errors.name && touched.name" class="form-error" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                {{ errors.name }}
              </p>
            </Transition>
          </div>

          <div class="form-group">
            <label for="studentId" class="form-label">Student ID <span class="required" aria-label="required">*</span></label>
            <input
              id="studentId"
              v-model.trim="form.studentId"
              @blur="touch('studentId', form.studentId)"
              type="text"
              class="form-input"
              :class="{ error: errors.studentId && touched.studentId }"
              placeholder="e.g. AUCA/2024/IT/001"
              autocomplete="off"
              required
            />
            <Transition name="fade">
              <p v-if="errors.studentId && touched.studentId" class="form-error" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                {{ errors.studentId }}
              </p>
            </Transition>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email address <span class="required" aria-label="required">*</span></label>
              class="form-input"
              :class="{ error: errors.email && touched.email }"
              placeholder="you@auca.ac.rw"
              autocomplete="email"
              required
            />
            <Transition name="fade">
              <p v-if="errors.email && touched.email" class="form-error" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                {{ errors.email }}
              </p>
            </Transition>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password <span class="required" aria-label="required">*</span></label>
            <div class="input-wrapper">
              <input
                id="password"
                v-model="form.password"
                @blur="touch('password', form.password)"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ error: errors.password && touched.password }"
                placeholder="Min. 6 characters"
                autocomplete="new-password"
                required
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <Transition name="fade">
              <p v-if="errors.password && touched.password" class="form-error" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                {{ errors.password }}
              </p>
            </Transition>
          </div>


          <button type="submit" class="btn btn-primary btn-full btn-lg" :disabled="loading" :aria-busy="loading">
            <span v-if="loading" class="spinner" aria-hidden="true"></span>
            <span>{{ loading ? 'Creating account…' : 'Create Account' }}</span>
          </button>
        </form>

        <p class="register-link">Already have an account? <RouterLink to="/login">Sign In</RouterLink></p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useValidation, validators } from '@/composables/useValidation'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

const form = reactive({ name: '', email: '', password: '', studentId: '', role: 'student' })

const { errors, touched, touch, validateAll } = useValidation({
  name: [validators.required('Full name is required')],
  email: [
    validators.required('Email is required'),
    validators.email,
    validators.auca_email
  ],
  studentId: [validators.required('Student ID is required')],
  password: [validators.required('Password is required'), validators.minLength(6)]
})

async function handleRegister() {
  if (!validateAll(form)) return
  loading.value = true
  errorMsg.value = ''
  try {
    const result = await authStore.register({ ...form, role: 'student' })
    if (result?.success) {
      router.push('/student/dashboard')
    } else {
      errorMsg.value = result?.message || 'Registration failed. Please try again.'
    }
  } catch {
    errorMsg.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page { display: flex; min-height: 100vh; }
.login-left {
  display: none;
  background: var(--clr-primary);
  position: relative;
  overflow: hidden;
}
@media (min-width: 900px) {
  .login-left { display: flex; flex: 0 0 420px; align-items: center; justify-content: center; padding: var(--space-12); }
}
.login-left::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 30% 70%, rgba(0,201,167,0.15) 0%, transparent 60%);
}
.login-left-content { position: relative; z-index: 1; text-align: center; color: #fff; }
.auca-logo { width: 120px; height: auto; margin: 0 auto var(--space-5); display: block; border-radius: var(--radius-md); }
.login-left-content h2 { font-size: 1.6rem; margin-bottom: var(--space-3); }
.login-left-content p { color: rgba(255,255,255,0.65); line-height: 1.6; margin-bottom: var(--space-10); }
.login-quotes { border-top: 1px solid rgba(255,255,255,0.1); padding-top: var(--space-6); }
.login-quotes blockquote { font-style: italic; color: rgba(255,255,255,0.8); margin-bottom: var(--space-2); line-height: 1.5; }
.login-quotes cite { font-size: 0.8rem; color: rgba(255,255,255,0.45); }
.login-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: var(--space-8) var(--space-4); background: var(--clr-bg); }
.login-box { width: 100%; max-width: 420px; }
.back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--clr-text-secondary); margin-bottom: var(--space-6); transition: color var(--transition-fast); }
.back-link:hover { color: var(--clr-accent-dark); }
.login-header { margin-bottom: var(--space-6); }
.login-title { font-size: 1.8rem; margin-bottom: var(--space-1); }
.login-sub { color: var(--clr-text-secondary); font-size: 0.9rem; }
.form-group { margin-bottom: 16px; }
.alert { margin-bottom: var(--space-4); }
.input-wrapper { position: relative; }
.input-wrapper .form-input { padding-right: 44px; }
.toggle-password { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--clr-text-muted); cursor: pointer; padding: 4px; display: flex; align-items: center; }
.toggle-password:hover { color: var(--clr-text-secondary); }
.register-link { text-align: center; margin-top: var(--space-5); font-size: 0.875rem; color: var(--clr-text-secondary); }
.register-link a { color: var(--clr-accent-dark); font-weight: 600; }
</style>
