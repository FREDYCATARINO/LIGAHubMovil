import axios from 'axios';
import { API_URL_LOCAL } from '@env'; 

const api_multi = axios.create({
  baseURL: API_URL_LOCAL,
  timeout: 5000,
});

export default api_multi;