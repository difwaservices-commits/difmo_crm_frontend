import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
};

export const register = async (companyData) => {
    const response = await api.post('/auth/register', companyData);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    return response.data;
};
