// src/contexts/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/api';
// We are hardcoding the ROLES as mockData is being replaced.
const ROLES = {
  ADMIN: 'Admin',
  JMO: 'JMO',
  POLICE: 'Police',
  RECEPTIONIST: 'Receptionist'
};
// Removed mockAuth.js import
import { jwtDecode } from 'jwt-decode'; // need to install this or parse manually. I'll parse manually.

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

const AuthContext = createContext(null);

const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return { ...state, isLoading: true, error: null };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };
    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('fmdis_token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: {
            token,
            user: {
              id: decoded.sub,
              username: decoded.sub || decoded.username,
              fullName: decoded.fullName || 'User',
              role: decoded.role || 'Admin', // default to admin for now if role missing
            },
          },
        });
        return;
      }
    }
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const login = async (username, password, mfaCode) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const result = await authService.login(username, password);
      localStorage.setItem('fmdis_token', result.access_token);
      
      const decoded = parseJwt(result.access_token);
      const user = {
        username: decoded.sub,
        role: 'Admin' // Needs role from endpoint
      };
      
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: { user, token: result.access_token } });
      return result;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: err.message });
      throw err;
    }
  };

  const logout = async () => {

    localStorage.removeItem('fmdis_token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const hasRole = (requiredRoles) => {
    if (!state.user) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(state.user.role);
  };

  const requiresMFA = (role) => {
    return role === ROLES.ADMIN || role === ROLES.JMO;
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    hasRole,
    requiresMFA,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { ROLES };
export default AuthContext;
