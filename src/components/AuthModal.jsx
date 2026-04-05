import { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { startGoogleLogin } from '../services/api';

export default function AuthModal() {
  const { showAuth, authTab, setAuthTab, closeAuth, login, signup, authError, loginWithToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showAuth) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (!success && authError) setError(authError);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !firstName || !lastName) { setError('Please fill in all fields'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    const success = await signup({ email, password, firstName, lastName });
    setLoading(false);
    if (!success && authError) setError(authError);
  };

  const switchTab = (tab) => { setAuthTab(tab); setError(''); };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const result = await startGoogleLogin();
      if (result?.token) {
        loginWithToken(result.token);
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    }
    setGoogleLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={closeAuth} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      }} />

      <div style={{
        position: 'relative', background: 'var(--surface)',
        borderRadius: 'var(--r-xl)', border: '1px solid var(--border-light)',
        width: '100%', maxWidth: 400, maxHeight: '90vh', overflow: 'auto',
        padding: 28, boxShadow: '0 24px 48px rgba(0,0,0,0.5)', margin: 16,
      }}>
        <button onClick={closeAuth} style={{
          position: 'absolute', top: 16, right: 16,
          width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><X size={16} /></button>

        <div style={{
          textAlign: 'center', marginBottom: 24,
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, letterSpacing: '0.06em',
        }}>
          <span className="text-gold">RIDE</span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'var(--surface-2)', borderRadius: 'var(--r-pill)', padding: 3, marginBottom: 24,
        }}>
          {['login', 'signup'].map(tab => (
            <button key={tab} onClick={() => switchTab(tab)} style={{
              flex: 1, padding: '10px 0', borderRadius: 'var(--r-pill)',
              background: authTab === tab ? 'var(--surface-3)' : 'transparent',
              fontWeight: authTab === tab ? 600 : 400, fontSize: 14,
              color: authTab === tab ? 'var(--text)' : 'var(--text-tertiary)',
              transition: 'all 0.15s',
            }}>
              {tab === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'var(--error-bg)', color: 'var(--error)',
            padding: '10px 14px', borderRadius: 'var(--r-sm)', fontSize: 13, marginBottom: 16,
          }}>{error}</div>
        )}

        {authTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6, display: 'block', fontWeight: 500, letterSpacing: '0.04em' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="ios-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6, display: 'block', fontWeight: 500, letterSpacing: '0.04em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="ios-input" type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 40, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', padding: 4 }}>
                  {showPassword ? <EyeOff size={16} color="var(--text-tertiary)" /> : <Eye size={16} color="var(--text-tertiary)" />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            {/* Or divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--border-light)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>or</span>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--border-light)' }} />
            </div>

            {/* Google sign-in */}
            <button type="button" onClick={handleGoogleLogin} disabled={googleLoading} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 24px', borderRadius: 'var(--r-md)',
              background: 'var(--surface-2)', border: '1px solid var(--border-light)',
              fontSize: 15, fontWeight: 500, color: 'var(--text)',
              transition: 'all 0.15s',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
              No account?{' '}
              <button type="button" onClick={() => switchTab('signup')} style={{ fontWeight: 600, textDecoration: 'underline', color: 'var(--accent)' }}>Sign up</button>
            </p>
          </form>
        )}

        {authTab === 'signup' && (
          <form onSubmit={handleSignup}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6, display: 'block', fontWeight: 500 }}>First name</label>
                <input className="ios-input" placeholder="Alex" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6, display: 'block', fontWeight: 500 }}>Last name</label>
                <input className="ios-input" placeholder="Rivera" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6, display: 'block', fontWeight: 500 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="ios-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 40 }} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6, display: 'block', fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="ios-input" type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 40, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', padding: 4 }}>
                  {showPassword ? <EyeOff size={16} color="var(--text-tertiary)" /> : <Eye size={16} color="var(--text-tertiary)" />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            {/* Or divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--border-light)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>or</span>
              <div style={{ flex: 1, height: '0.5px', background: 'var(--border-light)' }} />
            </div>

            {/* Google sign-in */}
            <button type="button" onClick={handleGoogleLogin} disabled={googleLoading} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '14px 24px', borderRadius: 'var(--r-md)',
              background: 'var(--surface-2)', border: '1px solid var(--border-light)',
              fontSize: 15, fontWeight: 500, color: 'var(--text)',
              transition: 'all 0.15s',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 12, fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
