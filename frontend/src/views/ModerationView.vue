<script setup>
import ModerationComponent from '../components/ModerationComponent.vue'
import ModerationIdeaFilters from '@/components/ModerationIdeaFilters.vue';
import { useAuthStore } from '../stores/auth';
</script>

<template>
    <Suspense>
        <ModerationComponent v-if="useAuthStore().userInfo.isModerator"/>
    </Suspense>
</template>

