import apiClient from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export const authService = {
    login: async (email, password) => {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
        const data = response.data.data || response.data;
        
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
        }
        return data;
    },

    register: async (companyData) => {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, companyData);
        return response.data.data || response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    getProfile: async () => {
        const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
        return response.data.data || response.data;
    }
};

export default authService;
