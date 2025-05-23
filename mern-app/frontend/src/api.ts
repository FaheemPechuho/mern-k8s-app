import axios from 'axios';
import { Todo } from './types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(`${API_URL}/api/todos`);
  return response.data;
};

export const createTodo = async (text: string): Promise<Todo> => {
  const response = await axios.post(`${API_URL}/api/todos`, { text });
  return response.data;
};

export const updateTodo = async (id: string, completed: boolean): Promise<Todo> => {
  const response = await axios.put(`${API_URL}/api/todos/${id}`, { completed });
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/todos/${id}`);
}; 