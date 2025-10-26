import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { instance } from '../../services/axios/instance'

const APIKEY = 'AIzaSyAkAVqh68vBS5M9gDkOGfvZCgc730jpynE'
const ideasCategoryFilter = ref('Все')
const ideasStatusFilter = ref('0')
const newVideoCount = ref('')
const newIdeaCount = ref('')
const agreementIdea = ref('')
const isChatOpen = ref(false)
const isModeration = ref(false)
const isSignIn = ref(false)
const isOpenCloseAddVideoModule = ref(false)
const sortCategory = ref('Все')
const sortIsChecked = ref('')
const sortAccepted = ref('')
const sortInput = ref('')
const videoList = ref([])
const ideaList = ref([])
const isListEmpty = ref(false)
const isOpenSignInComponent = ref(false)
const isDarkTheme = ref(true)
const isProfileOpen = ref(false)
const isAuthorized = ref(document.cookie.includes('username='))
const myFavorites = ref([])
const user = ref()
const pass = ref('')
const userInfo = ref({
  username: '',
  password: '',
  email: '',
  isModerator: false,
  isVerified: false,
  confirmed: true,
  blocked: false,
  telegram: '',
  phoneNumber: '',
  jwt: ''
})

const login = async (email, password) => {
  try {
    setLoading(true)
    clearError()

    if (!email || !password) {
      throw new Error('Email и пароль обязательны')
    }

    const response = await instance.post(
      '/auth/login',
      {
        email: email.trim().toLowerCase(),
        password: password
      },
      {
        timeout: 10000
      }
    )

    if (response.data.success && response.data.data) {
      const { user: userData, token: authToken } = response.data.data

      setUser(userData)
      setToken(authToken)

      return {
        success: true,
        user: userData,
        message: 'Вход выполнен успешно'
      }
    } else {
      throw new Error(response.data.message || 'Ошибка авторизации')
    }
  } catch (error) {
    console.error('Ошибка входа:', error)

    let errorMessage = 'Ошибка входа'

    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 400:
          errorMessage = 'Некорректные данные'
          break
        case 401:
          errorMessage = 'Неверный email или пароль'
          break
        case 403:
          errorMessage = 'Доступ запрещен'
          break
        case 404:
          errorMessage = 'Пользователь не найден'
          break
        case 422:
          errorMessage = 'Ошибка валидации'
          break
        case 500:
          errorMessage = 'Внутренняя ошибка сервера'
          break
        default:
          errorMessage = error.response.data?.message || `Ошибка ${status}`
      }
    } else if (error.request) {
      errorMessage = 'Нет ответа от сервера. Проверьте соединение'
    } else if (error.message) {
      errorMessage = error.message
    }

    setError(errorMessage)

    return {
      success: false,
      message: errorMessage,
      error: error
    }
  } finally {
    setLoading(false)
  }
}
async function addNewUser(usernames, emails, passwords) {
  try {
    const response = await instance.post('/auth/local/register', {
      username: usernames,
      email: emails,
      password: "testpass",
      isModerator: true
    })
    alert(passwords)

    if (response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: 'Пользователь успешно зарегистрирован'
      }
    }

    return {
      success: false,
      message: 'Ошибка при регистрации'
    }

  } catch (error) {
    console.error('Ошибка регистрации:', error)
    
    return {
      success: false,
      message: error.response?.data?.message || 'Ошибка сервера',
      error: error
    }
  }
}

async function getVideos() {
  try {
    videoList.value = ''
    const res = await instance.get('/videos?sort=title:asc')
    videoList.value = res.data.data
    console.log('datas updated')
    return videoList
  } catch (error) {
    console.error(error)
  }
}

  async function reloadPage() {
    try {
      const res = await instance.get(`/videos?filters[agreement_status]=1&sort=title:asc`)
      useAuthStore().videoList = res.data.data
      if (useAuthStore().videoList.length === 0) {
        useAuthStore().isListEmpty = true
      } else {
        useAuthStore().isListEmpty = false
      }
    } catch {}
  }

function deleteAllCookies() {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()

    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;'

    document.cookie =
      name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + document.domain + ';'
    document.cookie =
      name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + document.domain + ';'
  }

  console.log('Все куки были удалены')
  return true
}
export function parseYouTubeUrl(url) {
  if (typeof url !== 'string') return null

  try {
    const parsedUrl = new URL(url.trim())
    const hostname = parsedUrl.hostname.replace('www.', '')
    const pathname = parsedUrl.pathname

    let videoId = null

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (pathname === '/watch') {
        const params = new URLSearchParams(parsedUrl.search)
        videoId = params.get('v')
      } else if (pathname.startsWith('/embed/')) {
        videoId = pathname.split('/embed/')[1]
      } else if (pathname.startsWith('/v/')) {
        videoId = pathname.split('/v/')[1]
      } else if (pathname.startsWith('/shorts/')) {
        videoId = pathname.split('/shorts/')[1]
      }
    } else if (hostname === 'youtu.be') {
      videoId = pathname.slice(1)
    }

    if (videoId && /^[\w-]{11}$/.test(videoId)) {
      console.log(videoId)
      return videoId
    }

    return null
  } catch (err) {
    console.log(err)
    return null
  }
}
export const useAuthStore = defineStore('auth', () => {
  const signInOrUp = () => {
    isSignIn.value = !isSignIn.value
    return isSignIn.value
}



function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}
  return {
    isChatOpen,
    addNewUser,
    getCookie,
    isModeration,
    sortCategory,
    sortAccepted,
    getVideos,
    sortInput,
    sortIsChecked,
    isListEmpty,
    login,
    isOpenSignInComponent,
    isDarkTheme,
    isProfileOpen,
    deleteAllCookies,
    isAuthorized,
    userInfo,
    myFavorites,
    reloadPage,
    ideaList,
    videoList,
    parseYouTubeUrl,
    agreementIdea,
    newIdeaCount,
    newVideoCount,
    ideasStatusFilter,
    ideasCategoryFilter,
    user,
    pass
  }
})
