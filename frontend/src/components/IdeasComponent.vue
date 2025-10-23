<script setup>
import { API } from '../../services/api'
import { ref, onMounted } from 'vue'
import { instance } from '../../services/axios/instance'
import { useAuthStore } from '@/stores/auth'
import Cookies from 'js-cookie'

const authStore = useAuthStore()

const ideaForm = ref({
  title: '',
  description: '',
  category: '',
  telegramLink: ''
})

const categories = ref([
  'Новый функционал',
  'Улучшение дизайна', 
  'Исправление ошибок',
  'Оптимизация',
  'Другое'
])

const isSubmitting = ref(false)
const submitStatus = ref('')

onMounted(async () => {
  await loadIdeas()
})

async function loadIdeas() {
  try {
    const response = await instance.get(`/ideas?filters[sender]=${Cookies.get('username')}`)
    authStore.ideaList = response.data.data
    console.log('ideas loaded')

  } catch (error) {
    console.error('Ошибка загрузки идей:', error)
  }
}

async function submitIdea(event) {
  event.preventDefault()
  
  if (!ideaForm.value.title || !ideaForm.value.description) {
    submitStatus.value = 'Заполните обязательные поля'
    return
  }
  
  isSubmitting.value = true
  submitStatus.value = ''

  try {
    const response = await instance.post('/ideas', {
      data: {
        title: ideaForm.value.title,
        description: ideaForm.value.description,
        category: ideaForm.value.category,
        sender: authStore.userInfo?.username,
        agreement_status: 0,
        telegram_link: ideaForm.value.telegramLink,
        send_date: new Date().toISOString()
      }
    })

    if (response.data) {
      submitStatus.value = 'success'
      ideaForm.value = { title: '', description: '', category: '', telegramLink: ''}
      
      await loadIdeas()
      
      setTimeout(() => {
        submitStatus.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('Ошибка отправки идеи:', error)
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  ideaForm.value = { title: '', description: '', category: '', telegramLink: ''}
  submitStatus.value = ''
}
</script>

<template>
  <div class="ideas-container">
    <div class="idea-form-section">
      <h1 class="section-title">Предложить идею</h1>
      
      <form @submit="submitIdea" class="idea-form">
        <div class="form-group">
          <label for="idea-title">Заголовок идеи *</label>
          <input
            id="idea-title"
            v-model="ideaForm.title"
            type="text"
            placeholder="Краткое описание идеи"
            maxlength="100"
            required
          >
        </div>

        <div class="form-group">
          <label for="idea-description">Подробное описание *</label>
          <textarea
            id="idea-description"
            v-model="ideaForm.description"
            placeholder="Опишите вашу идею подробнее..."
            rows="5"
            maxlength="500"
            required
          ></textarea>
          <span class="char-count">{{ ideaForm.description.length }}/500</span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="idea-category">Категория</label>
            <select id="idea-category" v-model="ideaForm.category">
              <option value="">Выберите категорию</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="submitStatus" class="status-message" :class="submitStatus">
          <span v-if="submitStatus === 'success'">✅ Идея успешно отправлена!</span>
          <span v-else-if="submitStatus === 'error'">❌ Ошибка при отправке</span>
          <span v-else>{{ submitStatus }}</span>
        </div>

        <div class="form-actions">

        <div class="form-group">
          <label for="telegram-link-title">ТГ для связи</label>
          <input
            id="telegram-link-title"
            v-model="ideaForm.telegramLink"
            type="text"
            placeholder="@Username"
            maxlength="50"
            required
          >
        </div>

        <div class="clear-send-buttons">
          <button 
            type="button" 
            @click="resetForm" 
            class="cancel-btn"
            :disabled="isSubmitting"
          >
            Очистить
          </button>
          <button 
            type="submit"
            class="submit-btn"
            :disabled="isSubmitting || (ideaForm.telegramLink.length < 3 || ideaForm.telegramLink[0] != ('@'))"
          >
            {{ isSubmitting ? 'Отправка...' : 'Отправить идею' }}
          </button>
        </div>

        </div>
      </form>
    </div>
      <h1 class="section-title">Мои идеи</h1>
    <div class="ideas-list-section">

      
      <div v-if="authStore.ideaList && authStore.ideaList.length === 0" class="empty-state">
        <p>Вы еще не отправляли идеи</p>
      </div>

      <div v-else class="ideas-grid">
        <div 
          v-for="idea in authStore.ideaList" 
          :key="idea.id" 
          class="idea-card"
        >
          <div class="idea-header">
            <h3 class="idea-title">{{ idea.title }}</h3>
            <span class="idea-status" :class="idea.agreement_status">
              {{ idea.agreement_status === 0 ? 'На рассмотрении ⌛' : 
                 idea.agreement_status === 1 ? 'Принято ✅' : 'Отклонено ❌' }}
            </span>
          </div>

          <p class="idea-description">{{ idea.description }}</p>

          <div class="idea-meta">
            <span class="idea-category">{{ idea.category }}</span>
            <span class="idea-date">{{ new Date(idea.createdAt).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.ideas-list-section {
  height: 35vh;
  overflow-y: auto;
}
.clear-send-buttons {
    display: flex;
    gap: 15px;
}
.telegram-link {
    display: flex;
}

.ideas-container {
  overflow-y: none;
  padding: 20px;
  width: 40%;
  margin: 0 auto;
  height: 100vh;
}

.section-title {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 30px;
}

.idea-form {
  background: #15151560;
  padding: 1rem;
  border-radius: 15px;
  border: 1px solid #ffffff28;
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: white;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.form-row {
  display: grid;
  gap: 20px;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 25px;
  align-items: center;
  justify-content: space-between;
}

.submit-btn,
.cancel-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: #6441a5;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #7a52d1;
}

.cancel-btn {
  background: #6F6F6F;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background: #8F8F8F;
}

.submit-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-message {
  padding: 12px;
  border-radius: 8px;
  margin: 15px 0;
  text-align: center;
}

.status-message.success {
  background: #ACFF9E;
  color: #2d5016;
}

.status-message.error {
  background: #FF695B;
  color: #fff;
}

.ideas-grid {
  margin-right: 10px;
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.idea-card {
  background: #151515;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #ffffff27;
  transition: transform 0.3s ease;
  height: max-content;
  text-wrap: wrap;
}

.idea-card:hover {
  transform: translateY(-5px);
  border-color: #6441a5;
}

.idea-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.idea-title {
  color: white;
  font-size: 16px;
  margin: 0;
  flex: 1;
}

.idea-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 600;
}

.idea-status.pending {
  background: #FFD28F;
  color: #000;
}

.idea-status.approved {
  background: #ACFF9E;
  color: #000;
}

.idea-status.rejected {
  background: #FF695B;
  color: #fff;
}

.idea-description {
  color: #CCC;
  line-height: 1.5;
  margin-bottom: 15px;
}

.idea-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 12px;
  color: #888;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>