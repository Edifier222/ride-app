import { ChevronLeft, Star, Clock, Shield, CheckCircle, MessageSquare, Car } from 'lucide-react';
import { listings } from '../../data/listings';

export default function HostProfilePage({ host, onBack, onSelectCar, onMessage }) {
  // Find all cars by this host
  const hostCars = listings.filter(l => l.host.id === host.id);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', paddingBottom: 40, maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--glass)', backdropFilter: 'blur(24px)',
        borderBottom: '0.5px solid var(--border)',
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Host profile</span>
      </div>

      <div style={{ padding: 16 }}>
        {/* Host card */}
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--r-md)',
          border: '1px solid var(--border)', padding: 24,
          textAlign: 'center', marginBottom: 16,
        }}>
          <img src={host.avatar} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '3px solid var(--accent)' }} />
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 4 }}>{host.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>Member since {host.joined}</div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-text)' }}>{host.rating}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
                <Star size={10} fill="currentColor" color="var(--accent)" /> Rating
              </div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{host.trips}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Trips</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{host.responseRate}%</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Response</div>
            </div>
          </div>

          <button onClick={onMessage} className="btn-primary" style={{ marginBottom: 0 }}>
            <MessageSquare size={16} /> Message host
          </button>
        </div>

        {/* About */}
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--r-md)',
          border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>About</div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{host.bio}</p>
        </div>

        {/* Quick facts */}
        <div className="ios-group" style={{ marginBottom: 16 }}>
          <div className="ios-group-item">
            <Clock size={16} color="var(--text-secondary)" />
            <span style={{ flex: 1, fontSize: 15 }}>Response time</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Responds {host.responseTime}</span>
          </div>
          <div className="ios-group-item">
            <Shield size={16} color="var(--text-secondary)" />
            <span style={{ flex: 1, fontSize: 15 }}>Verified host</span>
            <span className="badge badge-success"><CheckCircle size={10} /> Verified</span>
          </div>
          <div className="ios-group-item">
            <Car size={16} color="var(--text-secondary)" />
            <span style={{ flex: 1, fontSize: 15 }}>Vehicles listed</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{hostCars.length}</span>
          </div>
        </div>

        {/* Host's cars */}
        {hostCars.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 10, paddingLeft: 2 }}>
              {host.name.toUpperCase()}'S VEHICLES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {hostCars.map(car => (
                <button key={car.id} onClick={() => onSelectCar(car.id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                  background: 'var(--surface)', borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border)', padding: '12px 14px',
                  textAlign: 'left',
                }}>
                  <img src={car.images[0]} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{car.year} {car.make} {car.model}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Star size={11} fill="currentColor" color="var(--accent)" /> {car.rating} · {car.trips} trips
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-text)' }}>${car.pricePerDay}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>/day</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reviews from this host's cars */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 10, paddingLeft: 2 }}>REVIEWS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hostCars.flatMap(car => car.reviews).slice(0, 5).map((review, i) => (
              <div key={i} style={{
                background: 'var(--surface)', borderRadius: 'var(--r-sm)',
                border: '1px solid var(--border)', padding: '12px 14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{review.author}</span>
                  <div style={{ display: 'flex', gap: 1 }}>
                    {Array.from({ length: review.rating }).map((_, j) => <Star key={j} size={11} fill="currentColor" color="var(--accent)" />)}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
