import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'https://www.sofascore.com/api/v1'
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api }; 