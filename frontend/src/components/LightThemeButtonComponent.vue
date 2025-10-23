<script setup>
import { useAuthStore } from '@/stores/auth';
</script>

<template>
    <div class="switch-body" @click="useAuthStore().isDarkTheme = !useAuthStore().isDarkTheme">
        <span>Темная</span>
        <img class="switch-img" src="../images/Moon.png" alt="Sun">
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
    color: rgb(0, 0, 0);
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