import axios from 'axios'
import Cookies from "js-cookie"

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL_API,
})

instance.interceptors.response.use(
  (response) => response, // успешные ответы просто возвращаем
  (error) => {
    if (error.response && error.response.status === 401) {
     
      Cookies.remove("jwtToken");

    }
    return Promise.reject(error);
  }
);