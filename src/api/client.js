import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://difmo-crm-backend.vercel.app',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isLoginPage = window.location.pathname.includes('/login');
            const isLoginRequest = error.config.url.includes('/auth/login');

            if (!isLoginPage && !isLoginRequest) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Trigger logout event or redirect
                window.dispatchEvent(new Event('auth:logout'));
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
