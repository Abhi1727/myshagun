import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// Always use production URL for Expo Go on physical devices
const API_BASE_URL = 'https://myshagun.us/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout for slow tunnel connections
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add retry logic for failed requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    // Retry once on timeout
    if (error.code === 'ECONNABORTED' && !config._retry) {
      config._retry = true;
      console.log('Retrying request due to timeout...');
      return api(config);
    }
    
    return Promise.reject(error);
  }
);

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
