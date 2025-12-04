import { create } from 'zustand';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile as apiGetProfile } from '../utils/authService';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const data = await apiLogin(email, password);
            set({
                user: data.user, // Assuming backend returns user info
                token: data.access_token,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Login failed',
                isLoading: false
            });
            throw error;
        }
    },

    register: async (companyData) => {
        set({ isLoading: true, error: null });
        try {
            await apiRegister(companyData);
            set({ isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Registration failed',
                isLoading: false
            });
            throw error;
        }
    },

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const user = await apiGetProfile();
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            // If profile fetch fails (e.g., 401), logout
            set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: 'Session expired' });
            localStorage.removeItem('token');
        }
    },

    logout: () => {
        apiLogout();
        set({ user: null, token: null, isAuthenticated: false });
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
