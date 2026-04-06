import { create } from 'zustand';
import { io } from 'socket.io-client';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  socket: null,

  // Initialize connection
  connect: () => {
    // Prevent multiple connections
    if (get().socket?.connected) return;

    const socket = io('http://localhost:3000'); 

    socket.on('notification', (data) => {
      set((state) => ({ 
        notifications: [data, ...state.notifications] 
      }));
    });

    set({ socket });
  },

  // Helper to clear notifications
  clearNotifications: () => set({ notifications: [] }),
  
  // Helper to remove a single notification by index
  removeNotification: (index) => set((state) => ({
    notifications: state.notifications.filter((_, i) => i !== index)
  }))
}));