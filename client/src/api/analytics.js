import axios from 'axios';

const API_URL = 'http://localhost:5001/analytics';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const getAnalyticsSummary = async () => {
  const response = await axios.get(`${API_URL}/summary`, { headers: getAuthHeader() });
  return response.data;
};

export const getMonthlyTrends = async () => {
  const response = await axios.get(`${API_URL}/monthly-trends`, { headers: getAuthHeader() });
  return response.data;
};

export const getCategoryBreakdown = async () => {
  const response = await axios.get(`${API_URL}/category-breakdown`, { headers: getAuthHeader() });
  return response.data;
};

export const getDailySpending = async () => {
  const response = await axios.get(`${API_URL}/daily-spending`, { headers: getAuthHeader() });
  return response.data;
};
