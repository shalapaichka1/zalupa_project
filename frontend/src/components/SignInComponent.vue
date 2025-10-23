<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import SignUpComponent from './SignUpComponent.vue'
import { instance } from '../../services/axios/instance'
import Cookies from 'js-cookie'
import {toast} from 'vue3-hot-toast'

const authStore = useAuthStore()

const isLoginForm = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const loginData = ref({
  email: '',
  password: ''
})

const registerData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function validateEnglishOnly(value) {
  return /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(value)
}

function handleInput(event, field, formType) {
  const value = event.target.value
  
  if (!validateEnglishOnly(value)) {
    event.target.value = value.replace(/[^A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '')
    
    if (formType === 'login') {
      loginData.value[field] = event.target.value
    } else {
      registerData.value[field] = event.target.value
    }
    
    errorMessage.value = 'Разрешены только английские буквы, цифры и специальные символы'
    setTimeout(() => {
      errorMessage.value = ''
    }, 2000)
  } else {
    if (formType === 'login') {
      loginData.value[field] = value
    } else {
      registerData.value[field] = value
    }
  }
}

function validateEmailInput(event, formType) {
  const value = event.target.value
  const filteredValue = value.replace(/[^A-Za-z0-9@._-]/g, '')
  
  if (value !== filteredValue) {
    event.target.value = filteredValue
    errorMessage.value = 'Email может содержать только английские буквы, цифры, @, точку, дефис и подчеркивание'
    setTimeout(() => {
      errorMessage.value = ''
    }, 2000)
  }
  
  if (formType === 'login') {
    loginData.value.email = filteredValue
  } else {
    registerData.value.email = filteredValue
  }
}

async function handleLogin() {
  if (!loginData.value.email || !loginData.value.password) {
    errorMessage.value = 'Заполните все поля'
    return
  }

  if (!validateEnglishOnly(loginData.value.email.replace(/[@._-]/g, '')) || 
      !validateEnglishOnly(loginData.value.password)) {
    errorMessage.value = 'Разрешены только английские символы'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await instance
      .post('/auth/local', {
        identifier: loginData.value.email,
        password: loginData.value.password,
      })
      .then(response => {
        console.log('Well done!');
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
        console.log(response.data)

        Cookies.set('username', response.data.user.username)
        Cookies.set('isModeration', response.data.user.isModerator)
        Cookies.set("jwtToken", response.data.jwt)

        useAuthStore().userInfo = response.data.user
        useAuthStore().isOpenSignInComponent = false
        useAuthStore().isAuthorized = true
        useAuthStore().isModeration = useAuthStore().userInfo.isModerator
        toast.success(`Добро пожаловать, ${Cookies.get('username')}`)
      })
      .catch(error => {
        console.log('An error occurred:', error.response);

        const {status, data} = error.response

        switch(status){
          case(400):
            errorMessage.value = "Неверный логин или пароль"
        }
      });
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Ошибка авторизации'
  } finally {
    isLoading.value = false
  }
}

async function handleRegister() {
  if (!registerData.value.username || !registerData.value.email || 
      !registerData.value.password || !registerData.value.confirmPassword) {
    errorMessage.value = 'Заполните все поля'
    return
  }

  if (!validateEnglishOnly(registerData.value.username) || 
      !validateEnglishOnly(registerData.value.email.replace(/[@._-]/g, '')) ||
      !validateEnglishOnly(registerData.value.password)) {
    errorMessage.value = 'Разрешены только английские символы'
    return
  }

  if (registerData.value.password !== registerData.value.confirmPassword) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }

  if (registerData.value.password.length < 6) {
    errorMessage.value = 'Пароль должен содержать минимум 6 символов'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await instance
  .post('/auth/local/register', {
    username: registerData.value.username,
    email: registerData.value.email,
    password: registerData.value.password,
  })
  .then(response => {
    console.log('Well done!');
    console.log('User profile', response.data.user);
    console.log('User token', response.data.jwt);

    registerData.value.username = ''
    registerData.value.email = ''
    registerData.value.password = ''
    registerData.value.confirmPassword = ''

    toast.success(`Вы успешно зарегистрировались`)
  })
  .catch(error => {
    console.log('An error occurred:', error.response);
  });
    isLoginForm.value = true
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Ошибка регистрации'
  } finally {
    isLoading.value = false
  }
}

