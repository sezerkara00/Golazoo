import axios, { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

const api = axios.create({
  baseURL: 'https://www.sofascore.com/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    const headers = new AxiosHeaders(config.headers);
    
    headers.set('Authorization', `Bearer ${token}`);
    
    config.headers = headers;
  }
  return config;
});

export { api }; 