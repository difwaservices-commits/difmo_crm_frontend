import api from './api';

export const login = async (email, password) => {
    console.log('[AuthService] Attempting login for:', email);
    try {
        const response = await api.post('/auth/login', { email, password });
        console.log('[AuthService] Login response:', JSON.stringify(response));
        // Backend returns {data: {access_token, user}}
        const data = response.data.data || response.data;
        console.log('[AuthService] Extracted data:', JSON.stringify(data));
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            console.log('[AuthService] Token saved to localStorage');
        } else {
            console.error('[AuthService] No access_token in response!');
        }
        return data;
    } catch (error) {
        console.error('[AuthService] Login error:', error);
        throw error;
    }
};

export const register = async (companyData) => {
    const response = await api.post('/auth/register', companyData);
    return response.data.data || response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getProfile = async () => {
    const response = await api.get('/auth/profile');
    // Backend might return {data: user} or just user
    return response.data.data || response.data;
};
