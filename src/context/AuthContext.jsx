import { createContext, useContext, useState } from 'react';
import { login as apiLogin, signup as apiSignup } from '../services/api';

const AuthContext = createContext();

// Default demo user (shown on first load)
const DEMO_USER = {
  id: 'u1',
  email: 'jeff@ride.com',
  firstName: 'Jeff',
  lastName: 'Cavins',
  avatar: '/jeff-cavins.jpg',
  phone: '+1 (555) 123-4567',
  joined: 'January 2025',
  verified: true,
  mode: 'guest',
  token: null, // no real token for demo user
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Start logged out — must sign up or log in
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [authError, setAuthError] = useState('');

  const login = async (email, password) => {
    setAuthError('');
    try {
      // Try real API
      console.log('[RIDE Auth] Attempting login:', email);
      const response = await apiLogin(email, password);
      console.log('[RIDE Auth] Login success, user_id:', response.user_id, 'has token:', !!response.token);

      setUser({
        id: response.user_id || response.id,
        email: response.email || email,
        firstName: response.first_name || email.split('@')[0],
        lastName: response.last_name || '',
        avatar: response.avatar || '',
        phone: response.phone || '',
        joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        verified: !response.show_verify_email_screen,
        mode: 'guest',
        token: response.token,
      });
      setShowAuth(false);
      return true;
    } catch (err) {
      console.error('[RIDE Auth] Login failed:', err.message);
      setAuthError(err.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const signup = async (data) => {
    setAuthError('');
    try {
      // Try real API
      console.log('[RIDE Auth] Attempting signup:', data.email);
      const response = await apiSignup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      console.log('[RIDE Auth] Signup success, user_id:', response.user_id, 'has token:', !!response.token);

      const now = new Date();
      setUser({
        id: response.user_id || response.id,
        email: data.email,
        firstName: response.first_name || data.firstName,
        lastName: response.last_name || data.lastName,
        avatar: '',
        phone: '',
        joined: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        verified: false,
        mode: 'guest',
        token: response.token,
      });
      setShowAuth(false);
      return true;
    } catch (err) {
      console.error('[RIDE Auth] API signup failed:', err.message);
      setAuthError(err.message || 'Signup failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const toggleMode = () => {
    if (user) {
      setUser(prev => ({
        ...prev,
        mode: prev.mode === 'guest' ? 'host' : 'guest',
      }));
    }
  };

  const openLogin = () => { setAuthTab('login'); setAuthError(''); setShowAuth(true); };
  const openSignup = () => { setAuthTab('signup'); setAuthError(''); setShowAuth(true); };
  const closeAuth = () => setShowAuth(false);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isHost: user?.mode === 'host',
      isGuest: user?.mode === 'guest' || !user,
      authToken: user?.token || null,
      login,
      signup,
      logout,
      toggleMode,
      showAuth,
      authTab,
      authError,
      setAuthTab,
      openLogin,
      openSignup,
      closeAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
