<script setup>
  import { instance } from '../../services/axios/instance';
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth'
  const videoModuleSwitchCondition = ref('all')

  async function onChangeStatusSelect(event) {
    useAuthStore().ideasStatusFilter = event.target.value
    console.log(useAuthStore().ideasStatusFilter)
    try {
      if (useAuthStore().ideasStatusFilter == "Все") {
        const res = await instance.get(`/ideas`)
        useAuthStore().ideaList = res.data.data
      }
      else {
        const res = await instance.get(`/ideas?filters[agreement_status]=${useAuthStore().ideasStatusFilter}`)
        useAuthStore().ideaList = res.data.data
      }

    } catch(error){
        console.error(error)
    }

    if (useAuthStore().ideaList.length === 0) {
        useAuthStore().isListEmpty = true
      }
      else {
        useAuthStore().isListEmpty = false
      }
  }

  async function onChangeCategorySelect(event) {
    useAuthStore().ideasCategoryFilter = event.target.value
    console.log(useAuthStore().ideasCategoryFilter)
    try {
      if (useAuthStore().ideasCategoryFilter == "Все") {
        const res = await instance.get(`/ideas`)
        useAuthStore().ideaList = res.data.data
      }
      else {
        const res = await instance.get(`/ideas?filters[category]=${useAuthStore().ideasCategoryFilter}`)
        useAuthStore().ideaList = res.data.data
      }

    } catch(error){
        console.error(error)
    }

    if (useAuthStore().ideaList.length === 0) {
        useAuthStore().isListEmpty = true
      }
      else {
        useAuthStore().isListEmpty = false
      }
  }
  async function clearFilters() {
    useAuthStore().ideasStatusFilter = 'Все'
    useAuthStore().ideasCategoryFilter = 'Все'
    try {
      const res = await instance.get(`/ideas`)
      useAuthStore().ideaList = res.data.data
      if (useAuthStore().ideaList.length === 0) {
        useAuthStore().isListEmpty = true
      }
      else {
        useAuthStore().isListEmpty = false
      }
    } catch{
        
    }
  }
</script>

<template v-if="useAuthStore().userInfo.isModerator">
  <div class="video-view-header">
    <div class="navigation">
      <div>
        <h1 class="input-select-title">Статус</h1>
        <select v-model="useAuthStore().ideasStatusFilter" @change="onChangeStatusSelect" class="moderation-video-main-area-header-search-select" name="video_category">
          <option value="Все">Все</option>
          <option value="1">Принято</option>
          <option value="2">Отклонено</option>
          <option value="0">На модерации</option>
        </select>
      </div>
        <div>
            <h1 class="input-select-title">Категория</h1>
            <select v-model="useAuthStore().ideasCategoryFilter" @change="onChangeCategorySelect" class="moderation-video-main-area-header-search-select" name="video_category">
            <option value="Все">Все</option>
            <option value="Новый функционал">Новый функционал</option>
            <option value="Улучшение дизайна">Улучшение дизайна</option>
            <option value="Исправление ошибок">Исправление ошибок</option>
            <option value="Оптимизация">Оптимизация</option>
            <option value="Другое">Другое</option>
        </select>
    </div>
    <button class="clearButton" @click="clearFilters">
      <img src="../images/clearButton.png" alt="">
    </button>
    </div>
  </div>
</template>

<style scoped lang="scss">

.sendVideoButton {
  background-color: #6441a1;
  border: 1px solid #6441a1;
  font-size: 18px;
}

.navigation {
  display: flex;
  position: relative;
  gap: 15px;
  right: 0;
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
  display: flex;
  z-index: 2;
  background-color: #15151559;
  box-shadow: 0px 15px 15px 0px #00000073;
  backdrop-filter: blur(20px);
  padding: 15px;
  width: 100%;
  right: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse
}

.switch-video-modules {
  position: relative;
  display: flex;
  gap: 15px;

  button {
    width: 150px;
    color: white;
  }
}
</style>