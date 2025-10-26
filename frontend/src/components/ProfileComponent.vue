<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Cookies from 'js-cookie'
import { instance } from '../../services/axios/instance'
import { API } from '../../services/api'

const isLoading = ref(false)
const isEditings = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const isEditing = ref({
    email: false,
    username: false,
    telegram: false,
})
const profileData = ref({
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  createdAt: '',
  telegram: '',
  phoneNumber: ''
})

async function changePassword() {
  if (!profileData.value.currentPassword) {
    errorMessage.value = 'Введите текущий пароль'
    return
  }

  if (!profileData.value.newPassword) {
    errorMessage.value = 'Введите новый пароль'
    return
  }

  if (profileData.value.newPassword.length < 6) {
    errorMessage.value = 'Новый пароль должен содержать минимум 6 символов'
    return
  }

  if (profileData.value.newPassword !== profileData.value.confirmPassword) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await authStore.changePassword({
      currentPassword: profileData.value.currentPassword,
      newPassword: profileData.value.newPassword
    })
    successMessage.value = 'Пароль успешно изменен'
    profileData.value.currentPassword = ''
    profileData.value.newPassword = ''
    profileData.value.confirmPassword = ''
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Ошибка смены пароля'
  } finally {
    isLoading.value = false
  }
}

function logout() {
  isLoading.value = true
  try {
    useAuthStore().deleteAllCookies()
    useAuthStore().isOpenSignInComponent = false
    useAuthStore().isAuthorized = false
    useAuthStore().isProfileOpen = false
    useAuthStore().isModeration = false
    useAuthStore().userInfo = ref({})
    useAuthStore().reloadPage()
  } catch (error) {
    console.log(error)
    errorMessage.value = 'Ошибка при выходе'
  } finally {
    isLoading.value = false
  }
}

async function changeUsernameButton(isEditing) {
  if(!isEditing) {
    const response = await instance.post('/auth/local', {
      identifier: useAuthStore().userInfo.username,
      password: useAuthStore().userInfo.password
    })

    instance.post(`/users${useAuthStore().userInfo.id}`)
    .then(res => {
      console.log('updates:', res.data);
    })
    .catch(error => {
      console.log(error.res)
    })
  }

}
</script>

<template>
  <div v-if="useAuthStore().isProfileOpen" class="profile-container">
    <div class="profile-form">
      <div class="profile-header">
        <div class="profile-header-username">
            <h1>{{ Cookies.get('username') }}</h1>
            <div class="user-status-medals">
              <img v-if="useAuthStore().userInfo.isVerified" class="verified" src="../images/verified.png" alt="">
              <img v-if="useAuthStore().userInfo.isModerator" class="verified" src="../images/moderator.png?url" alt="">
            </div>
        </div>
        <img 
          @click="useAuthStore().isProfileOpen = false" 
          class="close-button" 
          src="../images/close-button.png"
          alt="Закрыть"
        >
      </div>

      <div v-if="Cookies.get('username') === ''" class="not-authorized">
        <p>Для просмотра профиля необходимо авторизоваться</p>
        <button 
          @click="authStore.isOpenSignInComponent = true" 
          class="auth-button"
        >
          Войти
        </button>
      </div>

      <div v-else class="profile-content">
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="user-info">

            <div class="info-group">
            <label>Логин:</label>
            <div class="input-button">
                <input
                v-if="isEditing.username"
                v-model="useAuthStore().userInfo.username"
                type="text"
                class="auth-input"
                :disabled="isLoading"
                >
            <span v-else class="info-value">{{useAuthStore().userInfo.username}}</span>
            
                <!-- <button @click="isEditing.username=!isEditing.username, changeUsernameButton(isEditing.username)" class="secondary" :disabled="isLoading">
                    <img v-if="!isEditing.username" class="edit-button" src="../images/editPencil.png" alt="">
                    <img v-else class="edit-button" src="../images/Done.png" alt="">
                </button> -->
            </div>
          </div>

          <div class="info-group">
            <label>Почта:</label>
            <div class="input-button">
            <input
              v-if="isEditing.email"
              v-model="useAuthStore().userInfo.email"
              type="text"
              class="auth-input"
              :disabled="isLoading"
            >
            <span v-else class="info-value">{{useAuthStore().userInfo.email}}</span>
                <!-- <button @click="isEditing.email=!isEditing.email" class="secondary" :disabled="isLoading">
                    <img v-if="!isEditing.email" class="edit-button" src="../images/editPencil.png" alt="">
                    <img v-else class="edit-button" src="../images/Done.png" alt="">
                </button> -->
            </div>
          </div>

            <div class="info-group">
            <label>Телеграм:</label>
            <div class="input-button">
            <input
              v-if="isEditing.telegram"
              v-model="useAuthStore().userInfo.telegram"
              type="text"
              class="auth-input"
              :disabled="isLoading"
            >
            <span v-else class="info-value">{{useAuthStore().userInfo.telegram}}</span>
                <!-- <button @click="isEditing.telegram=!isEditing.telegram" class="secondary" :disabled="isLoading">
                    <img v-if="!isEditing.telegram" class="edit-button" src="../images/editPencil.png" alt="">
                    <img v-else class="edit-button" src="../images/Done.png" alt="">
                </button> -->
            </div>
          </div>
          
          <div class="info-group">
            <label>На сайте с:</label>
            <span class="info-value">{{useAuthStore().userInfo.createdAt}}</span>
          </div>
        </div>

        <!-- <div class="password-section">
          <h3>Смена пароля</h3>
          <div class="form-group">
            <input
              v-model="profileData.currentPassword"
                type="password"
                placeholder="Текущий пароль"
                class="auth-input"
                :disabled="isLoading"
            >
            <input
                v-model="profileData.newPassword"
                type="password"
                placeholder="Новый пароль"
                class="auth-input"
                :disabled="isLoading"
            >
            <input
                v-model="profileData.confirmPassword"
                type="password"
                placeholder="Подтвердите новый пароль"
                class="auth-input"
                :disabled="isLoading"
            >
            <button 
                @click="changePassword" 
                class="auth-button"
                :disabled="isLoading"
                :class="{ loading: isLoading }"
            >
            Сменить пароль
          </button>
          </div>
        </div> -->
                    <button 
                @click="logout" 
                class="auth-button logout"
                :disabled="isLoading"
            >
            Выйти
            </button>
      </div>
    </div>
  </div>
  
