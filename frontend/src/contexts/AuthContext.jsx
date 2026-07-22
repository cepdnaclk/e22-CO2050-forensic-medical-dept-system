// src/contexts/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { mockLogin, mockLogout, decodeMockToken } from '../data/mockAuth';
import { ROLES } from '../data/mockData';

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
      const decoded = decodeMockToken(token);
      if (decoded) {
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: {
            token,
            user: {
              id: decoded.sub,
              username: decoded.username,
              fullName: decoded.fullName,
              role: decoded.role,
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
      const result = await mockLogin(username, password, mfaCode);
      localStorage.setItem('fmdis_token', result.token);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: result });
      return result;
    } catch (err) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: err.message });
      throw err;
    }
  };

  const logout = async () => {
    await mockLogout();
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
