<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { instance } from '../../services/axios/instance';
import toast from 'vue3-hot-toast';
import ModerationIdeaFilters from './ModerationIdeaFilters.vue';

const statusesList = {
    0: ['moderation', 'На модерации', '#00000000'],
    1: ['accepted', 'Принято', '#ACFF9E'],
    2: ['mb', 'Отклонено', '#FFD28F'],
}
const buttonsInfo = {
    1: ['Принять'],
    2: ['Отклонить']
}

async function loadIdeas() {
    const res = await instance.get('/ideas?sort[title]=asc&filters[agreement_status]=0')
    useAuthStore().ideaList = res.data.data
}

onMounted(async () => {
    await loadIdeas()
}) 

async function getIdeaStatus(el, status) {
    try {
        const updateData = {
            data: {
                agreement_status: status
            }
        };

        const response = await instance.put(`ideas/${el.documentId}`, updateData);
        
        if (response.data) {
            console.log('Успешно обновлено:', response.data);
            toast.success(`Успешно`)
            loadIdeas(el.agreem)
            return response.data;
        }
        
    } catch (error) {
        console.error('Ошибка:', error.response?.data || error.message);
        throw error;
    }
}
</script>

<template >
    <ModerationIdeaFilters v-if="useAuthStore().userInfo.isModerator"/>

    <div class="ideas-cointainer" v-if="useAuthStore().userInfo.isModerator">
        <div class="idea-elements" v-for="element in useAuthStore().ideaList">
            <div class="new-video-notice" v-if="(element.agreement_status == 0)"></div>

            <div class="idea-description idea-area">
                <div class="idea-headers">
                    <label class="idea-description headers" for="">Описание:</label>
                </div>
                <div class="idea-body">
                    <span>{{ element.description }}</span>
                </div>
                
            </div>
            <div class="idea-info idea-area">

                <div class="idea-headers">

                    <div class="idea-id ">
                        <label for="">Идея №: {{ element.id }}</label>
                    </div>
                </div>

                <div class="idea-body">
                    <div class="idea-title">
                        <label for="">Заголовок: </label>
                        <span>{{ element.title }}</span>
                    </div>
                    <div class="idea-sender">
                        <label for="">Отправил: </label>
                        <span>{{ element.sender }}</span>
                    </div>
                    <div class="idea-category">
                        <label for="">Категория: </label>
                        <span>{{ element.category }}</span>
                    </div>
                    <div class="idea-status">
                        <label for="">Статус: </label>
                        <span>{{ statusesList[element.agreement_status][1] }}</span>

                    </div>
                    <div class="idea-date">
                        <label for="">Дата: </label>
                        <span>{{ element.send_date }}</span>
                    </div>
                    <div class="idea-telegram">
                        <label for="">Telegram: </label>
                        <span>{{ element.telegram_link }}</span>
                    </div>

                </div>
                    <div class="idea-buttons">
                        <button v-for="el in 2" style="" @click="getIdeaStatus(element, el)">
                            {{ buttonsInfo[el][0] }}
                        </button>
                    </div>
            </div>
        </div>
    </div>

</template>

<style lang="scss">
.new-video-notice, .video-agreement{
    right: 0;
    position: absolute;
    margin: 15px;
    color: aliceblue;
    background-color: #ff9d35;
    padding: 15px;
    border-radius: 15px;
    transition: .3s ease-in;
}
.idea-info {
    position: relative;
    display: flex;
    flex-direction: column;
}
.idea-buttons {
    display: flex;
    gap: 15px;
}
.idea-id {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;    
}
.ideas-cointainer {
    padding: 5% 2%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    height: 100vh;
    overflow-y: auto;
}
.idea-elements {
    position: relative;
    width: 30vw;
    height: max-content;
    display: flex;
    margin-bottom: 4vh;
    border: 1px solid rgba(255, 255, 255, 0.124);
    background-color: #22222200;
    border-radius: 15px;
    cursor: pointer;

    &:hover {
        transform: scale(1.01);
    }
}
.idea-area {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    background-color: #22222200;
    border-radius: 15px;
}

</style>