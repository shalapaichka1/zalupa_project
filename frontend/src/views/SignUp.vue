<script setup>
import SignUpComponent from '../components/SignUpComponent.vue'
import SignInComponent from '../components/SignInComponent.vue'
import {useAuthStore} from '../stores/auth'

</script>

<template>
    <SignUpComponent v-if="useAuthStore().isChatOpen"/>
    <SignInComponent v-else/>
</template>