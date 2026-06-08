import axios from 'axios';

const API_URL = 'http://localhost:5001/budgets';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`
  };
};

export const getBudgets = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeader() });
  return response.data;
};

export const createBudget = async (budget) => {
  const response = await axios.post(API_URL, budget, { headers: getAuthHeader() });
  return response.data;
};

export const updateBudget = async (id, budget) => {
  const response = await axios.put(`${API_URL}/${id}`, budget, { headers: getAuthHeader() });
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return response.data;
};
