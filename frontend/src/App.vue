<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HeaderComponent from '/src/components/HeaderComponent.vue'
import SignInComponent from '@/components/SignInComponent.vue'
import { useAuthStore } from '@/stores/auth'
import { Toaster } from 'vue3-hot-toast'
</script>

<template>
  <HeaderComponent/>
  <SignInComponent v-if="useAuthStore().isOpenSignInComponent"/>
  <RouterView/>
  <Toaster
  position="top-left"
  :reverseOrder="false"
  />
</template>
