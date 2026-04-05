import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, Shield, Check, Star, Lock, MapPin, Calendar, CreditCard, Smartphone, X, Fuel, Clock, Infinity, Truck, Edit3 } from 'lucide-react';
import { protectionPlans } from '../../data/listings';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { createQuote, createBooking } from '../../services/api';

const fmt = (n) => typeof n === "number" ? "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "$" + n;

export default function BookingFlow({ car, dates, onBack, onComplete }) {
  const [step, setStep] = useState(0); // 0=protection, 1=bill/addons, 2=questions, 3=payment
  const { updateBooking } = useBooking();
  const { authToken } = useAuth();

  // Use dates passed from car detail, fallback to defaults
  const defaultStart = dates?.startDate || new Date().toISOString().split('T')[0];
  const defaultEnd = dates?.endDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  // State
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:00');
  const [pickupCity, setPickupCity] = useState(`${car.location.city}, ${car.location.state}`);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBillDetail, setShowBillDetail] = useState(false);
  const [driverAge, setDriverAge] = useState('25+');
  const [plan, setPlan] = useState(protectionPlans[1]);
  const [declineProtection, setDeclineProtection] = useState(false);
  const [payMethod, setPayMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const [addons, setAddons] = useState({
    delivery: false,
    refuel: false,
    hourlyDropoff: false,
    unlimitedMiles: false,
  });

  const toggleAddon = (key) => setAddons(prev => ({ ...prev, [key]: !prev[key] }));

  // Tax rates by state
  const taxRates = { AZ: 0.056, CA: 0.0725, FL: 0.06, TX: 0.0625, NY: 0.08, CO: 0.029, WA: 0.065, NV: 0.0685 };
  const stateTaxRate = taxRates[car.location.state] || 0.06;

  // Calculations
  const days = Math.max(Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000), 1);
  const vehicleCost = car.pricePerDay * days;
  const protectionCost = declineProtection ? 0 : plan.pricePerDay * days;
  const deliveryFee = addons.delivery && car.delivery ? car.deliveryFee : 0;
  const refuelFee = addons.refuel ? 50 : 0;
  const hourlyFee = addons.hourlyDropoff ? 10 : 0;
  const milesFee = addons.unlimitedMiles ? 15 * days : 0;
  const youngDriverFee = driverAge === '21-24' ? 15 * days : 0;
  const addonsCost = deliveryFee + refuelFee + hourlyFee + milesFee + youngDriverFee;
  const subtotal = vehicleCost + protectionCost + addonsCost;
  const taxAmount = Math.round(subtotal * stateTaxRate);
  const total = subtotal + taxAmount;

  // Trip total shown on search/car detail = vehicleCost only (no extras, no tax)
  const tripBaseTotal = vehicleCost;

  const formatDate = (d) => new Date(d + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formatShort = (d) => new Date(d + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const handleSubmit = async () => {
    if (processing) return;
    setProcessing(true);

    let bookingId = 'RIDE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    let realBooking = false;

    // Try real API if we have a token and a real rental ID
    if (authToken && car.id) {
      try {
        // 1. Create quote
        const quote = await createQuote({
          rentalId: car.id,
          dateFrom: startDate,
          dateTo: endDate,
          token: authToken,
        });

        if (quote && quote.id) {
          console.log('Real quote created:', quote.id, 'Total:', quote.total);

          // 2. Try creating booking
          try {
            const booking = await createBooking({
              quoteId: quote.id,
              rentalId: car.id,
              dateFrom: startDate,
              dateTo: endDate,
              token: authToken,
            });
            if (booking && booking.id) {
              bookingId = String(booking.id);
              realBooking = true;
              console.log('Real booking created:', bookingId);
            }
          } catch (bookErr) {
            console.log('Booking creation failed (staging may not allow), using quote data:', bookErr.message);
            // Use quote ID as booking reference
            bookingId = 'Q-' + quote.id.substring(0, 8).toUpperCase();
          }
        }
      } catch (err) {
        console.log('API booking failed, using mock:', err.message);
      }
    }

    const bookingData = {
      id: bookingId,
      vehicle: car,
      startDate,
      endDate,
      status: 'pending',
      total,
      protectionPlan: declineProtection ? 'Minimum' : plan.name,
      verified: false,
      realBooking,
    };

    onComplete(bookingData);
  };

  // Sticky trip summary bar at top (Turo-style collapsible)
  const tripSummary = (
    <button onClick={() => setShowBillDetail(!showBillDetail)} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
      background: 'var(--surface)', borderRadius: 'var(--r-md)',
      border: '1px solid var(--border)', padding: '10px 14px', marginBottom: 16,
    }}>
      <img src={car.images[0]} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 8 }} />
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatShort(startDate)} – {formatShort(endDate)}</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{step < 2 ? `${fmt(vehicleCost)}` : `${fmt(total)}`}</div>
      </div>
      <ChevronDown size={18} color="var(--text-tertiary)" style={{ transform: showBillDetail ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
    </button>
  );

  // Progress bar
  const progress = (current) => (
    <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i <= current ? 'var(--text)' : 'var(--surface-3)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );

  // Bottom bar
  const bottomBar = (left, right) => (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      padding: '12px 20px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 20px))',
      background: 'rgba(22,22,22,0.92)', backdropFilter: 'blur(24px)',
      borderTop: '0.5px solid var(--border-light)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {left}
      {right}
    </div>
  );

  const backBtn = (target) => (
    <button onClick={() => target !== undefined ? setStep(target) : onBack} style={{
      fontSize: 16, fontWeight: 500, textDecoration: 'underline', color: 'var(--text)',
    }}>{target !== undefined ? 'Back' : 'Exit'}</button>
  );

  const continueBtn = (onClick, disabled) => (
    <button className="btn-primary" style={{ width: 'auto', padding: '14px 28px' }}
      onClick={onClick} disabled={disabled}>
      Continue
    </button>
  );

  // ========== STEP 0: PROTECTION PACKAGE (mandatory) ==========
  if (step === 0) return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', paddingBottom: 100 }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(22,22,22,0.85)', backdropFilter: 'blur(24px)', borderBottom: '0.5px solid var(--border)' }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Protection package</span>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Car summary */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, padding: '12px 14px', background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
          <img src={car.images[0]} alt="" style={{ width: 70, height: 50, objectFit: 'cover', borderRadius: 8 }} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{car.year} {car.make} {car.model}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatShort(startDate)} – {formatShort(endDate)} · {days} days</div>
          </div>
        </div>

        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 6 }}>Choose your protection</div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
          Protection is required on every RIDE trip. Choose the package that's right for you.
        </p>

        {/* Plan cards side by side */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {protectionPlans.map(p => (
            <button key={p.id} onClick={() => { setPlan(p); setDeclineProtection(false); }} style={{
              flex: 1, textAlign: 'center', padding: p.recommended ? '28px 12px 20px' : '20px 12px',
              background: 'var(--surface)', borderRadius: 'var(--r-md)',
              border: plan.id === p.id ? '2px solid var(--accent)' : '1px solid var(--border)',
              position: 'relative',
            }}>
              {p.recommended && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--bg)', background: 'var(--accent)', padding: '3px 12px', borderRadius: 'var(--r-pill)', whiteSpace: 'nowrap' }}>RECOMMENDED</div>
              )}
              <Shield size={24} color={plan.id === p.id ? 'var(--accent)' : 'var(--text-tertiary)'} style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent-text)' }}>{fmt((p.pricePerDay * days))}</div>
            </button>
          ))}
        </div>

        {/* Included section */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 10 }}>Included:</div>
          {plan.included.map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <span>•</span> {item}
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)' }}>
            <div style={{ flex: 1.2, padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)' }}></div>
            {protectionPlans.map(p => (
              <div key={p.id} style={{ flex: 1, padding: '12px 8px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: plan.id === p.id ? 'var(--accent-text)' : 'var(--text-tertiary)' }}>{p.name.split(' ')[1]}</div>
            ))}
          </div>
          {/* Deductible */}
          <div style={{ display: 'flex', borderBottom: '0.5px solid var(--border)', alignItems: 'center' }}>
            <div style={{ flex: 1.2, padding: '12px 16px', fontSize: 14 }}>Deductible</div>
            {protectionPlans.map(p => (
              <div key={p.id} style={{ flex: 1, padding: '12px 8px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{p.deductible}</div>
            ))}
          </div>
          {/* Feature rows */}
          {[
            { key: 'concierge', label: 'Concierge Services' },
            { key: 'hotline', label: 'Assistance Hotline' },
            { key: 'interruption', label: 'Accident Interruption' },
          ].map(feat => (
            <div key={feat.key} style={{ display: 'flex', borderBottom: '0.5px solid var(--border)', alignItems: 'center' }}>
              <div style={{ flex: 1.2, padding: '12px 16px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                {feat.label}
              </div>
              {protectionPlans.map(p => (
                <div key={p.id} style={{ flex: 1, padding: '12px 8px', textAlign: 'center' }}>
                  {p.features[feat.key] ? (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', margin: '0 auto' }} />
                  ) : (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--surface-3)', margin: '0 auto' }} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <button style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 14, textDecoration: 'underline' }}>
          Learn more about insurance &gt;
        </button>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 20px))', borderTop: '0.5px solid var(--border)', background: 'var(--surface)' }}>
        <button className="btn-primary" onClick={() => setStep(1)}>
          Confirm · {plan.name}
        </button>
      </div>
    </div>
  );

  // ========== STEP 1: BILL ==========
  if (step === 1) return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', paddingBottom: 100 }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(22,22,22,0.85)', backdropFilter: 'blur(24px)', borderBottom: '0.5px solid var(--border)' }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Bill</span>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Trip card */}
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--r-md)',
          border: '1px solid var(--border)', padding: 18, marginBottom: 20,
        }}>
          {/* Vehicle */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
            <img src={car.images[0]} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 10 }} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 600 }}>{car.year} {car.make} {car.model}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{fmt(car.pricePerDay)}/night</div>
            </div>
          </div>

          {/* Dates */}
          <div style={{ borderTop: '0.5px solid var(--border)', padding: '14px 0', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 600, width: 70 }}>Dates</span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{formatDate(startDate)},</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{startTime} AM</div>
              </div>
              <ChevronRight size={16} color="var(--text-tertiary)" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{formatDate(endDate)},</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{endTime} AM</div>
              </div>
            </div>
            <button onClick={() => setShowCalendar(true)} style={{ padding: 4 }}>
              <Edit3 size={16} color="var(--text-secondary)" />
            </button>
          </div>

          {/* Pickup */}
          <div style={{ borderTop: '0.5px solid var(--border)', padding: '14px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Pick up in</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 14 }}>{pickupCity}</span>
                <Edit3 size={14} color="var(--text-secondary)" />
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>Exact location provided after booking</div>
          </div>

          {/* Add-ons */}
          <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Add-ons</span>
              <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>4 available</span>
            </div>

            {[
              { key: 'delivery', icon: <Truck size={16} />, label: car.delivery ? `Delivery` : 'Airport Delivery', price: car.delivery ? car.deliveryFee : 75, desc: 'See details', available: true },
              { key: 'refuel', icon: <Fuel size={16} />, label: 'Refuel', price: 50, desc: 'See details', available: true },
              { key: 'hourlyDropoff', icon: <Clock size={16} />, label: 'Hourly Drop off', price: 10, desc: '$10.00 each · See details', available: true },
              { key: 'unlimitedMiles', icon: <Infinity size={16} />, label: 'Unlimited Mileage', price: 15 * days, desc: `$15.00/day · See details`, available: true },
            ].map(addon => (
              <button key={addon.key} onClick={() => toggleAddon(addon.key)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', marginBottom: 8,
                background: 'var(--surface-2)', borderRadius: 'var(--r-sm)',
                border: addons[addon.key] ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                textAlign: 'left',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 2 }}>{addon.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{fmt(addon.price)} · <span style={{ textDecoration: 'underline' }}>See details</span></div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 4,
                  border: addons[addon.key] ? 'none' : '2px solid var(--border-light)',
                  background: addons[addon.key] ? 'var(--accent)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {addons[addon.key] && <Check size={14} color="var(--bg)" />}
                </div>
              </button>
            ))}
          </div>

          {/* Price breakdown — base cost only, no protection or tax yet */}
          <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 14, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <span>{fmt(car.pricePerDay)} × {days} days</span>
              <span>{fmt(vehicleCost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 6 }}>
              <span>{plan.name} protection</span>
              <span>{fmt(protectionCost)}</span>
            </div>
            {addonsCost > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <span>Add-ons</span>
                <span>{fmt(addonsCost)}</span>
              </div>
            )}
            <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700 }}>
              <span>Before tax</span>
              <span style={{ color: 'var(--accent-text)' }}>{fmt(subtotal)}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>Taxes calculated at checkout</div>
          </div>
        </div>
      </div>

      {bottomBar(
        <div><div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Before tax</div><div style={{ fontSize: 20, fontWeight: 700 }}>{fmt(subtotal)}</div></div>,
        continueBtn(() => setStep(2))
      )}

      {/* Calendar sheet */}
      {showCalendar && (
        <>
          <div className="sheet-backdrop" onClick={() => setShowCalendar(false)} />
          <div className="sheet" style={{ padding: '0 20px 24px' }}>
            <div className="sheet-handle" />
            <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 17, fontWeight: 600 }}>Pick dates</span>
                <button onClick={() => { setStartDate(''); setEndDate(''); }} style={{ fontSize: 14, textDecoration: 'underline', color: 'var(--text-secondary)' }}>Clear</button>
              </div>
              <button onClick={() => setShowCalendar(false)}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6, display: 'block' }}>FROM</label>
                <input className="ios-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6, display: 'block' }}>TO</label>
                <input className="ios-input" type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
            <button className="btn-primary" onClick={() => setShowCalendar(false)}>Confirm</button>
          </div>
        </>
      )}
    </div>
  );

  // ========== STEP 2: HOST QUESTIONS ==========
  if (step === 2) return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', paddingBottom: 100 }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(22,22,22,0.85)', backdropFilter: 'blur(24px)', borderBottom: '0.5px solid var(--border)' }}>
        <button onClick={() => setStep(0)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>Booking</span>
      </div>

      <div style={{ padding: '16px' }}>
        {tripSummary}
        {progress(0)}

        <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Questions from the host</h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
          Below are questions added by the host to better understand your trip.
        </p>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <span style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>Is the driver between 21 and 24, or are they 25 or older?</span>
            <span style={{ color: 'var(--error)', fontSize: 14 }}>*</span>
          </div>

          {['21-24', '25+'].map(opt => (
            <button key={opt} onClick={() => setDriverAge(opt)} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px', marginBottom: 8,
              background: 'var(--surface)', borderRadius: 'var(--r-sm)',
              border: driverAge === opt ? '1.5px solid var(--accent)' : '1px solid var(--border)',
              fontSize: 16,
            }}>
              <span>{opt}</span>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: driverAge === opt ? 'none' : '2px solid var(--border-light)',
                background: driverAge === opt ? 'var(--blue)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {driverAge === opt && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {bottomBar(backBtn(1), continueBtn(() => setStep(3)))}
    </div>
  );

  // ========== STEP 3: OPTIONAL UPGRADES ==========
  if (step === 3) return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', paddingBottom: 100 }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(22,22,22,0.85)', backdropFilter: 'blur(24px)', borderBottom: '0.5px solid var(--border)' }}>
        <button onClick={() => setStep(2)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>Booking</span>
      </div>

      <div style={{ padding: '16px' }}>
        {tripSummary}
        {progress(1)}

        <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Optional upgrades</h2>

        {/* Trip Cancellation Insurance */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Trip Cancellation Insurance</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 4 }}>
            Reimburses nonrefundable payments if your trip is cancelled, delayed, or interrupted for a covered reason.
          </p>
          <button style={{ fontSize: 14, textDecoration: 'underline', color: 'var(--text-secondary)', marginBottom: 16 }}>See full trip cancellation insurance details.</button>

          {/* Recommended option */}
          <button onClick={() => setDeclineProtection(false)} style={{
            width: '100%', textAlign: 'left', padding: 16, marginBottom: 8,
            background: 'var(--surface)', borderRadius: 'var(--r-sm)',
            border: !declineProtection ? '1.5px solid var(--accent)' : '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Add cancellation coverage</span>
                <span style={{ fontSize: 15, fontWeight: 600 }}> for {fmt((plan.pricePerDay * days))}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="badge" style={{ background: 'var(--accent-dim)', color: 'var(--accent-text)', fontSize: 11 }}>Recommended</span>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: !declineProtection ? 'none' : '2px solid var(--border-light)',
                  background: !declineProtection ? 'var(--blue)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {!declineProtection && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                </div>
              </div>
            </div>
            {['Trip cancellation reimbursement', 'Trip interruption coverage', 'Travel delay reimbursement', '10-day free look period'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 5 }}>
                <Check size={15} color="var(--success)" /> {item}
              </div>
            ))}
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>Only available for U.S. residents.</div>
          </button>

          {/* Decline */}
          <button onClick={() => setDeclineProtection(true)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 16, background: 'var(--surface)', borderRadius: 'var(--r-sm)',
            border: declineProtection ? '1.5px solid var(--accent)' : '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 15 }}>Decline cancellation insurance</span>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: declineProtection ? 'none' : '2px solid var(--border-light)',
              background: declineProtection ? 'var(--blue)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {declineProtection && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
            </div>
          </button>
        </div>
      </div>

      {bottomBar(backBtn(2), continueBtn(() => setStep(4)))}
    </div>
  );

  // ========== STEP 4: PAY AND BOOK ==========
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', paddingBottom: 100 }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(22,22,22,0.85)', backdropFilter: 'blur(24px)', borderBottom: '0.5px solid var(--border)' }}>
        <button onClick={() => setStep(3)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>Booking</span>
      </div>

      <div style={{ padding: '16px' }}>
        {tripSummary}
        {progress(2)}

        <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 16 }}>Pay and book</h2>

        {/* Full price breakdown with taxes */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 12 }}>PRICE BREAKDOWN</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <span>{fmt(car.pricePerDay)} × {days} days</span><span>{fmt(vehicleCost)}</span>
          </div>
          {protectionCost > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <span>{declineProtection ? 'No' : plan.name} protection</span><span>{fmt(protectionCost)}</span>
            </div>
          )}
          {addonsCost > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
              <span>Add-ons</span><span>{fmt(addonsCost)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <span>Tax ({car.location.state} {(stateTaxRate * 100).toFixed(1)}%)</span><span>{fmt(taxAmount)}</span>
          </div>
          <div style={{ borderTop: '0.5px solid var(--border)', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
            <span>Total</span><span style={{ color: 'var(--accent-text)' }}>{fmt(total)}</span>
          </div>
        </div>

        {/* Cancellation policy */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)', padding: '2px 8px', background: 'rgba(45,159,111,0.12)', borderRadius: 'var(--r-pill)' }}>Flexible</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Full refund if cancelled 30+ days before trip. 50% refund within 30 days. 24-hour grace period if trip is 7+ days away.
          </div>
        </div>

        {/* Payment method */}
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 10 }}>PAYMENT METHOD</div>

        {/* Saved card */}
        <button onClick={() => setPayMethod('card')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          padding: 16, marginBottom: 8,
          background: 'var(--surface)', borderRadius: 'var(--r-sm)',
          border: payMethod === 'card' ? '1.5px solid var(--accent)' : '1px solid var(--border)',
        }}>
          <div style={{ width: 32, height: 22, background: 'var(--surface-3)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={14} color="var(--text-secondary)" />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>**** **** **** 4242</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Exp: 01/2029</div>
          </div>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: payMethod === 'card' ? 'var(--blue)' : 'transparent',
            border: payMethod === 'card' ? 'none' : '2px solid var(--border-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {payMethod === 'card' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
          </div>
        </button>

        {/* New card */}
        <button onClick={() => setPayMethod('new')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 14,
          padding: 16, marginBottom: 16,
          background: 'var(--surface)', borderRadius: 'var(--r-sm)',
          border: payMethod === 'new' ? '1.5px solid var(--accent)' : '1px solid var(--border)',
        }}>
          <div style={{ width: 32, height: 22, background: 'var(--surface-3)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={14} color="var(--text-tertiary)" />
          </div>
          <span style={{ flex: 1, textAlign: 'left', fontSize: 15 }}>New Credit/Debit Card</span>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: payMethod === 'new' ? 'var(--blue)' : 'transparent',
            border: payMethod === 'new' ? 'none' : '2px solid var(--border-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {payMethod === 'new' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
          </div>
        </button>

        {/* Or pay with */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--border-light)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Or pay with</span>
          <div style={{ flex: 1, height: '0.5px', background: 'var(--border-light)' }} />
        </div>

        {/* Apple Pay */}
        <button style={{
          width: '100%', padding: '14px 24px', borderRadius: 'var(--r-sm)',
          background: 'var(--text)', color: 'var(--bg)',
          fontSize: 17, fontWeight: 600, marginBottom: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Smartphone size={18} /> Apple Pay
        </button>

        {/* PayPal */}
        <button style={{
          width: '100%', padding: '14px 24px', borderRadius: 'var(--r-sm)',
          background: '#0070BA', color: '#fff',
          fontSize: 17, fontWeight: 700, marginBottom: 8,
        }}>
          Pay with PayPal
        </button>

        {/* Pay Later */}
        <button style={{
          width: '100%', padding: '14px 24px', borderRadius: 'var(--r-sm)',
          background: '#003087', color: '#fff',
          fontSize: 16, fontWeight: 600, marginBottom: 20,
        }}>
          Pay Later
        </button>

        {/* Terms */}
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 20 }}>
          By submitting, you agree to the <span style={{ textDecoration: 'underline' }}>Terms of Service</span>, <span style={{ textDecoration: 'underline' }}>Protection Package Terms</span>, and <span style={{ textDecoration: 'underline' }}>Privacy Policy</span>. The host has 24 hours to accept. You won't be charged until the booking is confirmed.
        </p>
      </div>

      {bottomBar(
        backBtn(2),
        <button className="btn-primary" style={{ width: 'auto', padding: '14px 28px' }} onClick={handleSubmit} disabled={processing}>
          {processing ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 16, border: '2px solid rgba(10,10,10,0.3)', borderTopColor: 'var(--bg)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Processing...
            </span>
          ) : `Submit request · ${fmt(total)}`}
        </button>
      )}
    </div>
  );
}
