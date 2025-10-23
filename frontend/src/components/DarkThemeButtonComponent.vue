<script setup>
import { useAuthStore } from '@/stores/auth';
</script>

<template>
    <div class="switch-body" @click="useAuthStore().isDarkTheme = !useAuthStore().isDarkTheme">
        <img class="switch-img" src="../images/Sun.png" alt="Sun">
        <span>Светлая</span>
    </div>
</template>

<style scoped>

.switch-img {
    height: 30px;
}
.switch-body {
    background-color: #15151570;
    justify-content: space-between;
    height: 3rem;
    width: 3rem;
    display: flex;
    align-items: center;
    padding: 15px;
    width: 150px;
    border-radius: 15px;
    border: 1px solid #494949;
    color: white;
    cursor: pointer;
    user-select: none;

        &:hover {
        transform: scale(1.05)
    }

        &:active {
        transform: scale(.99);
    }
}

</style>