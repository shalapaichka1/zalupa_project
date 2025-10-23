<script setup>
import { useAuthStore } from '@/stores/auth'
import { instance } from '../../services/axios/instance'
import IdeasLogo from '../../src/images/IdeasRepec.svg'
import VideoLogo from '../../src/images/Video.svg'

async function getVidoesCount() {
    const videoCount = await instance.get('videos?filters[agreement_status]=0');
    useAuthStore().newVideoCount = videoCount.data.data.length
    console.log(useAuthStore().newVideoCount)

    const ideaCount = await instance.get('ideas?filters[agreement_status]=0');
    useAuthStore().newIdeaCount = ideaCount.data.data.length
    console.log(useAuthStore().newIdeaCount)
}
await getVidoesCount()
const modsInfo = [
  {
    id: 1,
    name: 'Идеи', 
    count: useAuthStore().newIdeaCount,
    image: IdeasLogo,
    link: '/moderation/ideas'
  },
  {
    id: 2,
    name: 'Видео',
    count: useAuthStore().newVideoCount,
    image: VideoLogo,
    link: '/moderation/videos'
  }
]
</script>

<template>
  <div class="moderation-body">
    <router-link :class="mod"
      v-for="element in modsInfo"
      :key="element.id"
      class="moderation-mods"
      :to="element.link"
    >
    <div class="mod-info">
      <component class="img-logo" :is="element.image" />
      <label class="count-items" for="">Новых: {{ element.count }}</label>
    </div>
    </router-link>
  </div>
</template>

<style scoped>
.mod-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  label {
    font-size: 28px;
  }
}
.moderation-body {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  height: 90vh;
}

.moderation-mods {
  display: flex;
  border-radius: 15px;
  background-color: #ff000000;
  width: 40vh;
  height: 80%;
  justify-content: center;
  align-items: center;
  background-color: #ffffff06;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0px 0px 15px 0px #fff;
  }
}

.img-logo {
  width: 20rem;
  height: 20rem;
  color: aliceblue;
}
</style>