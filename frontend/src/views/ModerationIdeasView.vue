<script setup>

import HeaderComponent from './HeaderComponent.vue';
import ModerationIdeasComponent from '@/components/ModerationIdeasComponent.vue';
import { useAuthStore } from '../stores/auth';

</script>

<template v-if="useAuthStore().userInfo.isModerator">
    <HeaderComponent/>
    <ModerationIdeasComponent v-if="useAuthStore().userInfo.isModerator"/> 
</template>