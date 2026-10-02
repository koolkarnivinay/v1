import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { getToken } from '../utils/storage';

const api = axios.create({ baseURL: API_BASE_URL });

// Attach auth token to every request if available
api.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

export default api;
