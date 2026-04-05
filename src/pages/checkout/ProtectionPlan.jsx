import { useNavigate } from 'react-router-dom';
import { Shield, Check, ChevronRight, Star } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { protectionPlans } from '../../data/listings';

export default function ProtectionPlan() {
  const navigate = useNavigate();
  const { booking, updateBooking, getTripDays } = useBooking();
  const days = getTripDays();

  if (!booking.vehicle) {
    navigate('/search');
    return null;
  }

  const handleSelect = (plan) => {
    updateBooking({ protectionPlan: plan });
    navigate('/checkout/extras');
  };

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
                background: i === 0 ? 'var(--black)' : 'var(--border-light)',
                marginBottom: 8,
              }} />
              <span style={{
                fontSize: 12,
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? 'var(--black)' : 'var(--muted-gray)',
              }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Vehicle summary */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-4)',
          background: 'var(--white)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-8)',
        }}>
          <img
            src={booking.vehicle.images[0]}
            alt=""
            style={{ width: 100, height: 68, objectFit: 'cover', borderRadius: 6 }}
          />
          <div>
            <h5 style={{ fontSize: 15, marginBottom: 2 }}>
              {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
            </h5>
            <p style={{ fontSize: 13, color: 'var(--body-gray)' }}>
              {days} day{days > 1 ? 's' : ''} · ${booking.vehicle.pricePerDay}/day
            </p>
          </div>
        </div>

        <h2 style={{ marginBottom: 8 }}>Choose your protection plan</h2>
        <p style={{ color: 'var(--body-gray)', marginBottom: 'var(--space-8)', lineHeight: 1.6 }}>
          Every trip includes state-minimum liability insurance. Upgrade for collision, comprehensive, and roadside coverage.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {protectionPlans.map(plan => (
            <button
              key={plan.id}
              onClick={() => handleSelect(plan)}
              style={{
                background: 'var(--white)',
                border: booking.protectionPlan?.id === plan.id ? '2px solid var(--black)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-6)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                position: 'relative',
              }}
            >
              {plan.popular && (
                <span style={{
                  position: 'absolute',
                  top: -10,
                  right: 16,
                  background: 'var(--black)',
                  color: 'var(--white)',
                  padding: '3px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 11,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <Star size={10} fill="currentColor" /> Most popular
                </span>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontSize: 20, marginBottom: 2 }}>{plan.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--body-gray)' }}>{plan.description}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>
                    {plan.pricePerDay === 0 ? 'Free' : `$${plan.pricePerDay}`}
                  </div>
                  {plan.pricePerDay > 0 && <div style={{ fontSize: 12, color: 'var(--body-gray)' }}>/day</div>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13 }}>
                <span style={{ color: 'var(--body-gray)' }}>Coverage: <strong>{plan.coverage}</strong></span>
                <span style={{ color: 'var(--body-gray)' }}>Deductible: <strong>{plan.deductible}</strong></span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {plan.details.map(detail => (
                  <div key={detail} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--body-gray)' }}>
                    <Check size={14} color="var(--success)" /> {detail}
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginTop: 'var(--space-4)',
                color: 'var(--black)',
                fontSize: 14,
                fontWeight: 500,
                gap: 4,
              }}>
                Select <ChevronRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
