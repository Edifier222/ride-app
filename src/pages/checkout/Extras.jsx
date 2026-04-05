import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { MapPin, UserPlus, Clock, ChevronRight } from 'lucide-react';

export default function Extras() {
  const navigate = useNavigate();
  const { booking, updateBooking, getTripDays } = useBooking();
  const days = getTripDays();

  if (!booking.vehicle) {
    navigate('/search');
    return null;
  }

  const toggleExtra = (key) => {
    updateBooking({
      extras: { ...booking.extras, [key]: !booking.extras[key] },
    });
  };

  const extras = [
    {
      key: 'delivery',
      icon: <MapPin size={20} />,
      title: 'Vehicle delivery',
      desc: `Have the car delivered to your location. ${booking.vehicle.delivery ? '' : 'Not available for this vehicle.'}`,
      price: booking.vehicle.delivery ? `$${booking.vehicle.deliveryFee}` : null,
      available: booking.vehicle.delivery,
    },
    {
      key: 'youngDriver',
      icon: <Clock size={20} />,
      title: 'Young driver (under 25)',
      desc: 'Additional fee required for drivers aged 18-24.',
      price: `$${15 * days}`,
      available: true,
    },
    {
      key: 'additionalDriver',
      icon: <UserPlus size={20} />,
      title: 'Additional driver',
      desc: 'Add a second driver to the booking.',
      price: `$${10 * days}`,
      available: true,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chip-gray)' }}>
      <div className="container-narrow" style={{ padding: 'var(--space-10) var(--space-6)' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-8)' }}>
          {['Protection', 'Extras', 'Review & Pay'].map((step, i) => (
            <div key={step} style={{ flex: 1 }}>
              <div style={{
                height: 3,
                borderRadius: 2,
                background: i <= 1 ? 'var(--black)' : 'var(--border-light)',
                marginBottom: 8,
              }} />
              <span style={{
                fontSize: 12,
                fontWeight: i === 1 ? 600 : 400,
                color: i === 1 ? 'var(--black)' : i < 1 ? 'var(--body-gray)' : 'var(--muted-gray)',
              }}>{step}</span>
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: 8 }}>Add extras</h2>
        <p style={{ color: 'var(--body-gray)', marginBottom: 'var(--space-8)' }}>
          Optional add-ons for your trip. You can skip this step.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {extras.map(extra => (
            <button
              key={extra.key}
              onClick={() => extra.available && toggleExtra(extra.key)}
              disabled={!extra.available}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                background: 'var(--white)',
                border: booking.extras[extra.key] ? '2px solid var(--black)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-5)',
                textAlign: 'left',
                cursor: extra.available ? 'pointer' : 'not-allowed',
                opacity: extra.available ? 1 : 0.5,
                width: '100%',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--chip-gray)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>{extra.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>{extra.title}</div>
                <div style={{ fontSize: 13, color: 'var(--body-gray)' }}>{extra.desc}</div>
              </div>
              {extra.price && (
                <div style={{ fontWeight: 600, fontSize: 15, flexShrink: 0 }}>{extra.price}</div>
              )}
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                border: booking.extras[extra.key] ? 'none' : '2px solid var(--border-light)',
                background: booking.extras[extra.key] ? 'var(--black)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {booking.extras[extra.key] && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 'var(--space-8)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/checkout/protection')}>
            Back
          </button>
          <button className="btn btn-primary" style={{ flex: 1, gap: 4 }} onClick={() => navigate('/checkout/review')}>
            Continue <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
