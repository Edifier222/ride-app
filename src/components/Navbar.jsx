import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, Menu, X, User, ChevronDown, LogOut, LayoutDashboard, Plus, Repeat } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, isHost, openLogin, openSignup, logout, toggleMode } = useAuth();
  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--white)',
      borderBottom: '1px solid var(--border-light)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 24,
        }}>
          <Car size={28} strokeWidth={2.5} />
          RIDE
        </Link>

        {/* Desktop nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }} className="desktop-nav">
          <Link to="/search" className={`btn btn-chip ${location.pathname === '/search' ? 'active' : ''}`}>
            Browse cars
          </Link>
          <Link to="/how-it-works" className={`btn btn-ghost ${location.pathname === '/how-it-works' ? 'active' : ''}`} style={{ fontSize: 14 }}>
            How it works
          </Link>

          <div style={{ width: 1, height: 24, background: 'var(--border-light)', margin: '0 4px' }} />

          {isLoggedIn ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              {/* Host/Guest mode toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  className="btn btn-chip"
                  onClick={toggleMode}
                  style={{
                    fontSize: 12, padding: '6px 12px', gap: 4,
                    background: isHost ? 'var(--black)' : 'var(--chip-gray)',
                    color: isHost ? 'var(--white)' : 'var(--black)',
                  }}
                >
                  <Repeat size={12} />
                  {isHost ? 'Host mode' : 'Guest mode'}
                </button>

                {/* Avatar dropdown */}
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px 4px 4px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-light)',
                    background: userMenuOpen ? 'var(--chip-gray)' : 'var(--white)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={user.avatar}
                    alt=""
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  border: '1px solid var(--border-light)',
                  minWidth: 220,
                  overflow: 'hidden',
                  zIndex: 200,
                }}>
                  {/* User info */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{user.firstName} {user.lastName}</div>
                    <div style={{ fontSize: 12, color: 'var(--body-gray)' }}>{user.email}</div>
                  </div>

                  {/* Guest items */}
                  <button onClick={() => { setUserMenuOpen(false); navigate('/dashboard'); }} style={{
                    width: '100%', textAlign: 'left', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 10, fontSize: 14,
                  }}>
                    <LayoutDashboard size={16} /> My trips
                  </button>

                  {/* Host items */}
                  <button onClick={() => { setUserMenuOpen(false); navigate('/host'); }} style={{
                    width: '100%', textAlign: 'left', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 10, fontSize: 14,
                  }}>
                    <Car size={16} /> Host dashboard
                  </button>

                  <button onClick={() => { setUserMenuOpen(false); navigate('/list-your-car'); }} style={{
                    width: '100%', textAlign: 'left', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 10, fontSize: 14,
                  }}>
                    <Plus size={16} /> List your car
                  </button>

                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />

                  <button onClick={() => { setUserMenuOpen(false); toggleMode(); }} style={{
                    width: '100%', textAlign: 'left', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--body-gray)',
                  }}>
                    <Repeat size={16} /> Switch to {isHost ? 'guest' : 'host'} mode
                  </button>

                  <button onClick={() => { setUserMenuOpen(false); logout(); navigate('/'); }} style={{
                    width: '100%', textAlign: 'left', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: 10, fontSize: 14,
                    color: '#e11d48', borderTop: '1px solid var(--border-light)',
                  }}>
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn btn-ghost" style={{ fontSize: 14 }} onClick={openLogin}>
                <User size={18} /> Log in
              </button>
              <button className="btn btn-primary btn-sm" onClick={openSignup}>
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-circle)',
            background: menuOpen ? 'var(--chip-gray)' : 'transparent',
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          padding: 'var(--space-4) var(--space-6)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <Link to="/search" className="btn btn-chip" onClick={() => setMenuOpen(false)}>Browse cars</Link>
          <Link to="/how-it-works" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>How it works</Link>
          {isLoggedIn ? (
            <>
              <hr className="divider" style={{ margin: '4px 0' }} />
              <button className="btn btn-chip" onClick={() => { setMenuOpen(false); navigate('/dashboard'); }}>My trips</button>
              <button className="btn btn-chip" onClick={() => { setMenuOpen(false); navigate('/host'); }}>Host dashboard</button>
              <button className="btn btn-chip" onClick={() => { setMenuOpen(false); navigate('/list-your-car'); }}>List your car</button>
              <button className="btn btn-ghost" style={{ color: '#e11d48' }} onClick={() => { setMenuOpen(false); logout(); navigate('/'); }}>Log out</button>
            </>
          ) : (
            <>
              <hr className="divider" style={{ margin: '4px 0' }} />
              <button className="btn btn-ghost" onClick={() => { setMenuOpen(false); openLogin(); }}>Log in</button>
              <button className="btn btn-primary" onClick={() => { setMenuOpen(false); openSignup(); }}>Sign up</button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
