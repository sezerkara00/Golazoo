import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.sofascore.com/api/v1'
});

export { api }; 