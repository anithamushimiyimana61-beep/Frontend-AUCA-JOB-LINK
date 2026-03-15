<template>
  <div class="login-page">
    <div class="login-left" aria-hidden="true">
      <div class="login-left-content">
        <img src="/auca-logo.png" alt="AUCA Logo" class="auca-logo" />
        <h2>AUCA Job-Link</h2>
        <p>Your gateway to career opportunities as an AUCA student or graduate.</p>
        <div class="login-quotes">
          <blockquote>"The future belongs to those who prepare for it today."</blockquote>
          <cite>— Malcolm X</cite>
        </div>
      </div>
    </div>

    <main id="main-content" class="login-right">
      <div class="login-box">
        <RouterLink :to="isAdminLogin ? '/' : '/'" class="back-link" :aria-label="isAdminLogin ? 'Back to home' : 'Back to home'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </RouterLink>

        <div class="login-header">
          <h1 class="login-title">{{ isAdminLogin ? 'Admin Sign In' : 'Sign In' }}</h1>
          <p class="login-sub">{{ isAdminLogin ? 'Access the AUCA Job-Link admin panel' : 'Access your AUCA Job-Link account' }}</p>
        </div>

        <!-- Error alert -->
        <Transition name="fade">
          <div v-if="authStore.error" class="alert alert-error" role="alert" aria-live="assertive">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {{ authStore.error }}
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" novalidate aria-label="Login form">
          <!-- Email -->
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="email" class="form-label">
              Email address <span class="required" aria-label="required">*</span>
            </label>
            <input
              id="email"
              v-model.trim="form.email"
              @blur="touch('email', form.email)"
              @input="clearAuthError"
              type="email"
              class="form-input"
              :class="{ error: errors.email && touched.email }"
              placeholder="you@auca.ac.rw"
              autocomplete="email"
              :aria-invalid="!!(errors.email && touched.email)"
              :aria-describedby="errors.email && touched.email ? 'email-error' : undefined"
              required
            />
            <Transition name="fade">
              <p v-if="errors.email && touched.email" id="email-error" class="form-error" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                {{ errors.email }}
              </p>
            </Transition>
          </div>

          <!-- Password -->
          <div class="form-group" style="margin-bottom: 24px;">
            <label for="password" class="form-label">
              Password <span class="required" aria-label="required">*</span>
            </label>
            <div class="input-wrapper">
              <input
                id="password"
                v-model="form.password"
                @blur="touch('password', form.password)"
                @input="clearAuthError"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ error: errors.password && touched.password }"
                placeholder="Enter your password"
                autocomplete="current-password"
                :aria-invalid="!!(errors.password && touched.password)"
                :aria-describedby="errors.password && touched.password ? 'password-error' : undefined"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :aria-pressed="showPassword"
              >
                <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
            <Transition name="fade">
              <p v-if="errors.password && touched.password" id="password-error" class="form-error" role="alert">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                {{ errors.password }}
              </p>
            </Transition>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-full btn-lg"
            :disabled="authStore.loading"
            :aria-busy="authStore.loading"
          >
            <span v-if="authStore.loading" class="spinner" aria-hidden="true"></span>
            <span>{{ authStore.loading ? 'Signing in…' : 'Sign In' }}</span>
          </button>
        </form>

        <p v-if="!isAdminLogin" class="register-link">Don't have an account? <RouterLink to="/register">Create one</RouterLink></p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useValidation, validators } from '@/composables/useValidation'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isAdminLogin = computed(() => route.name === 'admin-login')

const form = reactive({ email: '', password: '' })
const showPassword = ref(false)

const { errors, touched, touch, validateAll } = useValidation({
  email: [validators.required('Email is required'), validators.email],
  password: [validators.required('Password is required'), validators.minLength(6)]
})

function clearAuthError() {
  authStore.clearError()
}

async function handleLogin() {
  if (!validateAll(form)) return
  const result = await authStore.login(form.email, form.password)
  if (result.success) {
    const redirect = router.currentRoute.value.query.redirect
    if (redirect) return router.push(redirect)
    router.push(result.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
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
.auca-logo {
  width: 120px;
  height: auto;
  margin: 0 auto var(--space-5);
  display: block;
  border-radius: var(--radius-md);
}
.login-left-content h2 { font-size: 1.6rem; margin-bottom: var(--space-3); }
.login-left-content p { color: rgba(255,255,255,0.65); line-height: 1.6; margin-bottom: var(--space-10); }
.login-quotes { border-top: 1px solid rgba(255,255,255,0.1); padding-top: var(--space-6); }
.login-quotes blockquote { font-style: italic; color: rgba(255,255,255,0.8); margin-bottom: var(--space-2); line-height: 1.5; }
.login-quotes cite { font-size: 0.8rem; color: rgba(255,255,255,0.45); }
.login-right {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  padding: var(--space-8) var(--space-4);
  background: var(--clr-bg);
}
.login-box { width: 100%; max-width: 420px; }
.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.85rem; color: var(--clr-text-secondary);
  margin-bottom: var(--space-6);
  transition: color var(--transition-fast);
}
.back-link:hover { color: var(--clr-accent-dark); }
.login-header { margin-bottom: var(--space-6); }
.login-title { font-size: 1.8rem; margin-bottom: var(--space-1); }
.login-sub { color: var(--clr-text-secondary); font-size: 0.9rem; }
.alert { margin-bottom: var(--space-4); }
.input-wrapper { position: relative; }
.input-wrapper .form-input { padding-right: 44px; }
.toggle-password {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none;
  color: var(--clr-text-muted); cursor: pointer; padding: 4px;
  display: flex; align-items: center;
}
.toggle-password:hover { color: var(--clr-text-secondary); }
.register-link { text-align: center; margin-top: var(--space-5); font-size: 0.875rem; color: var(--clr-text-secondary); }
.register-link a { color: var(--clr-accent-dark); font-weight: 600; }
</style>
