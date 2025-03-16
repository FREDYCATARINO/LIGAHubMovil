import axios from 'axios';
import { API_URL_LOCAL } from '@env'; 

const api = axios.create({
  baseURL: API_URL_LOCAL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;