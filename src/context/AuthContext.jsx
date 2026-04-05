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
  const [user, setUser] = useState(DEMO_USER);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [authError, setAuthError] = useState('');

  const login = async (email, password) => {
    setAuthError('');
    try {
      // Try real API first
      const response = await apiLogin(email, password);

      // Outdoorsy returns: { first_name, last_name, user_id, token, ... }
      setUser({
        id: response.user_id || response.id,
        email: response.email || email,
        firstName: response.first_name || email.split('@')[0],
        lastName: response.last_name || '',
        avatar: response.avatar || '',
        phone: response.phone || '',
        joined: 'April 2026',
        verified: !response.show_verify_email_screen,
        mode: 'guest',
        token: response.token,
      });
      setShowAuth(false);
      return true;
    } catch (err) {
      console.log('API login failed, using demo login:', err.message);

      // Fallback to demo login for the PoC
      setUser({
        ...DEMO_USER,
        email,
        firstName: email.split('@')[0],
      });
      setShowAuth(false);
      return true;
    }
  };

  const signup = async (data) => {
    setAuthError('');
    try {
      // Try real API
      const response = await apiSignup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      setUser({
        id: response.user_id || response.id,
        email: data.email,
        firstName: response.first_name || data.firstName,
        lastName: response.last_name || data.lastName,
        avatar: '',
        phone: '',
        joined: 'April 2026',
        verified: false,
        mode: 'guest',
        token: response.token,
      });
      setShowAuth(false);
      return true;
    } catch (err) {
      console.log('API signup failed, using demo signup:', err.message);

      // Fallback to demo
      setUser({
        ...DEMO_USER,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: '',
      });
      setShowAuth(false);
      return true;
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