function toggleForm() {
  isLoginForm.value = !isLoginForm.value
  errorMessage.value = ''
}

</script>

<template>
  
  <div class="auth-container">

    <div class="auth-form">
                <div class="auth-header">
        <h1>{{ isLoginForm ? 'Вход' : 'Регистрация' }}</h1>
        <img @click="useAuthStore().isOpenSignInComponent = !useAuthStore().isOpenSignInComponent" class="close-button" src="../images/close-button.png" alt="">
      </div>
      <form @submit.prevent="isLoginForm ? handleLogin() : handleRegister()" class="auth-content">
        <div v-if="isLoginForm" class="form-group">
          <input
            v-model="loginData.email"
            placeholder="Почта или логин"
            class="auth-input"
            :disabled="isLoading"
            autocomplete="email"
            @input="(e) => validateEmailInput(e, 'login')"
          >
          <input
            v-model="loginData.password"
            type="password"
            placeholder="Пароль"
            class="auth-input"
            :disabled="isLoading"
            autocomplete="current-password"
            @input="(e) => handleInput(e, 'password', 'login')"
          >
        </div>

        <div v-else class="form-group">
          <input
            v-model="registerData.username"
            type="text"
            placeholder="Имя пользователя"
            class="auth-input"
            :disabled="isLoading"
            autocomplete="username"
            @input="(e) => handleInput(e, 'username', 'register')"
          >
          <input
            v-model="registerData.email"
            type="email"
            placeholder="Email"
            class="auth-input"
            :disabled="isLoading"
            autocomplete="email"
            @input="(e) => validateEmailInput(e, 'register')"
          >
          <input
            v-model="registerData.password"
            type="password"
            placeholder="Пароль"
            class="auth-input"
            :disabled="isLoading"
            autocomplete="new-password"
            @input="(e) => handleInput(e, 'password', 'register')"
          >
          <input
            v-model="registerData.confirmPassword"
            type="password"
            placeholder="Подтвердите пароль"
            class="auth-input"
            :disabled="isLoading"
            autocomplete="new-password"
            @input="(e) => handleInput(e, 'confirmPassword', 'register')"
          >
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="sucess-message">
          {{ successMessage }}
        </div>

        <button 
          type="submit" 
          class="auth-button"
          :disabled="isLoading"
          :class="{ loading: isLoading }"
        >
          <span v-if="!isLoading">{{ isLoginForm ? 'Войти' : 'Зарегистрироваться' }}</span>
          <span v-else>Загрузка...</span>
        </button>

        <div class="auth-footer">

            <button type="button" @click="toggleForm" class="auth-toggle">
              {{ isLoginForm ? 'Нет аккаунта?' : 'Есть аккаунт?' }}
            </button>

        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.close-button {
  height: 25px;
  cursor: pointer;
  &:hover{
    transform: scale(1.1);
  }

  &:active {
    transform: scale(.95);
  }
}
.auth-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: transparent;
    backdrop-filter: blur(10px);
    position: fixed;
    z-index: 3;
    width: 100%;
}

.auth-form {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background-color: #151515d2
}

.auth-header {
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.auth-header h1 {
  color: white;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.auth-input {
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 16px;
}

.auth-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.auth-input:focus {
  outline: none;
  border-color: #6441a1;
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.02);
}

.auth-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #FF695B;
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.success-message {
  color: #85ff58;
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.auth-button {
  width: 100%;
  padding: 15px;
  background: #6441a1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
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

.auth-footer {
  text-align: center;
}

.auth-footer p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 14px;
}

.auth-toggle {
  background: none;
  border: none;
  color: #6441a1;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  padding: 0;
  margin-left: 5px;
}

.auth-toggle:hover {
  color: #7d5bbe;
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

.auth-form {
  animation: fadeIn 0.5s ease;
}

@media (max-width: 480px) {
  .auth-form {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .auth-header h1 {
    font-size: 24px;
  }
}
</style>
