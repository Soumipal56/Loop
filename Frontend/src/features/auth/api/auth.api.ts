import axios from 'axios';

// Create an Axios instance with credentials enabled so cookies (like JWT) are sent automatically
export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  login: async (data: any) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  verifyOTP: async (data: any) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },
  resendOTP: async (data: any) => {
    const response = await apiClient.post('/auth/resend-otp', data);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};
