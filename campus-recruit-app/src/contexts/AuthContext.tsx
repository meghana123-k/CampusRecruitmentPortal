import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, UserLogin, UserRegistration, UserProfile, ChangePassword, AuthContextType } from '../types';
import apiService from '../services/api';

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          // Verify token by fetching user profile
          const user = await apiService.getProfile();
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token },
          });
        } catch (error) {
          // Token is invalid, clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'AUTH_FAILURE' });
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: UserLogin): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await apiService.login(credentials);
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  // Register function
  const register = async (userData: UserRegistration): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await apiService.register(userData);
      
      // Store token and user data in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    apiService.removeAuthToken();
    dispatch({ type: 'LOGOUT' });
  };

  // Update profile function
  const updateProfile = async (profile: UserProfile): Promise<void> => {
    try {
      const updatedUser = await apiService.updateProfile(profile);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      throw error;
    }
  };

  // Change password function
  const changePassword = async (passwords: ChangePassword): Promise<void> => {
    try {
      await apiService.changePassword(passwords);
    } catch (error) {
      throw error;
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user: state.user,
    token: state.token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
