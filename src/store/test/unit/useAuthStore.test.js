import { describe, it, expect, vi, beforeEach } from 'vitest';
import useAuthStore from '../../useAuthStore';
import * as authService from '../../../utils/authService';

// Mock the authService
vi.mock('../../../utils/authService', () => ({
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
}));

describe('useAuthStore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        useAuthStore.setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
    });

    it('initializes with default state', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isLoading).toBe(false);
    });

    it('updates state on successful login', async () => {
        const mockUser = { id: 1, email: 'test@mail.com', firstName: 'Test' };
        const mockResponse = { access_token: 'valid-token', user: mockUser };
        authService.login.mockResolvedValue(mockResponse);

        await useAuthStore.getState().login('test@mail.com', 'password');

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.token).toBe('valid-token');
        expect(state.user.email).toBe('test@mail.com');
        expect(localStorage.getItem('token')).toBe('valid-token');
    });

    it('handles login failure correctly', async () => {
        authService.login.mockRejectedValue(new Error('Login failed'));

        try {
            await useAuthStore.getState().login('test@mail.com', 'wrong');
        } catch (e) {
            // Expected
        }

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBe('Login failed');
    });

    it('resets state on logout', () => {
        // Manually set state to simulate logged in
        useAuthStore.setState({ isAuthenticated: true, token: 'some-token', user: { id: 1 } });

        useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.token).toBeNull();
        expect(state.user).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
    });
});
