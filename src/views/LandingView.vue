<template>
  <div class="landing">
    <!-- Hero -->
    <header class="hero" role="banner">
      <nav class="nav" aria-label="Main navigation">
        <div class="nav-brand">
          <img src="/Screenshot 2026-03-15 130628.png" alt="AUCA Logo" class="brand-logo-img" />
          <span class="brand-name">AUCA <strong>Job-Link</strong></span>
        </div>
        <div class="nav-buttons">
          <template v-if="!auth.isAuthenticated">
            <RouterLink to="/login" class="btn btn-outline btn-sm">Login</RouterLink>
            <RouterLink to="/register" class="btn btn-outline btn-sm">Register</RouterLink>
          </template>
          <template v-else>
            <span class="user-info">Welcome, {{ auth.user.name }}</span>
            <button @click="logout" class="btn btn-outline btn-sm">Logout</button>
          </template>
        </div>
        <div class="nav-admin-hint" v-if="!auth.isAuthenticated">
          <RouterLink to="/admin-login" class="admin-link">Admin? Sign in here.</RouterLink>
        </div>
      </nav>

      <div class="hero-content">
        <div class="hero-badge">
          <span>🎓</span> For AUCA Students & Graduates
        </div>
        <h1 class="hero-title">
          Launch Your<br/>
          <span class="accent-text">Career</span> From<br/>
          Campus
        </h1>
        <p class="hero-sub">AUCA Job-Link connects Adventist University students with real employment opportunities — internships, graduate roles, and more.</p>
        <div class="hero-actions">
          <template v-if="!auth.isAuthenticated">
            <RouterLink to="/login" class="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Student Login
            </RouterLink>
            <RouterLink to="/register" class="btn btn-secondary btn-lg">Register</RouterLink>
          </template>
          <template v-else>
            <RouterLink :to="auth.isAdmin ? '/admin/dashboard' : '/student/dashboard'" class="btn btn-primary btn-lg">
              Go to Dashboard
            </RouterLink>
          </template>
        </div>
      </div>

      <!-- Floating stats -->
      <div class="stats-row" aria-label="Platform statistics">
        <div class="stat-chip">
          <strong>5+</strong>
          <span>Active Jobs</span>
        </div>
        <div class="stat-chip">
          <strong>2</strong>
          <span>User Roles</span>
        </div>
        <div class="stat-chip">
          <strong>AUCA</strong>
          <span>Kigali, Rwanda</span>
        </div>
      </div>
    </header>

    <!-- Features -->
    <main id="main-content">
      <section class="features" aria-labelledby="features-heading">
        <div class="container">
          <h2 id="features-heading" class="section-title">Everything You Need</h2>
          <p class="section-sub">A complete job portal designed for the AUCA community</p>
          <div class="features-grid">
            <div class="feature-card" v-for="f in features" :key="f.title">
              <div class="feature-icon" :style="{ background: f.bg }">{{ f.icon }}</div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer" role="contentinfo">
      <p>© {{ new Date().getFullYear() }} AUCA Job-Link — Adventist University of Central Africa, Kigali, Rwanda</p>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

const logout = () => {
  auth.logout()
}

const features = [
  { icon: '🔍', title: 'Browse Jobs', desc: 'Search through curated opportunities posted by the AUCA admin team.', bg: '#e0fdf4' },
  { icon: '📋', title: 'Apply Online', desc: 'Submit your application with a cover letter directly through the platform.', bg: '#eff6ff' },
  { icon: '📊', title: 'Track Applications', desc: 'Monitor the status of every application you submit in one place.', bg: '#fdf4ff' },
  { icon: '🛡️', title: 'Secure Platform', desc: 'Role-based access, input validation, and protected routes keep your data safe.', bg: '#fff7ed' },
]
</script>

<style scoped>
.landing { min-height: 100vh; display: flex; flex-direction: column; }
.hero {
  background: rgba(59, 130, 246, 0.9);
  color: #fff;
  padding: 0 0 var(--space-16);
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(59, 130, 246, 0.7);
  z-index: -1;
}
.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-5) var(--space-8);
}
.nav-brand { display: flex; align-items: center; gap: var(--space-3); }
.brand-logo-img { width: 36px; height: 36px; border-radius: var(--radius-md); object-fit: contain; }
.brand-name { font-family: var(--font-display); font-size: 1rem; color: rgba(255,255,255,0.9); }
.brand-name strong { color: var(--clr-accent); }
.hero-content {
  max-width: 640px;
  margin: var(--space-16) auto 0;
  padding: 0 var(--space-8);
  text-align: center;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-full);
  padding: 5px 14px;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: var(--space-5);
}
.hero-title {
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  line-height: 1.1;
  color: #fff;
  margin-bottom: var(--space-4);
}
.accent-text { color: var(--clr-accent); }
.hero-sub { font-size: 1.05rem; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: var(--space-8); }
.hero-actions { display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap; margin-bottom: var(--space-4); }
.demo-creds { font-size: 0.78rem; color: rgba(255,255,255,0.45); }
.demo-creds code { background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.78rem; }
.stats-row {
  display: flex; justify-content: center; gap: var(--space-6);
  margin-top: var(--space-12);
  flex-wrap: wrap;
}
.stat-chip {
  display: flex; flex-direction: column; align-items: center;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  min-width: 100px;
}
.stat-chip strong { font-family: var(--font-display); font-size: 1.4rem; color: var(--clr-accent); }
.stat-chip span { font-size: 0.75rem; color: rgba(255,255,255,0.6); }
.features { padding: var(--space-16) 0; }
.section-title { text-align: center; font-size: 2rem; margin-bottom: var(--space-2); }
.section-sub { text-align: center; color: var(--clr-text-secondary); margin-bottom: var(--space-10); }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: var(--space-6); }
.feature-card {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}
.feature-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.feature-icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: var(--space-4); }
.feature-card h3 { font-size: 1rem; margin-bottom: var(--space-2); }
.feature-card p { font-size: 0.875rem; color: var(--clr-text-secondary); line-height: 1.5; }
.nav-buttons { display: flex; align-items: center; gap: var(--space-3); }
.nav-admin-hint { margin-top: 8px; }
.admin-link { color: rgba(255,255,255,0.75); font-size: 0.8rem; text-decoration: underline; }
.admin-link:hover { color: rgba(255,255,255,0.95); }
.user-info { color: rgba(255,255,255,0.9); font-size: 0.9rem; font-weight: 500; }
.btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.3); color: #fff; }
.btn-outline:hover { background: rgba(255,255,255,0.1); }
.hero-note { color: rgba(255,255,255,0.75); margin-top: 8px; font-size: 0.9rem; }
@media (max-width: 600px) {
  .nav { padding: var(--space-4); }
  .hero-content { padding: 0 var(--space-4); }
  .hero-actions { flex-direction: column; align-items: stretch; padding: 0 var(--space-4); }
}
</style>
