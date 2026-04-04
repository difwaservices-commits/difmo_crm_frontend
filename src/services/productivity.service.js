import axios from "axios";
import apiClient from "api/client";
import { API_ENDPOINTS } from "api/endpoints";



const getAnalytics = async (params) => {
  const res = await apiClient.get(`${API_ENDPOINTS.PRODUCTIVITY_ANALYTICS}/productivity`, { params });
  return res.data;
};

export default {
  getAnalytics
};