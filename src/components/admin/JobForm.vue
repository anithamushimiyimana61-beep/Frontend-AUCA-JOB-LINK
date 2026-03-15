<template>
  <form @submit.prevent="handleSubmit" novalidate class="job-form" aria-label="Job posting form">
    <div class="form-grid">
      <!-- Title -->
      <div class="form-group col-full">
        <label for="jf-title" class="form-label">Job Title <span class="required" aria-label="required">*</span></label>
        <input id="jf-title" v-model.trim="form.title" @blur="touch('title', form.title)"
          type="text" class="form-input" :class="{ error: errors.title && touched.title }"
          placeholder="e.g. Frontend Developer"
          :aria-invalid="!!(errors.title && touched.title)"
          :aria-describedby="errors.title && touched.title ? 'jf-title-err' : undefined" />
        <Transition name="fade">
          <p v-if="errors.title && touched.title" id="jf-title-err" class="form-error" role="alert">{{ errors.title }}</p>
        </Transition>
      </div>

      <!-- Company -->
      <div class="form-group">
        <label for="jf-company" class="form-label">Company <span class="required" aria-label="required">*</span></label>
        <input id="jf-company" v-model.trim="form.company" @blur="touch('company', form.company)"
          type="text" class="form-input" :class="{ error: errors.company && touched.company }"
          placeholder="e.g. Irembo Ltd"
          :aria-invalid="!!(errors.company && touched.company)"
          :aria-describedby="errors.company && touched.company ? 'jf-company-err' : undefined" />
        <Transition name="fade">
          <p v-if="errors.company && touched.company" id="jf-company-err" class="form-error" role="alert">{{ errors.company }}</p>
        </Transition>
      </div>

      <!-- Location -->
      <div class="form-group">
        <label for="jf-location" class="form-label">Location <span class="required" aria-label="required">*</span></label>
        <input id="jf-location" v-model.trim="form.location" @blur="touch('location', form.location)"
          type="text" class="form-input" :class="{ error: errors.location && touched.location }"
          placeholder="e.g. Kigali, Rwanda"
          :aria-invalid="!!(errors.location && touched.location)"
          :aria-describedby="errors.location && touched.location ? 'jf-location-err' : undefined" />
        <Transition name="fade">
          <p v-if="errors.location && touched.location" id="jf-location-err" class="form-error" role="alert">{{ errors.location }}</p>
        </Transition>
      </div>

      <!-- Type -->
      <div class="form-group">
        <label for="jf-type" class="form-label">Job Type <span class="required" aria-label="required">*</span></label>
        <select id="jf-type" v-model="form.type" @change="touch('type', form.type)"
          class="form-select" :class="{ error: errors.type && touched.type }"
          :aria-invalid="!!(errors.type && touched.type)">
          <option value="" disabled>Select type</option>
          <option>Full-time</option><option>Part-time</option>
          <option>Internship</option><option>Contract</option>
        </select>
        <Transition name="fade">
          <p v-if="errors.type && touched.type" class="form-error" role="alert">{{ errors.type }}</p>
        </Transition>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="jf-category" class="form-label">Category <span class="required" aria-label="required">*</span></label>
        <select id="jf-category" v-model="form.category" @change="touch('category', form.category)"
          class="form-select" :class="{ error: errors.category && touched.category }">
          <option value="" disabled>Select category</option>
          <option>Technology</option><option>Finance</option><option>Healthcare</option>
          <option>Education</option><option>Engineering</option><option>Marketing</option><option>Other</option>
        </select>
        <Transition name="fade">
          <p v-if="errors.category && touched.category" class="form-error" role="alert">{{ errors.category }}</p>
        </Transition>
      </div>

      <!-- Level -->
      <div class="form-group">
        <label for="jf-level" class="form-label">Target Level <span class="required" aria-label="required">*</span></label>
        <select id="jf-level" v-model="form.level" class="form-select">
          <option value="" disabled>Select level</option>
          <option>Graduate</option><option>Undergraduate</option><option>Both</option>
        </select>
      </div>

      <!-- Salary -->
      <div class="form-group">
        <label for="jf-salary" class="form-label">Salary / Compensation</label>
        <input id="jf-salary" v-model.trim="form.salary" type="text" class="form-input"
          placeholder="e.g. RWF 400,000/month" />
        <p class="form-hint">Optional. Be transparent to attract more applicants.</p>
      </div>

      <!-- Deadline -->
      <div class="form-group">
        <label for="jf-deadline" class="form-label">Application Deadline <span class="required" aria-label="required">*</span></label>
        <input id="jf-deadline" v-model="form.deadline" @blur="touch('deadline', form.deadline)"
          type="date" class="form-input" :class="{ error: errors.deadline && touched.deadline }"
          :aria-invalid="!!(errors.deadline && touched.deadline)" />
        <Transition name="fade">
          <p v-if="errors.deadline && touched.deadline" class="form-error" role="alert">{{ errors.deadline }}</p>
        </Transition>
      </div>

      <!-- Logo / Logo Color -->
      <div class="form-group">
        <label for="jf-logo" class="form-label">Company Logo Letter</label>
        <input id="jf-logo" v-model.trim="form.logo" type="text" class="form-input"
          maxlength="2" placeholder="e.g. I" />
        <p class="form-hint">1–2 letter abbreviation shown as company logo.</p>
      </div>
      <div class="form-group">
        <label for="jf-logoColor" class="form-label">Logo Color</label>
        <input id="jf-logoColor" v-model="form.logoColor" type="color" class="form-input color-input" />
      </div>

      <!-- Description -->
      <div class="form-group col-full">
        <label for="jf-desc" class="form-label">Job Description <span class="required" aria-label="required">*</span></label>
        <textarea id="jf-desc" v-model.trim="form.description" @blur="touch('description', form.description)"
          class="form-textarea" :class="{ error: errors.description && touched.description }"
          rows="5" placeholder="Describe the role, responsibilities, and what success looks like…"
          :aria-invalid="!!(errors.description && touched.description)"></textarea>
        <Transition name="fade">
          <p v-if="errors.description && touched.description" class="form-error" role="alert">{{ errors.description }}</p>
        </Transition>
      </div>

      <!-- Requirements -->
      <div class="form-group col-full">
        <label for="jf-req" class="form-label">Requirements <span class="required" aria-label="required">*</span></label>
        <textarea id="jf-req" v-model.trim="form.requirements" @blur="touch('requirements', form.requirements)"
          class="form-textarea" :class="{ error: errors.requirements && touched.requirements }"
          rows="4" placeholder="List qualifications, experience, skills required…"
          :aria-invalid="!!(errors.requirements && touched.requirements)"></textarea>
        <Transition name="fade">
          <p v-if="errors.requirements && touched.requirements" class="form-error" role="alert">{{ errors.requirements }}</p>
        </Transition>
      </div>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Cancel</button>
      <button type="submit" class="btn btn-primary" :disabled="submitting" :aria-busy="submitting">
        <span v-if="submitting" class="spinner" aria-hidden="true"></span>
        {{ submitting ? 'Saving…' : submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useValidation, validators } from '@/composables/useValidation'

const props = defineProps({
  initial: { type: Object, default: () => ({}) },
  submitLabel: { type: String, default: 'Save Job' },
  submitting: { type: Boolean, default: false }
})
const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  title: '', company: '', location: '', type: '', category: '', level: 'Graduate',
  salary: '', deadline: '', logo: '', logoColor: '#0ea5e9',
  description: '', requirements: '',
  ...props.initial
})

watch(() => props.initial, (val) => {
  if (val && Object.keys(val).length) Object.assign(form, val)
}, { deep: true })

const { errors, touched, touch, validateAll } = useValidation({
  title: [validators.required('Job title is required'), validators.minLength(3)],
  company: [validators.required('Company name is required')],
  location: [validators.required('Location is required')],
  type: [validators.required('Job type is required')],
  category: [validators.required('Category is required')],
  deadline: [validators.deadline],
  description: [validators.required('Description is required'), validators.minLength(30, 'Description must be at least 30 characters')],
  requirements: [validators.required('Requirements are required'), validators.minLength(20, 'Requirements must be at least 20 characters')],
})

function handleSubmit() {
  if (!validateAll(form)) return
  emit('submit', { ...form })
}
</script>

<style scoped>
.job-form { display: flex; flex-direction: column; gap: var(--space-6); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); }
.col-full { grid-column: 1 / -1; }
.color-input { height: 42px; padding: 4px; cursor: pointer; }
.form-actions { display: flex; gap: var(--space-4); justify-content: flex-end; padding-top: var(--space-4); border-top: 1px solid var(--clr-border); }
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } .col-full { grid-column: unset; } }
</style>
