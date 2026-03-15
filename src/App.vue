<template>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/shared/ToastContainer.vue'
</script>
