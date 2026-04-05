import { useAuth } from '../../context/AuthContext';
import { ChevronRight, CheckCircle, Car, Shield, CreditCard, Bell, CircleHelp, LogOut, Plus, Star, DollarSign, Repeat, FileText, Sun, Moon } from 'lucide-react';
import useIsDesktop from '../../hooks/useIsDesktop';
import { useTheme } from '../../hooks/useTheme';

export default function ProfileTab({ onListCar, onVerify, onNavigate }) {
  const { user, isLoggedIn, isHost, openLogin, openSignup, logout, toggleMode, authToken } = useAuth();
  const isDesktop = useIsDesktop();
  const { theme, toggleTheme, isDark } = useTheme();

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          <Car size={56} color="var(--tertiary-label)" />
        </div>
        <div className="text-title2" style={{ marginBottom: 6, textAlign: 'center' }}>Welcome to RIDE</div>
        <p style={{ fontSize: 15, color: 'var(--secondary-label)', textAlign: 'center', marginBottom: 24, maxWidth: 280 }}>
          Log in to manage your trips, favorites, and more.
        </p>
        <button className="btn-primary" style={{ maxWidth: 280 }} onClick={openLogin}>Log in</button>
        <button className="btn-secondary" style={{ maxWidth: 280, marginTop: 10 }} onClick={openSignup}>Create account</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%' }}>
      <div style={{
        padding: isDesktop ? '0' : '16px 16px 12px',
        background: isDesktop ? 'transparent' : 'var(--glass)',
        backdropFilter: isDesktop ? 'none' : 'blur(24px)',
      }}>
        {!isDesktop && <h1 className="text-large-title">Profile</h1>}
      </div>

      <div className={isDesktop ? 'desktop-profile-layout' : ''} style={isDesktop ? {} : { padding: '8px 16px' }}>
        {/* User card */}
        <div style={{
          background: 'var(--card-bg)', borderRadius: 'var(--r-md)',
          padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <img src={user.avatar} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{user.firstName} {user.lastName}</div>
            <div style={{ fontSize: 13, color: 'var(--secondary-label)', marginBottom: 4 }}>Member since {user.joined}</div>
            {authToken ? (
              <span className="badge badge-success" style={{ fontSize: 10 }}>API Connected</span>
            ) : (
              <span className="badge badge-warning" style={{ fontSize: 10 }}>Demo Mode</span>
            )}
            {user.verified && <span className="badge badge-success"><CheckCircle size={10} /> Verified</span>}
          </div>
        </div>

        {/* Host/Guest mode switch */}
        <div style={{
          background: 'var(--card-bg)', borderRadius: 'var(--r-md)',
          padding: 4, marginBottom: 20, display: 'flex',
        }}>
          <button
            onClick={() => isHost && toggleMode()}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 'var(--r-sm)',
              background: !isHost ? 'var(--black)' : 'transparent',
              color: !isHost ? 'var(--white)' : 'var(--secondary-label)',
              fontSize: 15, fontWeight: 600, transition: 'all 0.2s',
            }}
          >Guest</button>
          <button
            onClick={() => !isHost && toggleMode()}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 'var(--r-sm)',
              background: isHost ? 'var(--black)' : 'transparent',
              color: isHost ? 'var(--white)' : 'var(--secondary-label)',
              fontSize: 15, fontWeight: 600, transition: 'all 0.2s',
            }}
          >Host</button>
        </div>

        {/* Host section */}
        {isHost && (
          <>
            {/* Earnings summary */}
            <div style={{
              background: 'var(--black)', color: 'var(--white)', borderRadius: 'var(--r-md)',
              padding: 20, marginBottom: 12,
            }}>
              <div style={{ fontSize: 13, color: 'var(--muted-gray)', marginBottom: 4 }}>This month's earnings</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 8 }}>$3,690</div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                <span>3 active listings</span>
                <span>164 total trips</span>
              </div>
            </div>

            <div className="ios-group" style={{ marginBottom: 20 }}>
              <button className="ios-group-item" onClick={onListCar}>
                <Plus size={20} color="var(--blue)" />
                <span style={{ flex: 1, fontSize: 16 }}>List a new car</span>
                <ChevronRight size={16} color="var(--tertiary-label)" />
              </button>
              <button className="ios-group-item" onClick={() => onNavigate('earnings')}>
                <DollarSign size={20} color="var(--secondary-label)" />
                <span style={{ flex: 1, fontSize: 16 }}>Earnings</span>
                <span style={{ fontSize: 15, color: 'var(--secondary-label)' }}>$30,740</span>
                <ChevronRight size={16} color="var(--tertiary-label)" />
              </button>
              <button className="ios-group-item" onClick={() => onNavigate('hostReviews')}>
                <Star size={20} color="var(--secondary-label)" />
                <span style={{ flex: 1, fontSize: 16 }}>Reviews</span>
                <span style={{ fontSize: 15, color: 'var(--secondary-label)' }}>4.9 avg</span>
                <ChevronRight size={16} color="var(--tertiary-label)" />
              </button>
            </div>
          </>
        )}

        {/* Account section */}
        {/* Appearance */}
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: 8, paddingLeft: 4 }}>APPEARANCE</div>
        <div className="ios-group" style={{ marginBottom: 20 }}>
          <button className="ios-group-item" onClick={toggleTheme} style={{ padding: '14px 16px' }}>
            {isDark ? <Moon size={20} color="var(--text-secondary)" /> : <Sun size={20} color="var(--accent)" />}
            <span style={{ flex: 1, fontSize: 16 }}>Theme</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', marginRight: 8 }}>{isDark ? 'Dark' : 'Light'}</span>
            <div style={{
              width: 50, height: 30, borderRadius: 15,
              background: isDark ? 'var(--surface-3)' : 'var(--accent)',
              padding: 2, transition: 'background 0.2s',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 13, background: '#fff',
                transform: isDark ? 'translateX(0)' : 'translateX(20px)',
                transition: 'transform 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </div>
          </button>
        </div>

        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)', marginBottom: 8, paddingLeft: 4 }}>ACCOUNT</div>
        <div className="ios-group" style={{ marginBottom: 20 }}>
          <button className="ios-group-item" onClick={onVerify}>
            <Shield size={20} color="var(--secondary-label)" />
            <span style={{ flex: 1, fontSize: 16 }}>Verification</span>
            {user.verified
              ? <span className="badge badge-success"><CheckCircle size={10} /> Verified</span>
              : <span className="badge badge-warning">Required</span>
            }
            <ChevronRight size={16} color="var(--tertiary-label)" />
          </button>
          <button className="ios-group-item" onClick={() => onNavigate('paymentMethods')}>
            <CreditCard size={20} color="var(--secondary-label)" />
            <span style={{ flex: 1, fontSize: 16 }}>Payment methods</span>
            <ChevronRight size={16} color="var(--tertiary-label)" />
          </button>
          <button className="ios-group-item" onClick={() => onNavigate('notifications')}>
            <Bell size={20} color="var(--secondary-label)" />
            <span style={{ flex: 1, fontSize: 16 }}>Notifications</span>
            <ChevronRight size={16} color="var(--tertiary-label)" />
          </button>
        </div>

        {/* Support section */}
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--secondary-label)', marginBottom: 8, paddingLeft: 4 }}>SUPPORT</div>
        <div className="ios-group" style={{ marginBottom: 20 }}>
          <button className="ios-group-item" onClick={() => onNavigate('helpCenter')}>
            <CircleHelp size={20} color="var(--secondary-label)" />
            <span style={{ flex: 1, fontSize: 16 }}>Help center</span>
            <ChevronRight size={16} color="var(--tertiary-label)" />
          </button>
          <button className="ios-group-item" onClick={() => onNavigate('termsPrivacy')}>
            <FileText size={20} color="var(--secondary-label)" />
            <span style={{ flex: 1, fontSize: 16 }}>Terms & privacy</span>
            <ChevronRight size={16} color="var(--tertiary-label)" />
          </button>
        </div>

        {/* Log out */}
        <div className="ios-group" style={{ marginBottom: 40 }}>
          <button className="ios-group-item" onClick={logout} style={{ justifyContent: 'center' }}>
            <LogOut size={18} color="var(--error)" />
            <span style={{ fontSize: 16, color: 'var(--error)' }}>Log out</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--tertiary-label)', paddingBottom: 20 }}>
          RIDE v1.0 · A vertical of Outdoorsy
        </div>
      </div>
    </div>
  );
}
