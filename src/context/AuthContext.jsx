import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Mock user data
const MOCK_USERS = {
  guest: {
    id: 'u1',
    email: 'demo@ride.com',
    firstName: 'Alex',
    lastName: 'Rivera',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    phone: '+1 (555) 123-4567',
    joined: 'January 2025',
    verified: true,
    mode: 'guest', // 'guest' or 'host'
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'u1',
    email: 'jeff@ride.com',
    firstName: 'Jeff',
    lastName: 'Cavins',
    avatar: '/jeff-cavins.jpg',
    phone: '+1 (555) 123-4567',
    joined: 'January 2025',
    verified: true,
    mode: 'guest',
  });
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'signup'

  const login = (email, password) => {
    // Mock login — always succeeds
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({ ...MOCK_USERS.guest, email });
        setShowAuth(false);
        resolve(true);
      }, 800);
    });
  };

  const signup = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({
          ...MOCK_USERS.guest,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        });
        setShowAuth(false);
        resolve(true);
      }, 800);
    });
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

  const openLogin = () => { setAuthTab('login'); setShowAuth(true); };
  const openSignup = () => { setAuthTab('signup'); setShowAuth(true); };
  const closeAuth = () => setShowAuth(false);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isHost: user?.mode === 'host',
      isGuest: user?.mode === 'guest' || !user,
      login,
      signup,
      logout,
      toggleMode,
      showAuth,
      authTab,
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
