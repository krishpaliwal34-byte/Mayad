const API_URL = 'http://localhost:5000/api/auth';

// ============================================================
// TYPES
// ============================================================

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  rememberMe: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// ============================================================
// AUTH SERVICE
// ============================================================

export const authService = {

  // ==========================================================
  // SIGNUP
  // ==========================================================

  signup: async (
    data: SignupPayload
  ): Promise<AuthResponse> => {

    console.log('🚀 Sending Signup Request:', data);

    try {
      const response = await fetch(
        `${API_URL}/signup`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          credentials: 'include',

          body: JSON.stringify(data),
        }
      );

      console.log(
        '📡 Signup Response Status:',
        response.status
      );

      const result = await response.json();

      console.log(
        '📦 Signup Response:',
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.message || 'Signup failed'
        );
      }

      return result;

    } catch (error) {

      console.error(
        '❌ Signup API Error:',
        error
      );

      throw error;
    }
  },

  // ==========================================================
  // LOGIN
  // ==========================================================

  login: async (
    data: LoginPayload
  ): Promise<AuthResponse> => {

    console.log('🚀 Sending Login Request:', data);

    try {
      const response = await fetch(
        `${API_URL}/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          credentials: 'include',

          body: JSON.stringify(data),
        }
      );

      console.log(
        '📡 Login Response Status:',
        response.status
      );

      const result = await response.json();

      console.log(
        '📦 Login Response:',
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.message || 'Login failed'
        );
      }

      return result;

    } catch (error) {

      console.error(
        '❌ Login API Error:',
        error
      );

      throw error;
    }
  },
};