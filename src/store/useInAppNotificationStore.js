import { create } from 'zustand';

/**
 * In-app notification store for real-time popups.
 * Notifications are displayed in the Header bell and as toast-style popups.
 */
const useInAppNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,

    // Add a new in-app notification (triggered by WebSocket, FCM foreground, or after sending)
    addNotification: (notif) => {
        const newItem = {
            id: Date.now().toString(),
            title: notif.title,
            message: notif.message,
            type: notif.type || 'info',
            read: false,
            timestamp: new Date(),
        };
        set((state) => ({
            notifications: [newItem, ...state.notifications].slice(0, 50),
            unreadCount: state.unreadCount + 1,
        }));

        // Auto-dismiss toast after 5 seconds by marking as read
        setTimeout(() => {
            get().markRead(newItem.id);
        }, 5000);
    },

    markRead: (id) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - (state.notifications.find((n) => n.id === id)?.read ? 0 : 1)),
        }));
    },

    markAllRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
        }));
    },

    clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

export default useInAppNotificationStore;
