import axios from 'axios';
import { REACT_APP_LOCALHOST_URL } from './Common';

const UNAUTHORIZED_INSTANCES = [400, 401, 500];

const instance = axios.create({
  baseURL: `${REACT_APP_LOCALHOST_URL}/api/v1`,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true, // Include credentials (cookies)
});

// Add a request interceptor to set the Authorization2 header
instance.interceptors.request.use((config) => {
  const authToken = localStorage.getItem('access');
  if (authToken) {
    config.headers['Authorization2'] = authToken;
  }
  return config;
});

// catch any unauthorized request
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (UNAUTHORIZED_INSTANCES.includes(error?.response?.status)) {
      localStorage.removeItem('userID');
      window.history.replaceState({}, '');
      window.location = '/';
    }
  }
);

export default instance;