</template>

<style scoped>

.profile-header-username {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}
.verified {
    height: 40px;
}
.edit-button, .done-button {
    height: 25px;
}
.input-button {
    display: flex;
    gap: 15px;
}
.auth-input {
    width: 100%;
    height: 40px;
    color: white;
    font-size: 18px;
    display: block;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
}
.form-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.close-button {
  height: 25px;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.95);
  }
}

.profile-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: transparent;
  backdrop-filter: blur(20px);
  position: fixed;
  z-index: 3;
  width: 100%;
}

.profile-form {
  position: relative;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background-color: #151515d2;
  max-height: 90vh;
  overflow-y: auto;
  top: -50px;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.profile-header h1 {
  color: white;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.not-authorized {
  text-align: center;
  color: white;
}

.not-authorized p {
  margin-bottom: 20px;
}

.user-info {
  margin-bottom: 25px;
}

.info-group {
  margin-bottom: 15px;
}

.info-group label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 5px;
  font-size: 14px;
}

.info-value {
    width: 100%;
    color: #8a8a8a;
    font-size: 18px;
    display: block;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    height: 40px;
}

.profile-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.password-section,
.danger-zone {
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}

.password-section h3,
.danger-zone h3 {
  color: white;
  margin-bottom: 15px;
  font-size: 18px;
}

.success-message {
  color: #4CAF50;
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.error-message {
  color: #FF695B;
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.auth-button {
  padding: 12px 20px;
  background: #6441a1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  min-width: 120px;
}

.auth-button:hover:not(:disabled) {
  background: #7d5bbe;
  transform: translateY(-2px);
}

.auth-button:active:not(:disabled) {
  transform: translateY(0);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-button.loading {
  background: #4a2d7d;
}

.secondary {
  background: rgba(255, 255, 255, 0.2);
  width: 40px;
  height: 40px;
}

.auth-button.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.auth-button.logout {
    margin-top: 15px;
  background: #ff4757;
  width: 100%;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-form {
  animation: fadeIn 0.5s ease;
}

@media (max-width: 480px) {
  .profile-form {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .profile-header h1 {
    font-size: 24px;
  }
  
  .profile-actions {
    flex-direction: column;
  }
  
  .auth-button {
    width: 100%;
  }
}
</style>