import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/clients';

export const useClientStore = create((set) => ({
  clients: [],
  isLoading: false,

  fetchClients: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(API_URL);
      
      console.log("1. Full Axios Response:", response);
      console.log("2. response.data contents:", response.data);

      // TRIPLE WRAP CHECK (Based on your console log)
      // Structure: response.data -> .data -> .data (Array)
      let finalArray = [];
      
      if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
        finalArray = response.data.data.data; // Triple wrap case
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        finalArray = response.data.data; // Double wrap case
      } else if (Array.isArray(response.data)) {
        finalArray = response.data; // Direct array case
      }

      console.log("3. Final Extracted Array for UI:", finalArray);

      set({ 
        clients: finalArray, 
        isLoading: false 
      });
    } catch (error) {
      console.error("Fetch Error:", error);
      set({ clients: [], isLoading: false });
    }
  },

  addClient: async (clientData) => {
    try {
      const response = await axios.post(API_URL, clientData);
      // Add client logic also needs to handle wrapping
      const newClient = response.data?.data?.data || response.data?.data || response.data;
      
      set((state) => ({ 
        clients: [newClient, ...state.clients]
      }));
      return true;
    } catch (error) {
      throw error;
    }
  },

 // useClientStore.js mein check karo
processInvoice: async (clientId, finalData) => {
  try {
    const token = localStorage.getItem('token');
    // URL dhyan se dekho: BASE_URL + /api/clients/ + ID + /send-invoice
    const res = await axios.post(`http://localhost:3000/api/clients/${clientId}/send-invoice`, finalData,
      {
        headers: {
          Authorization: `Bearer ${token}` // 👈 Pass the token here
        }
      }
    );
    return res.data;
  } catch (err) {
    console.error("API Error Details:", err.response); // Ye check karo terminal/browser console mein
    throw err;
  }
}
}));