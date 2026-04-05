import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  DollarSign, TrendingUp, Car, Star, Calendar, ChevronRight,
  CheckCircle, X, Clock, MessageSquare, Plus, Settings, BarChart3,
  MapPin, Users, LogOut, Eye
} from 'lucide-react';
import { hostListings, hostBookingRequests } from '../data/mockBookings';

const TABS = ['Overview', 'Listings', 'Bookings', 'Earnings'];

export default function HostDashboard() {
  const { user, logout, openLogin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [requests, setRequests] = useState(hostBookingRequests);

  if (!user) {
    openLogin();
    navigate('/');
    return null;
  }

  const totalEarnings = hostListings.reduce((sum, l) => sum + l.hostStats.totalEarnings, 0);
  const monthlyEarnings = hostListings.reduce((sum, l) => sum + l.hostStats.monthlyEarnings, 0);
  const totalTrips = hostListings.reduce((sum, l) => sum + l.hostStats.totalTrips, 0);
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const handleRequest = (id, action) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: action } : r
    ));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chip-gray)' }}>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>

          {/* Sidebar */}
          <div>
            <div style={{
              background: 'var(--white)', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-5)', marginBottom: 'var(--space-4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <img src={user.avatar} alt="" style={{ width: 44, height: 44, borderRadius: 'var(--radius-circle)', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{user.firstName} {user.lastName}</div>
                  <div style={{ fontSize: 12, color: 'var(--body-gray)' }}>Host dashboard</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: 'var(--chip-gray)', borderRadius: 'var(--radius-sm)', padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{hostListings.length}</div>
                  <div style={{ fontSize: 11, color: 'var(--body-gray)' }}>Vehicles</div>
                </div>
                <div style={{ flex: 1, background: 'var(--chip-gray)', borderRadius: 'var(--radius-sm)', padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{totalTrips}</div>
                  <div style={{ fontSize: 11, color: 'var(--body-gray)' }}>Trips</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
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
                    {t === 'Overview' && <BarChart3 size={16} />}
                    {t === 'Listings' && <Car size={16} />}
                    {t === 'Bookings' && <Calendar size={16} />}
                    {t === 'Earnings' && <DollarSign size={16} />}
                    {t}
                    {t === 'Bookings' && pendingCount > 0 && (
                      <span style={{
                        background: 'var(--error)', color: 'white',
                        borderRadius: '50%', width: 18, height: 18,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 600,
                      }}>{pendingCount}</span>
                    )}
                  </span>
                  <ChevronRight size={14} color="var(--muted-gray)" />
                </button>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)' }} />
              <button
                onClick={() => navigate('/list-your-car')}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: 'var(--space-4) var(--space-5)',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 14, fontWeight: 500,
                }}
              >
                <Plus size={16} /> List a new car
              </button>
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
            {/* Overview */}
            {tab === 'Overview' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                  <h2>Overview</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/list-your-car')}>
                    <Plus size={16} /> List a car
                  </button>
                </div>

                {/* Stats cards */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: 'var(--space-4)', marginBottom: 'var(--space-8)',
                }}>
                  {[
                    { icon: <DollarSign size={20} />, label: 'Total earnings', value: `$${totalEarnings.toLocaleString()}` },
                    { icon: <TrendingUp size={20} />, label: 'This month', value: `$${monthlyEarnings.toLocaleString()}` },
                    { icon: <Car size={20} />, label: 'Total trips', value: totalTrips },
                    { icon: <Clock size={20} />, label: 'Pending requests', value: pendingCount, highlight: pendingCount > 0 },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: stat.highlight ? 'var(--black)' : 'var(--white)',
                      color: stat.highlight ? 'var(--white)' : 'var(--black)',
                      borderRadius: 'var(--radius-md)', padding: 'var(--space-5)',
                    }}>
                      <div style={{ marginBottom: 8, opacity: 0.7 }}>{stat.icon}</div>
                      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 2 }}>{stat.value}</div>
                      <div style={{ fontSize: 13, opacity: 0.7 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Pending requests */}
                {pendingCount > 0 && (
                  <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Pending requests</h3>
                    {requests.filter(r => r.status === 'pending').map(req => (
                      <div key={req.id} style={{
                        background: 'var(--white)', borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-5)', marginBottom: 'var(--space-3)',
                      }}>
                        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                          <img src={req.guest.avatar} alt="" style={{ width: 44, height: 44, borderRadius: 'var(--radius-circle)', objectFit: 'cover' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <div>
                                <span style={{ fontWeight: 600, fontSize: 14 }}>{req.guest.name}</span>
                                <span style={{ fontSize: 13, color: 'var(--body-gray)', marginLeft: 8 }}>
                                  <Star size={12} fill="currentColor" style={{ verticalAlign: -1 }} /> {req.guest.rating} · {req.guest.trips} trips
                                </span>
                              </div>
                              <span style={{ fontWeight: 600 }}>${req.total}</span>
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--body-gray)', marginBottom: 6 }}>
                              {req.vehicle.year} {req.vehicle.make} {req.vehicle.model} ·{' '}
                              {new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(req.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            {req.message && (
                              <div style={{
                                background: 'var(--chip-gray)', padding: '8px 12px',
                                borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--body-gray)',
                                marginBottom: 10,
                              }}>
                                "{req.message}"
                              </div>
                            )}
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-primary btn-sm" onClick={() => handleRequest(req.id, 'approved')}>
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button className="btn btn-secondary btn-sm" onClick={() => handleRequest(req.id, 'declined')} style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>
                                <X size={14} /> Decline
                              </button>
                              <button className="btn btn-ghost btn-sm">
                                <MessageSquare size={14} /> Message
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Your listings */}
                <h3 style={{ marginBottom: 'var(--space-4)' }}>Your listings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {hostListings.map(listing => (
                    <div key={listing.id} style={{
                      background: 'var(--white)', borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center',
                    }}>
                      <img src={listing.images[0]} alt="" style={{ width: 100, height: 68, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                          {listing.year} {listing.make} {listing.model}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--body-gray)' }}>
                          ${listing.pricePerDay}/day · <Star size={11} fill="currentColor" style={{ verticalAlign: -1 }} /> {listing.hostStats.rating} · {listing.hostStats.totalTrips} trips
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>${listing.hostStats.monthlyEarnings}</div>
                        <div style={{ fontSize: 11, color: 'var(--body-gray)' }}>this month</div>
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/car/${listing.id}`)}>
                        <Eye size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Listings tab */}
            {tab === 'Listings' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                  <h2>My listings</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/list-your-car')}>
                    <Plus size={16} /> Add vehicle
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {hostListings.map(listing => (
                    <div key={listing.id} style={{
                      background: 'var(--white)', borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                    }}>
                      <div style={{ display: 'flex', gap: 'var(--space-5)', padding: 'var(--space-5)' }}>
                        <img src={listing.images[0]} alt="" style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: 16, marginBottom: 4 }}>
                            {listing.year} {listing.make} {listing.model}
                          </h4>
                          <p style={{ fontSize: 13, color: 'var(--body-gray)', marginBottom: 10 }}>
                            <MapPin size={12} style={{ verticalAlign: -1 }} /> {listing.location.city}, {listing.location.state} · ${listing.pricePerDay}/day
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                            {[
                              { label: 'Trips', value: listing.hostStats.totalTrips },
                              { label: 'Rating', value: listing.hostStats.rating },
                              { label: 'Earnings', value: `$${listing.hostStats.totalEarnings.toLocaleString()}` },
                              { label: 'Active', value: listing.hostStats.activeBookings },
                            ].map(s => (
                              <div key={s.label} style={{
                                background: 'var(--chip-gray)', borderRadius: 'var(--radius-sm)',
                                padding: '6px 10px', textAlign: 'center',
                              }}>
                                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.value}</div>
                                <div style={{ fontSize: 11, color: 'var(--body-gray)' }}>{s.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings tab */}
            {tab === 'Bookings' && (
              <div>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Booking requests</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {requests.map(req => {
                    const statusStyle = {
                      pending: { bg: '#FFF7ED', color: '#C2410C', label: 'Pending' },
                      approved: { bg: 'var(--success-bg)', color: '#108c3d', label: 'Approved' },
                      declined: { bg: 'var(--error-bg)', color: 'var(--error)', label: 'Declined' },
                    }[req.status];

                    return (
                      <div key={req.id} style={{
                        background: 'var(--white)', borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-5)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={req.guest.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                              <span style={{ fontWeight: 600, fontSize: 14 }}>{req.guest.name}</span>
                              <span style={{ fontSize: 12, color: 'var(--body-gray)', marginLeft: 8 }}>
                                <Star size={11} fill="currentColor" style={{ verticalAlign: -1 }} /> {req.guest.rating}
                              </span>
                            </div>
                          </div>
                          <span style={{
                            background: statusStyle.bg, color: statusStyle.color,
                            padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                            fontSize: 12, fontWeight: 500,
                          }}>{statusStyle.label}</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--body-gray)', marginBottom: 6 }}>
                          <strong>{req.vehicle.year} {req.vehicle.make} {req.vehicle.model}</strong> ·{' '}
                          {new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(req.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${req.total}
                        </div>
                        {req.message && (
                          <p style={{ fontSize: 13, color: 'var(--body-gray)', fontStyle: 'italic', marginBottom: 10 }}>"{req.message}"</p>
                        )}
                        {req.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-primary btn-sm" onClick={() => handleRequest(req.id, 'approved')}>Approve</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleRequest(req.id, 'declined')}>Decline</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Earnings tab */}
            {tab === 'Earnings' && (
              <div>
                <h2 style={{ marginBottom: 'var(--space-6)' }}>Earnings</h2>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--space-4)', marginBottom: 'var(--space-8)',
                }}>
                  <div style={{ background: 'var(--black)', color: 'var(--white)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: 13, color: 'var(--muted-gray)', marginBottom: 4 }}>Total earnings</div>
                    <div style={{ fontSize: 36, fontWeight: 700 }}>${totalEarnings.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
                    <div style={{ fontSize: 13, color: 'var(--body-gray)', marginBottom: 4 }}>This month</div>
                    <div style={{ fontSize: 36, fontWeight: 700 }}>${monthlyEarnings.toLocaleString()}</div>
                    <div style={{ fontSize: 13, color: 'var(--success)', marginTop: 4 }}>
                      <TrendingUp size={13} style={{ verticalAlign: -2 }} /> +12% vs last month
                    </div>
                  </div>
                </div>

                <h3 style={{ marginBottom: 'var(--space-4)' }}>Earnings by vehicle</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {hostListings.map(listing => (
                    <div key={listing.id} style={{
                      background: 'var(--white)', borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                    }}>
                      <img src={listing.images[0]} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 6 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{listing.year} {listing.make} {listing.model}</div>
                        <div style={{ fontSize: 12, color: 'var(--body-gray)' }}>{listing.hostStats.totalTrips} trips</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700 }}>${listing.hostStats.totalEarnings.toLocaleString()}</div>
                        <div style={{ fontSize: 12, color: 'var(--success)' }}>+${listing.hostStats.monthlyEarnings}/mo</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .container > div[style*="grid-template-columns: 260px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
