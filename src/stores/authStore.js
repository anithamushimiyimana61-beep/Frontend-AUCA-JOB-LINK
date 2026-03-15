import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Simulated user database (persisted via localStorage)
const DEFAULT_USERS = [
  {
    id: 'admin-001',
    email: 'HOD@auca.rw',
    password: 'HOD123',
    role: 'admin',
    name: 'AUCA Admin',
    avatar: 'A'
  }
]

const USERS_KEY = 'auca_job_link_users'
const AUTH_KEY = 'auca_job_link_auth'

function loadUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // ignore
  }
  return DEFAULT_USERS
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    // ignore
  }
}

function isAucaEmail(email) {
  return /@(auca\.ac\.rw|auca\.rw)$/i.test(email)
}

const USERS_DB = loadUsers()

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isStudent = computed(() => user.value?.role === 'student')
  const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  })

  // Restore session from localStorage
  function restoreSession() {
    try {
      const saved = localStorage.getItem(AUTH_KEY)
      if (saved) {
        user.value = JSON.parse(saved)
      }
    } catch {
      user.value = null
    }
  }

  // Helper to find users (for lists / admin views)
  function getUserById(id) {
    return USERS_DB.find(u => u.id === id) || null
  }

  // Login (accepts email or full name)
  async function login(identifier, password) {
    loading.value = true
    error.value = null

    // Simulate API delay
    await new Promise(r => setTimeout(r, 900))

    const identifierLower = identifier.toLowerCase().trim()

    // Enforce AUCA email domain for sign-in if user enters an email.
    if (identifierLower.includes('@') && !isAucaEmail(identifierLower)) {
      loading.value = false
      error.value = 'Please sign in using your AUCA email address (e.g. user@auca.ac.rw).'
      return { success: false }
    }

    const found = USERS_DB.find(u => {
      const matchesEmail = u.email.toLowerCase() === identifierLower
      const matchesName = u.name.toLowerCase() === identifierLower
      return (matchesEmail || matchesName) && u.password === password
    })

    if (!found) {
      loading.value = false
      error.value = 'Invalid email or password. Please try again.'
      return { success: false }
    }

    // Store without password
    const { password: _, ...safeUser } = found
    user.value = safeUser
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser))
    loading.value = false
    return { success: true, role: safeUser.role }
  }

  // Register
  async function register({ name, email, password, role, studentId }) {
    await new Promise(r => setTimeout(r, 900))

    const normalizedEmail = email.toLowerCase().trim()

    if (role === 'student' && !isAucaEmail(normalizedEmail)) {
      return { success: false, message: 'Student email must end with @auca.ac.rw.' }
    }

    const exists = USERS_DB.find(u => u.email.toLowerCase() === normalizedEmail)
    if (exists) return { success: false, message: 'An account with this email already exists.' }

    const newUser = {
      id: `${role}-${Date.now()}`,
      email: normalizedEmail,
      password,
      role,
      name,
      avatar: name[0].toUpperCase(),
      ...(role === 'student' && { studentId, program: '', year: '' })
    }
    USERS_DB.push(newUser)
    saveUsers(USERS_DB)

    const { password: _, ...safeUser } = newUser
    user.value = safeUser
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser))
    return { success: true, role: safeUser.role }
  }

  // Logout
  function logout() {
    user.value = null
    localStorage.removeItem(AUTH_KEY)
  }

  // Clear error
  function clearError() {
    error.value = null
  }

  return {
    user, loading, error,
    isAuthenticated, isAdmin, isStudent, userInitials,
    restoreSession, login, register, logout, clearError,
    getUserById
  }
})
