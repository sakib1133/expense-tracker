import axios from 'axios';

const API_URL = 'http://localhost:5001/expenses';

export const getExpenses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createExpense = async (expense) => {
  const response = await axios.post(API_URL, expense);
  return response.data;
};

export const updateExpense = async (id, expense) => {
  const response = await axios.put(`${API_URL}/${id}`, expense);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
