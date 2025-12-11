import { create } from 'zustand';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getProfile as apiGetProfile } from '../utils/authService';

// Sanitize user data to prevent circular references
const sanitizeUser = (user) => {
    if (!user) return null;

    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isActive: user.isActive,
        roles: user.roles ? user.roles.map(role => ({
            id: role.id,
            name: role.name,
            description: role.description
        })) : [],
        company: user.company ? {
            id: user.company.id,
            name: user.company.name,
            email: user.company.email
        } : null
    };
};

// Initialize state from localStorage
const getInitialState = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;

    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch (e) {
            console.error('Failed to parse user data from localStorage:', e);
            localStorage.removeItem('user');
        }
    }

    return {
        user,
        token,
        isAuthenticated: !!token,
    };
};

const useAuthStore = create((set) => ({
    ...getInitialState(),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            console.log('[useAuthStore] Calling apiLogin...');
            const data = await apiLogin(email, password);
            console.log('[useAuthStore] apiLogin returned:', data);
            const sanitizedUser = sanitizeUser(data.user) || { email };

            // Save token to localStorage (backup in case authService doesn't)
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                console.log('[useAuthStore] Token saved to localStorage:', data.access_token.substring(0, 20) + '...');
            } else {
                console.error('[useAuthStore] No access_token in data!', data);
                throw new Error('Login failed: No access token received');
            }

            // Save sanitized user data to localStorage
            localStorage.setItem('user', JSON.stringify(sanitizedUser));

            set({
                user: sanitizedUser,
                token: data.access_token,
                isAuthenticated: true,
                isLoading: false
            });
            console.log('[useAuthStore] Login successful, state updated');
        } catch (error) {
            console.error('[useAuthStore] Login error:', error);
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
            console.log('[Auth] Fetching user profile...');
            const userData = await apiGetProfile();
            console.log('[Auth] Profile fetched successfully:', userData);
            const sanitizedUser = sanitizeUser(userData);

            // Save sanitized user data to localStorage
            localStorage.setItem('user', JSON.stringify(sanitizedUser));

            set({ user: sanitizedUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
            console.error('[Auth] Failed to fetch profile:', error);
            console.error('[Auth] Error response:', error.response);
            console.error('[Auth] Error message:', error.message);

            // If profile fetch fails (e.g., 401), logout
            set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: 'Session expired' });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    logout: () => {
        apiLogout();
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
