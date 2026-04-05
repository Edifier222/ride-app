import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Star, CheckCircle, Clock, AlertCircle, ChevronRight, Heart, Settings, LogOut, Shield, Car } from 'lucide-react';
import { guestTrips, savedCars } from '../data/mockBookings';
import CarCard from '../components/CarCard';

const TABS = ['Trips', 'Saved', 'Profile'];

export default function GuestDashboard() {
  const { user, logout, openLogin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Trips');
  const [tripFilter, setTripFilter] = useState('all');

  if (!user) {
    openLogin();
    navigate('/');
    return null;
  }

  const filteredTrips = tripFilter === 'all'
    ? guestTrips
    : guestTrips.filter(t => t.status === tripFilter);

  const statusBadge = (status) => {
    const styles = {
      upcoming: { bg: '#EEF2FF', color: '#4338CA', label: 'Upcoming' },
      active: { bg: 'var(--success-bg)', color: '#108c3d', label: 'Active' },
      completed: { bg: 'var(--chip-gray)', color: 'var(--body-gray)', label: 'Completed' },
      cancelled: { bg: 'var(--error-bg)', color: 'var(--error)', label: 'Cancelled' },
    }[status];
    return (
      <span style={{
        background: styles.bg, color: styles.color,
        padding: '3px 10px', borderRadius: 'var(--radius-pill)',
        fontSize: 12, fontWeight: 500,
      }}>{styles.label}</span>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chip-gray)' }}>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>

          {/* Sidebar */}
          <div>
            <div style={{
              background: 'var(--white)', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-6)', marginBottom: 'var(--space-4)',
              textAlign: 'center',
            }}>
              <img
                src={user.avatar}
                alt={user.firstName}
                style={{ width: 72, height: 72, borderRadius: 'var(--radius-circle)', objectFit: 'cover', margin: '0 auto var(--space-3)' }}
              />
              <h3 style={{ fontSize: 18, marginBottom: 2 }}>{user.firstName} {user.lastName}</h3>
              <p style={{ fontSize: 13, color: 'var(--body-gray)', marginBottom: 8 }}>Member since {user.joined}</p>
              {user.verified && (
                <span className="badge badge-success"><CheckCircle size={12} /> Verified</span>
              )}
            </div>

            <div style={{
              background: 'var(--white)', borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}>
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: 'var(--space-4) var(--space-5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontWeight: tab === t ? 600 : 400,
                    background: tab === t ? 'var(--chip-gray)' : 'transparent',
                    borderLeft: tab === t ? '3px solid var(--black)' : '3px solid transparent',
                    fontSize: 14,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {t === 'Trips' && <Car size={16} />}
                    {t === 'Saved' && <Heart size={16} />}
                    {t === 'Profile' && <Settings size={16} />}
                    {t}
                  </span>
                  <ChevronRight size={14} color="var(--muted-gray)" />
                </button>
              ))}
              <button
                onClick={() => { logout(); navigate('/'); }}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: 'var(--space-4) var(--space-5)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  color: 'var(--error)', fontSize: 14,
                  borderTop: '1px solid var(--border-light)',
                }}
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          </div>

          {/* Main content */}
          <div>
            {/* Trips tab */}
            {tab === 'Trips' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                  <h2>My trips</h2>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'upcoming', label: 'Upcoming' },
                      { key: 'completed', label: 'Completed' },
                    ].map(f => (
                      <button
                        key={f.key}
                        className={`btn btn-chip ${tripFilter === f.key ? 'active' : ''}`}
                        onClick={() => setTripFilter(f.key)}
                        style={{ fontSize: 13, padding: '6px 14px' }}
                      >{f.label}</button>
                    ))}
                  </div>
                </div>

                {filteredTrips.length === 0 ? (
                  <div style={{
                    background: 'var(--white)', borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-12)', textAlign: 'center',
                  }}>
                    <p style={{ color: 'var(--body-gray)', marginBottom: 16 }}>No trips found.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/search')}>Browse cars</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {filteredTrips.map(trip => (
                      <div key={trip.id} style={{
                        background: 'var(--white)', borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                      }}>
                        <div style={{ display: 'flex', gap: 'var(--space-5)', padding: 'var(--space-5)' }}>
                          <img
                            src={trip.vehicle.images[0]}
                            alt=""
                            style={{ width: 160, height: 110, objectFit: 'cover', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                            onClick={() => navigate(`/car/${trip.vehicle.id}`)}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                              <h4 style={{ fontSize: 16 }}>
                                {trip.vehicle.year} {trip.vehicle.make} {trip.vehicle.model}
                              </h4>
                              {statusBadge(trip.status)}
                            </div>
                            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--body-gray)', marginBottom: 8 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Calendar size={13} />
                                {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={13} /> {trip.vehicle.location.city}, {trip.vehicle.location.state}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: 12, fontSize: 13, alignItems: 'center' }}>
                              <span><Shield size={13} style={{ verticalAlign: -2 }} /> {trip.protectionPlan}</span>
                              <span style={{ fontWeight: 600 }}>${trip.total} total</span>
                            </div>

                            {/* Verification warning for upcoming trips */}
                            {trip.status === 'upcoming' && !trip.verified && (
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: '#FFF7ED', padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                                marginTop: 10, fontSize: 13, color: '#C2410C',
                              }}>
                                <AlertCircle size={14} />
                                <span>Verify your identity to confirm this trip</span>
                                <button
                                  className="btn btn-sm"
                                  style={{ background: '#C2410C', color: 'white', padding: '4px 12px', fontSize: 12, marginLeft: 'auto' }}
                                  onClick={() => navigate('/verification')}
                                >Verify now</button>
                              </div>
                            )}

                            {/* Host message for upcoming */}
                            {trip.status === 'upcoming' && trip.hostMessage && (
                              <div style={{
                                background: 'var(--chip-gray)', padding: '8px 12px',
                                borderRadius: 'var(--radius-sm)', marginTop: 10, fontSize: 13,
                                color: 'var(--body-gray)',
                              }}>
                                <strong>Host:</strong> {trip.hostMessage}
                              </div>
                            )}

                            {/* Review for completed */}
                            {trip.status === 'completed' && trip.review && (
                              <div style={{
                                background: 'var(--chip-gray)', padding: '8px 12px',
                                borderRadius: 'var(--radius-sm)', marginTop: 10, fontSize: 13,
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                                  {Array.from({ length: trip.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                                </div>
                                <span style={{ color: 'var(--body-gray)' }}>{trip.review}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved tab */}
            {tab === 'Saved' && (
              <div>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Saved cars</h2>
                {savedCars.length === 0 ? (
                  <div style={{
                    background: 'var(--white)', borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-12)', textAlign: 'center',
                  }}>
                    <Heart size={32} color="var(--muted-gray)" style={{ marginBottom: 12 }} />
                    <p style={{ color: 'var(--body-gray)', marginBottom: 16 }}>No saved cars yet.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/search')}>Browse cars</button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--space-5)',
                  }}>
                    {savedCars.map(car => <CarCard key={car.id} car={car} />)}
                  </div>
                )}
              </div>
            )}

            {/* Profile tab */}
            {tab === 'Profile' && (
              <div>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Profile</h2>
                <div style={{
                  background: 'var(--white)', borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-6)',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="input-group">
                      <label>First name</label>
                      <input type="text" defaultValue={user.firstName} />
                    </div>
                    <div className="input-group">
                      <label>Last name</label>
                      <input type="text" defaultValue={user.lastName} />
                    </div>
                    <div className="input-group">
                      <label>Email</label>
                      <input type="email" defaultValue={user.email} />
                    </div>
                    <div className="input-group">
                      <label>Phone</label>
                      <input type="tel" defaultValue={user.phone} />
                    </div>
                  </div>
                  <hr className="divider" />
                  <h4 style={{ marginBottom: 'var(--space-4)' }}>Verification</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'Email', verified: true },
                      { label: 'Phone', verified: true },
                      { label: "Driver's license", verified: user.verified },
                    ].map(v => (
                      <div key={v.label} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--chip-gray)', borderRadius: 'var(--radius-sm)',
                      }}>
                        <span style={{ fontSize: 14 }}>{v.label}</span>
                        {v.verified ? (
                          <span className="badge badge-success"><CheckCircle size={12} /> Verified</span>
                        ) : (
                          <button className="btn btn-sm btn-primary" onClick={() => navigate('/verification')}>Verify</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <hr className="divider" />
                  <button className="btn btn-primary">Save changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .container > div[style*="grid-template-columns: 280px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
