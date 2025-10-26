import axios from 'axios'
import { ref } from 'vue'
import { instance } from '../axios/instance.js'
import {API} from '../../services/api'
import Cookies from 'js-cookie'
import { toast } from 'vue3-hot-toast'
import { useAuthStore } from '@/stores/auth.js'

const is_checked_status = ref(false)
const video_id = ref(20)
const videoList = ref([])
const addVideoComponentIsVisible = ref(false)
const videoStatuses = [{
    0: 'На модерации',
    1: 'Принято',
    2: 'Отклонено'
  }
]

export const addVideoComponentIsVisibleFunction = (bool) => {
  addVideoComponentIsVisible.value = bool
  return addVideoComponentIsVisible.value
}

export const getUsers = async () => {
  try {
    const response = await instance.get('/users')
    console.log(...response.data.data)
    videoList.value = {...response.data.data}
    return videoList
  } catch (error) {
    console.error(error)
  }
}

function getYouTubeVideoId(url) {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

export const addVideo = async (link, comment_text) => {
  try {
    const authStore = useAuthStore();

    const send_date_res = new Date().toISOString().split('T')[0];

    const getTitle = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${link.split('=')[1]}&key=AIzaSyAd_rFuqgRiTnoUv0SzJfgVGdOauNwHYAw`
    );

    const response = await instance.post(
      '/videos',
      {
        data: {
          url: link,
          url_id: getYouTubeVideoId(link),
          title: getTitle.data.items[0].snippet.title,
          sender: Cookies.get('username'),
          comment: comment_text,
          agreement_status: '0',
          is_checked: false,
          send_date: send_date_res,
          author: getTitle.data.items[0].snippet.channelTitle,
          like_count: 0
        }
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      }
    )

    console.log(response.data);
    toast.success(`Видео отправлено на модерацию`);
    
    if (authStore.reloadPage) {
      authStore.reloadPage();
    }
    
    return response.data;
  } catch (error) {
    console.error('Error adding video:', error);
    
    if (error.response?.status === 401) {
      toast.error('Ошибка авторизации. Пожалуйста, войдите снова.');
      authStore.logout();
    } else {
      toast.error('Ошибка при отправке видео: ' + (error.response?.data?.error?.message || error.message));
    }
    
    throw error;
  }
}

export const addVideoWithAuth = async (link, comment_text) => {
  try {
    const authStore = useAuthStore();
    
    const token = await getJWTToken();
    
    if (!token) {
      toast.error('Не удалось получить токен авторизации');
      throw new Error('No JWT token available');
    }

    const send_date_res = new Date().toISOString().split('T')[0];

    const getTitle = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${link.split('=')[1]}&key=AIzaSyAd_rFuqgRiTnoUv0SzJfgVGdOauNwHYAw`
    );

    const response = await instance.post('/videos', {
      data: {
        url: link,
        url_id: link.split('=')[1],
        title: getTitle.data.items[0].snippet.title,
        sender: Cookies.get('username'),
        comment: comment_text,
        agreement_status: '0',
        is_checked: false,
        send_date: send_date_res,
        author: getTitle.data.items[0].snippet.channelTitle,
        like_count: 0
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data);
    toast.success(`Видео отправлено на модерацию`);
    
    if (authStore.reloadPage) {
      authStore.reloadPage();
    }
    
    return response.data;
  } catch (error) {
    console.error('Error adding video:', error);
    toast.error('Ошибка при отправке видео');
    throw error;
  }
}

export const getJWTToken = async () => {
  try {
    const username = Cookies.get('username');

    const response = await instance.post('/auth/local', {
      identifier: useAuthStore().userInfo.username,
      password
    });

    const { jwt } = response.data;
    
    const authStore = useAuthStore();
    authStore.userInfo.jwt = jwt;
    
    return jwt;
  } catch (error) {
    console.error('Error getting JWT token:', error);
    return null;
  }
}

export const addNewUser = async ({username, email, password}) => {
  const response = await instance.post('/auth/local/register', {
    username: username,
    email: email,
    password: password,
    comfconfirmed: false,
    blocked: false
  })
}

export const changeIsChecked = async (id, status) => {
  const response = await instance.put(`/videos/${id}`, {
    data: {
      is_checked: !status
    },
    headers: {
      'Content-Type': 'application/json',
    }
  })
  console.log(response.data)
  await API.videos.refreshVideosModule();
  return response.data
}

export const getCookie = (name) => {
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

export const checkVideoExists = async (link) => {
  const response = await instance.get(`/videos/`)
  if (response.data.includes(link)){
    return true
  }
}