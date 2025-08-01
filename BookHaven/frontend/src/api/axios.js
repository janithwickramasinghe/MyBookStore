import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/', // Replace with your backend URL
  withCredentials: true, // If you're using sessions/cookies
});

// Add a request interceptor to attach JWT token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
