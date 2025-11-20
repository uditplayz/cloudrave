import axios from 'axios';
import { User } from '../types';

const API_URL = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:5000';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<string> => {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/api/auth/register`,
      data
    );
    return response.data.token;
  },

  login: async (data: LoginData): Promise<string> => {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/api/auth/login`,
      data
    );
    return response.data.token;
  }
};
