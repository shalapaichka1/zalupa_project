<script setup>
    import { API } from '../../services/api'
    import { ref } from 'vue'
    import { useAuthStore } from '@/stores/auth'
    const isLoading = ref(false)
    const errorMessage = ref('')
    const url = ref('')
    const comment_text = ref('')

    function removeComponent() {
        useAuthStore().isOpenCloseAddVideoModule = false
        errorMessage.value = ''
        url.value = ''
        comment_text.value = ''
    }
    async function checkVideoExists(link) {
        try {
            const response = await API.videos.checkVideoExists(link);
        return response.exists;
            } catch (error) {
        console.error('Ошибка при проверке видео:', error);
        return false;
        }
    }
function isValidYouTubeUrl(url) {
    if (!url || typeof url !== 'string') {
        return false;
    }

    const patterns = [
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(&.*)?$/,
        /^(https?:\/\/)?(www\.)?(youtu\.be\/)([a-zA-Z0-9_-]{11})(\?.*)?$/,
        /^(https?:\/\/)?(www\.)?(youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\?.*)?$/,
        /^(https?:\/\/)?(www\.)?(youtube\.com\/v\/)([a-zA-Z0-9_-]{11})(\?.*)?$/,
        /^(https?:\/\/)?(m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(&.*)?$/
    ];

    return patterns.some(pattern => pattern.test(url));
}
    async function notification() {
        if (url.value === '') {
            showError('Вы не ввели ссылку на видео!')
            return
        }
            
        if (url.value.includes('vkvideo')) {
            showError('Сасеб')
            return
        }
            
        if (!isValidYouTubeUrl(url.value)) {
            showError('Неверная ссылка на YouTube видео')
            return
        }

        isLoading.value = true;
        errorMessage.value = '';

        try {
            const videoExists = await checkVideoExists(url.value);
                
            if (videoExists) {
                showError('Такое видео уже есть в базе!');
                return;
            }
            
        await API.videos.addVideo(url.value, comment_text.value, useAuthStore().userInfo.password);
        removeComponent()
        await API.videos.refreshVideoList();
                
        } catch (error) {
            console.error('Ошибка при добавлении видео:', error);
            showError('Произошла ошибка при добавлении видео');
        } finally {
        isLoading.value = false;
        }
    }

    function showError(message) {
        errorMessage.value = message;
        setTimeout(() => {
        errorMessage.value = '';
        }, 5000);
    }

    function changeColorInfo() {
        const inputElement = document.querySelector('.add-video-module-input');
            
        if (inputElement) {
            if (url.value.length < 42 || !url.value.includes('www.youtube.com/watch?')) {
                inputElement.style.border = '1px solid #FF695B';
            } else {
                inputElement.style.border = '1px solid #ACFF9E';
            }
        }
            
        errorMessage.value = '';
    }
</script>

<template>
    <div class="add-video-module-background" v-if="useAuthStore().isOpenCloseAddVideoModule">
        <div class="add-video-module">
            <h1>Добавить видео</h1>
            
            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>
            
            <input 
                v-model="url"
                @input="changeColorInfo" 
                class="add-video-module-input" 
                type="text" 
                placeholder="Ссылка на видео"
            >
            <input 
                v-model="comment_text" 
                class="add-video-comment-input" 
                type="text" 
                placeholder="Комментарий (не более 50 символов, не обязательно)"
                maxlength="50"
            >
            
            <button 
                class="add-video-module-button" 
                @click="notification" 
                :disabled="isLoading"
            >
                {{ isLoading ? 'Проверка...' : 'Добавить' }}
            </button>
            
            <img 
                src="../images/close-button.png" 
                alt="Закрыть" 
                class="add-video-module-close-button" 
                @click="removeComponent"
            >
        </div>
    </div>
</template>

<style scoped>
    @import '../assets/base.scss';

    .add-video-module-background {
        z-index: 10;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .add-video-module {
        background-color: #ffffff00;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
        border-radius: 5px;
        border: 1px solid #6f6f6f61;
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        width: 800px;
        height: 280px;
        position: relative;
        backdrop-filter: blur(5px);
    }

    .add-video-module h1 {
        font-family: 'Raleway-SemiBold', sans-serif;
        color: white;
        font-size: 28px;
        letter-spacing: 2px;
        text-align: center;
        margin-bottom: 10px;
    }

    .error-message {
        background: #FF695B;
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: 'Raleway-SemiBold', sans-serif;
        font-size: 14px;
        text-align: center;
        animation: slideDown 0.3s ease;
    }

    .add-video-module input:focus {
        border-color: #6441a5;
    }

    .add-video-module button:hover:not(:disabled) {
        background-color: #6441a5;
        color: #fff;
    }

    .add-video-module button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        border-color: #6F6F6F;
    }

    .add-video-module-close-button {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 15px;
        right: 15px;
        cursor: pointer;
    }

    .add-video-module-close-button:hover {
        transform: scale(1.2);
    }   

    .add-video-module-close-button:active {
        transform: scale(0.9);
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>