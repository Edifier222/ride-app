import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { CheckCircle, Calendar, MapPin, Shield, ArrowRight, Upload, Camera, CreditCard } from 'lucide-react';

export default function Confirmation() {
  const navigate = useNavigate();
  const { booking } = useBooking();

  if (!booking.confirmed || !booking.vehicle) {
    navigate('/');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chip-gray)' }}>
      <div className="container-narrow" style={{ padding: 'var(--space-10) var(--space-6)' }}>
        {/* Success header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 'var(--radius-circle)',
            background: 'var(--black)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-5)',
          }}>
            <CheckCircle size={36} color="var(--white)" />
          </div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>You're booked!</h1>
          <p style={{ color: 'var(--body-gray)', fontSize: 16 }}>
            Booking #{booking.bookingId} confirmed
          </p>
        </div>

        {/* Trip card */}
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: 'var(--space-6)',
        }}>
          <img
            src={booking.vehicle.images[0]}
            alt=""
            style={{ width: '100%', height: 220, objectFit: 'cover' }}
          />
          <div style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>
              {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-4)',
              fontSize: 14,
            }}>
              <div>
                <div style={{ color: 'var(--muted-gray)', fontSize: 12, marginBottom: 4 }}>Pick-up</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={14} />
                  {new Date(booking.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--muted-gray)', fontSize: 12, marginBottom: 4 }}>Return</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={14} />
                  {new Date(booking.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--muted-gray)', fontSize: 12, marginBottom: 4 }}>Location</div>
                <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={14} />
                  {booking.vehicle.location.city}, {booking.vehicle.location.state}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification CTA — the key post-booking step */}
        <div style={{
          background: 'var(--black)',
          color: 'var(--white)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}>
          <h3 style={{ marginBottom: 8 }}>Verify your identity</h3>
          <p style={{ color: 'var(--muted-gray)', fontSize: 14, lineHeight: 1.6, marginBottom: 'var(--space-5)' }}>
            To confirm your trip, we need to verify your identity. This takes about 2 minutes and requires:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Upload size={16} /></div>
              <div>
                <div style={{ fontWeight: 500 }}>Driver's license</div>
                <div style={{ color: 'var(--muted-gray)', fontSize: 12 }}>Front and back photo of your valid license</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Camera size={16} /></div>
              <div>
                <div style={{ fontWeight: 500 }}>Selfie verification</div>
                <div style={{ color: 'var(--muted-gray)', fontSize: 12 }}>Quick selfie to match your license photo</div>
              </div>
            </div>
          </div>
          <button
            className="btn btn-lg"
            style={{
              background: 'var(--white)',
              color: 'var(--black)',
              width: '100%',
              gap: 8,
            }}
            onClick={() => navigate('/verification')}
          >
            Verify now <ArrowRight size={18} />
          </button>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted-gray)', marginTop: 12 }}>
            You must verify before your trip starts. You can also do this later from your trips page.
          </p>
        </div>

        {/* What's next */}
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
        }}>
          <h4 style={{ marginBottom: 'var(--space-4)' }}>What happens next</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { step: '1', title: 'Verify your identity', desc: 'Upload your license and take a selfie. This confirms your booking.' },
              { step: '2', title: 'Host confirms', desc: 'The host will review and approve your booking (instant bookings are auto-approved).' },
              { step: '3', title: 'Pick up your car', desc: 'Meet the host at the pickup location or get the car delivered. Inspect and go!' },
              { step: '4', title: 'Hit the road', desc: 'Drive with confidence. 24/7 roadside assistance available.' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', gap: 14 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 'var(--radius-circle)',
                  background: 'var(--chip-gray)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>{item.step}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--body-gray)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Back to home
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/verification')}>
            Verify identity
          </button>
        </div>
      </div>
    </div>
  );
}
