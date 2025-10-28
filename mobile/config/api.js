import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your ngrok URL when testing locally
// Or use your production API when deploying
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:5001/api' // Android emulator localhost
  : 'https://api.myshagun.us/api'; // Production

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
