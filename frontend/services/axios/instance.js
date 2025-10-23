import axios from 'axios'
import Cookies from "js-cookie"

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL_API,
})

instance.interceptors.request.use((config) => {
    const token = Cookies.get('jwtToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})