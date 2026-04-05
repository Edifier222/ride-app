import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Star, MapPin, Zap, Shield, Clock, ChevronLeft, ChevronRight, Check, Fuel, Users, Gauge, DoorOpen, Calendar } from 'lucide-react';
import { listings } from '../data/listings';
import { useBooking } from '../context/BookingContext';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  const car = listings.find(c => c.id === id);
  const [currentImage, setCurrentImage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!car) return (
    <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
      <h2>Car not found</h2>
      <button className="btn btn-primary" onClick={() => navigate('/search')} style={{ marginTop: 16 }}>Browse cars</button>
    </div>
  );

  const days = startDate && endDate ? Math.max(Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000), 1) : 1;
  const tripTotal = car.pricePerDay * days;

  const handleBook = () => {
    updateBooking({
      vehicle: car,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    });
    navigate('/checkout/protection');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Image gallery */}
      <div style={{
        position: 'relative',
        background: '#111',
        height: 480,
        overflow: 'hidden',
      }}>
        <img
          src={car.images[currentImage]}
          alt={`${car.year} ${car.make} ${car.model}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {car.images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage(i => (i - 1 + car.images.length) % car.images.length)}
              style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: 'var(--radius-circle)',
                background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px var(--shadow-medium)',
              }}
            ><ChevronLeft size={20} /></button>
            <button
              onClick={() => setCurrentImage(i => (i + 1) % car.images.length)}
              style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: 'var(--radius-circle)',
                background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px var(--shadow-medium)',
              }}
            ><ChevronRight size={20} /></button>
          </>
        )}
        {/* Image dots */}
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6,
        }}>
          {car.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i === currentImage ? 'var(--white)' : 'rgba(255,255,255,0.5)',
                border: 'none', cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-8) var(--space-6) var(--space-16)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-10)', alignItems: 'start' }}>
          {/* Left column — details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {car.instantBook && (
                <span className="badge badge-black"><Zap size={12} fill="currentColor" /> Instant book</span>
              )}
              <span style={{ fontSize: 14, color: 'var(--body-gray)' }}>
                <MapPin size={14} style={{ verticalAlign: -2 }} /> {car.location.city}, {car.location.state}
              </span>
            </div>

            <h1 style={{ fontSize: 36, marginBottom: 8 }}>
              {car.year} {car.make} {car.model}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                <Star size={16} fill="currentColor" /> {car.rating}
              </div>
              <span style={{ color: 'var(--body-gray)', fontSize: 14 }}>{car.trips} trips</span>
            </div>

            <hr className="divider" />

            {/* Specs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)',
            }}>
              {[
                { icon: <Fuel size={18} />, label: car.fuelType, sub: car.mpg },
                { icon: <Users size={18} />, label: `${car.seats} seats`, sub: `${car.doors} doors` },
                { icon: <Gauge size={18} />, label: car.transmission, sub: '' },
                { icon: <MapPin size={18} />, label: `${car.milesIncluded} mi/day`, sub: `$${car.extraMileRate}/extra mi` },
              ].map(spec => (
                <div key={spec.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'var(--space-3) 0' }}>
                  <div style={{ color: 'var(--body-gray)' }}>{spec.icon}</div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{spec.label}</div>
                    {spec.sub && <div style={{ fontSize: 12, color: 'var(--muted-gray)' }}>{spec.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            <hr className="divider" />

            {/* Description */}
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Description</h3>
            <p style={{ color: 'var(--body-gray)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
              {car.description}
            </p>

            {/* Features */}
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 24px', marginBottom: 'var(--space-6)' }}>
              {car.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <Check size={16} color="var(--success)" /> {f}
                </div>
              ))}
            </div>

            <hr className="divider" />

            {/* Host */}
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Hosted by {car.host.name}</h3>
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <img
                src={car.host.avatar}
                alt={car.host.name}
                style={{ width: 56, height: 56, borderRadius: 'var(--radius-circle)', objectFit: 'cover' }}
              />
              <div>
                <div style={{ display: 'flex', gap: 12, fontSize: 14, marginBottom: 4 }}>
                  <span><Star size={13} fill="currentColor" style={{ verticalAlign: -1 }} /> {car.host.rating}</span>
                  <span>{car.host.trips} trips</span>
                  <span>Joined {car.host.joined}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--body-gray)' }}>
                  Responds {car.host.responseTime} · {car.host.responseRate}% response rate
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--body-gray)', fontSize: 14, lineHeight: 1.6 }}>{car.host.bio}</p>

            <hr className="divider" />

            {/* Reviews */}
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Reviews</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {car.reviews.map((review, i) => (
                <div key={i} style={{ padding: 'var(--space-4)', background: 'var(--chip-gray)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{review.author}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} size={12} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--body-gray)', lineHeight: 1.5 }}>{review.text}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted-gray)', marginTop: 6 }}>{review.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — booking card */}
          <div style={{
            position: 'sticky',
            top: 80,
            background: 'var(--white)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6)',
            boxShadow: '0 4px 16px var(--shadow-light)',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 'var(--space-5)' }}>
              <span style={{ fontSize: 28, fontWeight: 700 }}>${car.pricePerDay}</span>
              <span style={{ color: 'var(--body-gray)', fontSize: 16 }}>/day</span>
            </div>

            {/* Date pickers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 'var(--space-4)' }}>
              <div className="input-group">
                <label>Trip start</label>
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Trip end</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Price breakdown */}
            {startDate && endDate && (
              <div style={{ marginBottom: 'var(--space-4)', fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--body-gray)' }}>${car.pricePerDay} x {days} days</span>
                  <span>${tripTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--body-gray)' }}>Service fee</span>
                  <span>${Math.round(tripTotal * 0.10)}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Total before protection</span>
                  <span>${tripTotal + Math.round(tripTotal * 0.10)}</span>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={handleBook}
            >
              Continue to book
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'var(--space-4)' }}>
              {[
                { icon: <Shield size={14} />, text: 'Protection plans from $0/day' },
                { icon: <Clock size={14} />, text: 'Free cancellation up to 24h before' },
                { icon: <MapPin size={14} />, text: `${car.milesIncluded} miles included per day` },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--body-gray)' }}>
                  {item.icon} {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive override for mobile */}
      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
