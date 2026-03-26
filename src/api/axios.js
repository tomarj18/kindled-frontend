import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://kindled-backend.onrender.com/api',
});

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default instance;