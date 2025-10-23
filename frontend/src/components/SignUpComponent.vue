<script setup>
import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import { useAuthStore } from '../stores/auth'
import { API } from '../../services/api'
import Cookies from 'js-cookie'

const authStore = useAuthStore()

const formData = ref({
  username: '',
  email: '',
  password: '',
  repeatPassword: ''
})

const rules = {
  username: { required, minLength: minLength(6) },
  email: { required, email },
  password: { required, minLength: minLength(8) },
  repeatPassword: { required }
}

const v$ = useVuelidate(rules, formData)

const submitForm = async () => {
  const isValid = await v$.value.$validate()
  
  if (!isValid || formData.value.repeatPassword != formData.value.password) {
    console.error('Ошибка валидации:', v$.value.$errors)
    return
  }

  try {
    await API.videos.addNewUser({
      username: formData.value.username,
      email: formData.value.email,
      password: formData.value.password
    })
    console.log(formData.value.username,formData.value.email,formData.value.password)
    alert('Регистрация успешна!')
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    alert('Ошибка при отправке данных')
  }
}
</script>

<template>
  <form class="main-window" @submit.prevent="submitForm">
    <div class="sign-up-window">
      <h1 class="window-title">Регистрация</h1>
      <hr>

      <div class="form-inputs">
        <input
          v-model="formData.username"
          class="form-input"
          :class="{ 'error-border': v$.username.$errors.length }"
          type="text"
          placeholder="Логин"
          @blur="v$.username.$touch()"
        >
        <span v-if="v$.username.$errors.length" class="error-message">
          Логин должен быть не менее 6 символов
        </span>

        <input
          v-model="formData.email"
          class="form-input"
          :class="{ 'error-border': v$.email.$errors.length }"
          type="email"
          placeholder="Почта"
          @blur="v$.email.$touch()"
        >
        <span v-if="v$.email.$errors.length" class="error-message">
          Введите корректный email
        </span>

        <input
          
          v-model="formData.password"
          class="form-input"
          :class="{ 'error-border': v$.password.$errors.length }"
          type="password"
          placeholder="Пароль"
          @blur="v$.password.$touch()"
        >
        <span v-if="v$.password.$errors.length" class="error-message">
          Пароль должен быть не менее 8 символов
        </span>

        <input
          v-model="formData.repeatPassword"
          class="form-input"
          :class="{ 'error-border': v$.repeatPassword.$errors.length }"
          type="password"
          placeholder="Повтор пароля"
          @blur="v$.repeatPassword.$touch()"
        >
        <span v-if="v$.repeatPassword.$errors.length" class="error-message">
          Пароли не совпадают
        </span>
      </div>

      <button type="submit" class="sign-up-button">Зарегистрироваться</button>
      
      <a 
        @click="authStore.isChatOpen = !authStore.isChatOpen" 
        class="sign-up-text"
      >
        Уже есть аккаунт?
      </a>
    </div>
  </form>
</template>

<style scoped>
@import '../assets/base.scss';

.main-window {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #15151525;
}

.sign-up-window {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  top: 120px;
  width: 550px;
  height: 600px;
  background: #151515;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  border: 2px solid #6F6F6F;
}

.window-title {
  font-family: 'Raleway-SemiBold', sans-serif;
  color: white;
  font-size: 28px;
  letter-spacing: 2px;
  text-align: center;
}

hr {
  border: 1px solid #6441a5;
  width: 80%;
  margin: 0 auto;
  border-radius: 5px;
}

.form-inputs {
  width: 400px;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-input {
  width: 80%;
  height: 30px;
  background: #151515;
  border: 2px solid #6F6F6F;
  border-radius: 5px;
  color: white;
  font-family: 'Raleway-SemiBold', sans-serif;
  font-size: 14px;
  padding: 20px 15px;
  margin-bottom: 10px;
  outline: none;

  &:focus {
    border: 2px solid #6441a5;
  }
}

.error-border {
  border: 2px solid #FF695B !important;
}

.error-message {
  color: #FF695B;
  font-size: 12px;
  margin-bottom: 15px;
  width: 80%;
  text-align: left;
}

.sign-up-button {
  width: 80%;
  padding: 15px;
  background: #6441a5;
  color: white;
  border: none;
  border-radius: 5px;
  font-family: 'Raleway-SemiBold', sans-serif;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #7a52d1;
  }
}

.sign-up-text {
  cursor: pointer;
  font-family: 'Raleway-SemiBold', sans-serif;
  color: #6441a5;
  font-size: 14px;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
}
</style>