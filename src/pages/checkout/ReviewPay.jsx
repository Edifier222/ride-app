import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext';
import { CreditCard, Lock, Shield, Calendar, MapPin, ChevronDown } from 'lucide-react';

export default function ReviewPay() {
  const navigate = useNavigate();
  const { booking, updateBooking, getTripTotal } = useBooking();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [agreed, setAgreed] = useState(false);

  if (!booking.vehicle) {
    navigate('/search');
    return null;
  }

  const totals = getTripTotal();

  const formatCard = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      const bookingId = 'RIDE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      updateBooking({
        confirmed: true,
        bookingId,
        payment: { cardNumber, expiry, cvc, name },
      });
      navigate('/checkout/confirmation');
    }, 2000);
  };

  const isValid = cardNumber.replace(/\s/g, '').length >= 15 && expiry.length >= 4 && cvc.length >= 3 && name.length >= 2 && agreed;

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
                background: 'var(--black)',
                marginBottom: 8,
              }} />
              <span style={{
                fontSize: 12,
                fontWeight: i === 2 ? 600 : 400,
                color: i === 2 ? 'var(--black)' : 'var(--body-gray)',
              }}>{step}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Left — payment form */}
          <div>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Review & pay</h2>

            {/* Trip details */}
            <div style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-5)',
              marginBottom: 'var(--space-6)',
            }}>
              <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <img
                  src={booking.vehicle.images[0]}
                  alt=""
                  style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }}
                />
                <div>
                  <h4 style={{ fontSize: 16, marginBottom: 4 }}>
                    {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                  </h4>
                  <div style={{ fontSize: 13, color: 'var(--body-gray)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} /> {booking.vehicle.location.city}, {booking.vehicle.location.state}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 14 }}>
                <div>
                  <div style={{ color: 'var(--muted-gray)', fontSize: 12, marginBottom: 2 }}>Pick-up</div>
                  <div style={{ fontWeight: 500 }}>
                    <Calendar size={13} style={{ verticalAlign: -2 }} /> {new Date(booking.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted-gray)', fontSize: 12, marginBottom: 2 }}>Return</div>
                  <div style={{ fontWeight: 500 }}>
                    <Calendar size={13} style={{ verticalAlign: -2 }} /> {new Date(booking.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted-gray)', fontSize: 12, marginBottom: 2 }}>Protection</div>
                  <div style={{ fontWeight: 500 }}>
                    <Shield size={13} style={{ verticalAlign: -2 }} /> {booking.protectionPlan?.name || 'Minimum'}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment form */}
            <div style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-6)',
            }}>
              <h3 style={{ marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard size={20} /> Payment details
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label>Name on card</label>
                  <input
                    type="text"
                    placeholder="John Smith"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
                  <label>Card number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCard(e.target.value))}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                  <div className="input-group">
                    <label>Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                    />
                  </div>
                  <div className="input-group">
                    <label>CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvc}
                      onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    />
                  </div>
                </div>

                {/* Terms */}
                <label style={{
                  display: 'flex',
                  gap: 10,
                  fontSize: 13,
                  color: 'var(--body-gray)',
                  lineHeight: 1.5,
                  marginBottom: 'var(--space-5)',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    style={{ marginTop: 2, accentColor: 'var(--black)', width: 16, height: 16, flexShrink: 0 }}
                  />
                  <span>
                    I agree to the <a href="#" style={{ textDecoration: 'underline' }}>Terms of Service</a>,{' '}
                    <a href="#" style={{ textDecoration: 'underline' }}>Cancellation Policy</a>, and{' '}
                    <a href="#" style={{ textDecoration: 'underline' }}>Vehicle Rental Agreement</a>.
                    I understand that I will need to verify my identity before the trip.
                  </span>
                </label>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/checkout/extras')}>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={!isValid || processing}
                    style={{ flex: 1 }}
                  >
                    {processing ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white', borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }} />
                        Processing...
                      </span>
                    ) : (
                      <>
                        <Lock size={16} /> Book for ${totals.total}
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginTop: 'var(--space-4)',
                fontSize: 12,
                color: 'var(--muted-gray)',
              }}>
                <Lock size={12} /> Payments are encrypted and secure
              </div>
            </div>
          </div>

          {/* Right — order summary */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-6)',
            position: 'sticky',
            top: 80,
          }}>
            <h4 style={{ marginBottom: 'var(--space-5)' }}>Price breakdown</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--body-gray)' }}>${booking.vehicle.pricePerDay} x {totals.days} day{totals.days > 1 ? 's' : ''}</span>
                <span>${totals.vehicleCost}</span>
              </div>

              {totals.protectionCost > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--body-gray)' }}>{booking.protectionPlan.name} protection</span>
                  <span>${totals.protectionCost}</span>
                </div>
              )}

              {totals.deliveryFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--body-gray)' }}>Delivery fee</span>
                  <span>${totals.deliveryFee}</span>
                </div>
              )}

              {totals.youngDriverFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--body-gray)' }}>Young driver fee</span>
                  <span>${totals.youngDriverFee}</span>
                </div>
              )}

              {totals.additionalDriverFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--body-gray)' }}>Additional driver</span>
                  <span>${totals.additionalDriverFee}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--body-gray)' }}>Service fee</span>
                <span>${totals.serviceFee}</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                <span>Total</span>
                <span>${totals.total}</span>
              </div>
            </div>

            <div style={{
              marginTop: 'var(--space-5)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--success-bg)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13,
              color: '#108c3d',
            }}>
              Free cancellation up to 24 hours before pick-up.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .container-narrow > div[style*="grid-template-columns: 1fr 360px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
