<script setup>
import { useAuthStore } from '../stores/auth'
import { onMounted, ref } from 'vue'
import { Toaster } from 'vue3-hot-toast'
import ProfileComponent from './ProfileComponent.vue'

import Cookies from 'js-cookie'
import { instance } from '../../services/axios/instance'

onMounted(async () => {
    const isFav = await instance.get(`/videos?filters[users]&users[username]=${Cookies.get('username')}`)
    useAuthStore().myFavorites = isFav.data.data;

    const res = await instance.get(`/users?filters[username]=${Cookies.get('username')}`)
    useAuthStore().userInfo = res.data[0]
    })
function openSignInComponent(){
    useAuthStore().isOpenSignInComponent = !useAuthStore().isOpenSignInComponent
}

function openProfile(){
    useAuthStore().isProfileOpen = !useAuthStore().isProfileOpen
}
</script>
<template>
    <div class="header">
        <div class="header-logo">
            <div class="zalupa-web">
                <router-link to="/videos" class="header-logo-title">ZALUPAWEB</router-link>
                <img class="stitch" src="../images/stitch.svg" alt="">
            </div>

            <a class="eblo-id" href="https://eblo.id/">
                <img src="../images/eblo-logo.svg?url" alt="" >
            </a>
        </div>
        



        <div class="header-navigation">
            <router-link class="header-navigation-items" to="/ideas">Идеи</router-link>
            <router-link class="header-navigation-items" to="/videos">Видео</router-link> 
            <router-link class="header-navigation-items" to="/q&a">Q&A</router-link>
        </div>

        <div class="header-buttons">
            <div v-if="useAuthStore()?.userInfo?.isModerator" class="header-moderation-div">
                <img class="banana" src="../images/banana.svg" alt="">
                <router-link to="/moderation" class="moderation-button">Режим модератора</router-link>
            </div>
            <div class="header-user-buttons">
                <button v-if="!useAuthStore()?.isAuthorized" class="open-sign-in-component-button" @click="openSignInComponent"><img class="header-plus hub" src="../images/Enter.png" alt=""></button>
                <button v-else class="open-profile-button" @click="openProfile"><img class="header-plus hub" src="../images/user.svg?url" alt=""></button>
            </div>
        </div>
    </div>
    <ProfileComponent v-if="useAuthStore().isProfileOpen"/>
</template>

<style scoped>

.eblo-id, .zalupa-web {
    display: flex;
    align-items: center;
    padding: 5px 15px;
    border-radius: 15px;
    height: 60px;

    &:hover{
        box-shadow: 0px 0px 15px 0px #ffffff69;
        transform: scale(1.01);
    }

    &:active {
        transform: scale(.99);
    }
}
.header-plus {
    height: 1.5rem;
}
.open-sign-in-component-button {
    height: 3rem;
    width: 3rem;
}
.open-profile-button {
    height: 3rem;
    width: 3rem;
}
.moderation-button {
    background-color: #15151570;
    text-align: center;
    border: 1px solid #414141;
    height: 3rem;
    padding: 15px;
    align-content: center;
    border-radius: 15px;

    &:hover {
        background-color: #6441a1;
        border: 1px solid #6441a1;
        transform: scale(1.05);
    }
}
.header {
    height: 5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
}

.header-logo {
    display: flex;
    align-items: center;
    gap: 15px;
}

.header-navigation {
    display: grid;
    justify-content: center;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    place-items: center;
}

.header-navigation-items {
    padding: 15px;
    border-radius: 15px;
    border: 1px solid #41414100;
    &:hover {
        transform: scale(1.05);
        border: 1px solid #414141;
    }
    
}
.header-logo-title {
    font-family: 'Libre', sans-serif;
    font-size: 50px;
    font-weight: 100;
    color: white;
}

.header-buttons {
    display: flex;
    align-items: center;
    gap: 15px;
}

.header-moderation-div {
    display: flex;
    align-items: center;
}
</style>