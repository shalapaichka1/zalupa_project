<script setup>
  import MyVideosComponent from '@/components/MyVideosComponent.vue';
  import AllVideosComponent from '@/components/AllVideosComponent.vue';
  import AddVideoComponent from '@/components/AddVideoComponent.vue';
  import { instance } from '../../services/axios/instance';
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth'
  import Cookies from 'js-cookie';
  
  const videoModuleSwitchCondition = ref('all')
  const activeModule = ref('all')

  function openVideoButtonConditionFunction() { 
    useAuthStore().isOpenCloseAddVideoModule = true
  }

  async function switchVideoModulesFunctionFavorites() {
    activeModule.value = 'favorites'
    const res = await instance.get(`/videos?filters[users]?users[username]=${Cookies.get('username')}&filters[agreement_status]=1`)
    useAuthStore().videoList = res.data.data
  }

  async function switchVideoModulesFunctionAll() {
    activeModule.value = 'all'
    const res = await instance.get(`/videos?filters[agreement_status]=1`)
    useAuthStore().videoList = res.data.data
  }

  async function switchVideoModulesFunction(){
    activeModule.value = 'my'
    const res = await instance.get(`/videos/?filters[sender]=${Cookies.get('username')}&filters[agreement_status]=1`)
    useAuthStore().videoList = res.data.data
  }

  async function onChangeCategorySelect(event) {
    useAuthStore().sortCategory = event.target.value
    try {
      if (useAuthStore().sortCategory == "Все") {
        const res = await instance.get(`/videos/?filters[agreement_status]=1`)
        useAuthStore().videoList = res.data.data
      }
      else {
        const res = await instance.get(`/videos/?filters[category]=${useAuthStore().sortCategory}&filters[agreement_status]=1`)
        useAuthStore().videoList = res.data.data
      }
    } catch(error){
        console.error(error)
    }

    if (useAuthStore().videoList.length === 0) {
        useAuthStore().isListEmpty = true
      }
      else {
        useAuthStore().isListEmpty = false
      }
  }

  async function clearFilters() {
    useAuthStore().sortCategory = 'Все'
    try {
      const res = await instance.get(`/videos?filters[agreement_status]=1`)
      useAuthStore().videoList = res.data.data
      if (useAuthStore().videoList.length === 0) {
        useAuthStore().isListEmpty = true
      }
      else {
        useAuthStore().isListEmpty = false
      }
    } catch{
        
    }
  }
</script>

<template>
  <div class="video-view-header">
    <div class="switch-video-modules">
      <button 
        @click="switchVideoModulesFunctionAll" 
        :class="{ active: activeModule === 'all' }"
      >
        Все видео
      </button>
      <button 
        @click="switchVideoModulesFunction" 
        :class="{ active: activeModule === 'my' }"
      >
        Ваши видео
      </button>
      <button 
        @click="switchVideoModulesFunctionFavorites" 
        :class="{ active: activeModule === 'favorites' }"
      >
        Избранное
      </button>
    </div>
    <div class="navigation">
      <div>
        <h1 class="input-select-title">Статус</h1>
        <select v-model="useAuthStore().sortCategory" @change="onChangeCategorySelect" class="moderation-video-main-area-header-search-select" name="video_category">
          <option value="Все">Все</option>
          <option value="Веселое">Веселое</option>
          <option value="Трукрайм">Трукрайм</option>
          <option value="Разоблачения">Разоблачения</option>
          <option value="Политика">Политика</option>
          <option value="Страшное">Страшное</option>
          <option value="Клипы">Клипы</option>
          <option value="Игры">Игры</option>
          <option value="Другое">Другое</option>
        </select>
      </div>

      <button class="clearButton" @click="clearFilters">
        <img src="../images/clearButton.png" alt="">
      </button>
    </div>
  </div>

  <main>
    <MyVideosComponent v-if="videoModuleSwitchCondition === 'my'"/>
    <AllVideosComponent v-else/>
  </main>
  
  <div v-if="useAuthStore().isAuthorized" class="footer">
    <button @click="openVideoButtonConditionFunction" class="sendVideoButton">Отправить видео</button>
  </div>
  
  <AddVideoComponent/>
</template>

<style scoped lang="scss">
.sendVideoButton {
  background-color: #6441a1;
  border: 1px solid #6441a1;
  font-size: 18px;
}

.navigation {
  display: flex;
  gap: 15px;
}

.footer {
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  position: fixed;
  display:flex;
  justify-content: center;
  padding: 15px;
  background-color:  #15151559;
  backdrop-filter: blur(20px);
}

.video-view-header {
  position: absolute;
  z-index: 2;
  background-color: #15151559;
  box-shadow: 0px 15px 15px 0px #00000073;
  backdrop-filter: blur(20px);
  padding: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.switch-video-modules {
  position: relative;
  display: flex;
  gap: 15px;

  button {
    width: 150px;
    color: white;
    background-color: transparent;
    border: 1px solid #6441a1a5;
    transition: all 0.3s ease;
    
    &.active {
      background-color: #6441a1;
      border-color: #7d5bbe;
      box-shadow: 0 0 10px rgba(100, 65, 161, 0.5);
    }
    
    &:hover {
      background-color: rgba(100, 65, 161, 0.3);
    }
    
    &.active:hover {
      background-color: #7d5bbe;
    }
  }
}
</style>