import { useState } from 'react';
import { ChevronLeft, Star, MapPin, Zap, Shield, Clock, Fuel, Users, Gauge, Check, Share2, Heart, ChevronRight } from 'lucide-react';
import { listings } from '../../data/listings';

const fmt = (n) => typeof n === "number" ? "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "$" + n;

export default function CarDetailPage({ carId, searchDates, onBack, onBook, onViewHost }) {
  const car = listings.find(c => c.id === carId);
  const [imgIndex, setImgIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [startDate, setStartDate] = useState(searchDates?.startDate || '');
  const [endDate, setEndDate] = useState(searchDates?.endDate || '');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [returnTime, setReturnTime] = useState('10:00 AM');
  const [showDates, setShowDates] = useState(false);

  if (!car) return null;

  const today = new Date().toISOString().split('T')[0];
  const days = startDate && endDate ? Math.max(Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000), 1) : 3;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', paddingBottom: 100 }}>
      {/* Image carousel */}
      <div style={{ position: 'relative', height: 300, background: '#111' }}>
        <img src={car.images[imgIndex]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

        {/* Top bar — z-index above swipe areas */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
        }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(22,22,22,0.85)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}><ChevronLeft size={20} /></button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(22,22,22,0.85)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}><Share2 size={16} /></button>
            <button onClick={() => setLiked(!liked)} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(22,22,22,0.85)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={16} fill={liked ? '#ff3b30' : 'none'} stroke={liked ? '#ff3b30' : '#000'} />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 6,
        }}>
          {car.images.map((_, i) => (
            <button key={i} onClick={() => setImgIndex(i)} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.5)',
            }} />
          ))}
        </div>

        {/* Photo counter */}
        <div style={{
          position: 'absolute', bottom: 12, right: 14,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          padding: '4px 10px', borderRadius: 'var(--r-pill)',
          fontSize: 12, fontWeight: 600, color: '#fff',
        }}>
          {imgIndex + 1} of {car.images.length}
        </div>

        {/* Swipe areas */}
        <button onClick={() => setImgIndex(i => (i - 1 + car.images.length) % car.images.length)}
          style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%' }} />
        <button onClick={() => setImgIndex(i => (i + 1) % car.images.length)}
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '30%' }} />
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* Title */}
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 10, textAlign: 'center' }}>
          {car.year} {car.make} {car.model}
        </h1>

        {/* Quick specs row — like the live app */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 0,
          marginBottom: 16, borderBottom: '0.5px solid var(--border)', paddingBottom: 16,
        }}>
          {[
            { icon: <Fuel size={18} />, label: car.fuelType },
            { icon: <Users size={18} />, label: `${car.seats} seats` },
            { icon: '🔑', label: 'Keyless' },
            { icon: <Shield size={18} />, label: '25+' },
          ].map((spec, i) => (
            <div key={spec.label} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < 3 ? '0.5px solid var(--border)' : 'none',
              padding: '0 8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4, color: 'var(--text-secondary)' }}>
                {typeof spec.icon === 'string' ? <span style={{ fontSize: 18 }}>{spec.icon}</span> : spec.icon}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{spec.label}</div>
            </div>
          ))}
        </div>

        {/* Vehicle type label */}
        <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 16 }}>
          {car.type.charAt(0).toUpperCase() + car.type.slice(1)}
        </div>

        {/* AI Quick summary */}
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--r-md)',
          border: '1px solid var(--border)', padding: 16, marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Quick summary</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              ✨ AI generated
            </span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            • {car.description.split('.')[0]}.
            {car.fuelType === 'Electric' && <><br/>• Zero emissions, perfect for eco-conscious drivers.</>}
            {car.instantBook && <><br/>• Instant booking available — no waiting for approval.</>}
            {car.delivery && <><br/>• Delivery available for ${car.deliveryFee}.</>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, fontSize: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
            <Star size={14} fill="currentColor" /> {car.rating}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>{car.trips} trips</span>
          <span style={{ color: 'var(--secondary-label)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={12} /> {car.location.city}, {car.location.state}
          </span>
        </div>

        {/* Specs grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
          marginBottom: 20,
        }}>
          {[
            { icon: <Fuel size={16} />, label: car.fuelType },
            { icon: <Users size={16} />, label: `${car.seats} seats` },
            { icon: <Gauge size={16} />, label: car.transmission === 'Automatic' ? 'Auto' : 'Manual' },
            { icon: <MapPin size={16} />, label: `${car.milesIncluded} mi` },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--fill)', borderRadius: 'var(--r-sm)',
              padding: '10px 8px', textAlign: 'center',
            }}>
              <div style={{ color: 'var(--secondary-label)', marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ borderTop: '0.5px solid var(--border-light)', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Description</div>
          <p style={{ fontSize: 15, color: 'var(--secondary-label)', lineHeight: 1.6 }}>{car.description}</p>
        </div>

        {/* Features */}
        <div style={{ borderTop: '0.5px solid var(--border-light)', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>Features</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            {car.features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <Check size={15} color="var(--success)" /> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Host */}
        <button onClick={() => onViewHost && onViewHost(car.host)} style={{ display: 'block', width: '100%', textAlign: 'left', borderTop: '0.5px solid var(--border-light)', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Hosted by {car.host.name}</span>
            <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>View profile →</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <img src={car.host.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
            <div>
              <div style={{ display: 'flex', gap: 10, fontSize: 13, marginBottom: 3 }}>
                <span><Star size={12} fill="currentColor" style={{ verticalAlign: -1 }} /> {car.host.rating}</span>
                <span>{car.host.trips} trips</span>
                <span>Joined {car.host.joined}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--secondary-label)' }}>
                Responds {car.host.responseTime}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{car.host.bio}</p>
        </button>

        {/* Reviews */}
        <div style={{ borderTop: '0.5px solid var(--border-light)', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>Reviews</div>
          {car.reviews.map((r, i) => (
            <div key={i} style={{
              background: 'var(--fill)', borderRadius: 'var(--r-sm)',
              padding: 12, marginBottom: 8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>{r.author}</span>
                <div style={{ display: 'flex', gap: 1 }}>
                  {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={11} fill="currentColor" />)}
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--secondary-label)', lineHeight: 1.4 }}>{r.text}</p>
            </div>
          ))}
        </div>

        {/* Mileage */}
        <div style={{ borderTop: '0.5px solid var(--border-light)', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>Mileage</div>
          <div className="ios-group">
            <div className="ios-group-item">
              <MapPin size={16} color="var(--text-secondary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15 }}>{car.milesIncluded} miles/day included</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{startDate && endDate ? `${car.milesIncluded * days} miles total for your trip` : 'Included in the daily rate'}</div>
              </div>
            </div>
            <div className="ios-group-item">
              <span style={{ fontSize: 15, flex: 1 }}>Extra miles</span>
              <span style={{ fontSize: 15, fontWeight: 500 }}>${car.extraMileRate}/mi</span>
            </div>
          </div>
        </div>

        {/* Cancellation policy — based on Outdoorsy V2 standardized */}
        <div style={{ borderTop: '0.5px solid var(--border-light)', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>Cancellation policy</div>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--success)', padding: '3px 10px', background: 'rgba(45,159,111,0.12)', borderRadius: 'var(--r-pill)' }}>Flexible</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 500 }}>Free cancellation</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>Full refund if cancelled 30+ days before trip</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warning)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 500 }}>50% refund</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>If cancelled less than 30 days before trip</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-tertiary)', marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 500 }}>Grace period</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>24-hour free cancellation if trip is 7+ days away</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 12, lineHeight: 1.5 }}>
              50% deposit required at booking. Refund applies to the trip cost minus the service fee.
            </div>
          </div>
        </div>

        {/* Host rules */}
        <div style={{ borderTop: '0.5px solid var(--border-light)', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>Host rules</div>
          <div className="ios-group">
            {[
              { icon: '🚭', rule: 'No smoking', desc: 'Smoking is not permitted in the vehicle' },
              { icon: '🐾', rule: 'No pets', desc: 'Pets are not allowed without prior approval' },
              { icon: '⛽', rule: 'Return with same fuel level', desc: 'Please refuel before returning' },
              { icon: '🧹', rule: 'Keep it clean', desc: 'Return the vehicle in the same condition' },
              { icon: '📍', rule: 'Stay within state', desc: 'Out-of-state travel requires host approval' },
              { icon: '⏰', rule: 'On-time return', desc: 'Late returns may incur additional fees' },
            ].map(item => (
              <div key={item.rule} className="ios-group-item" style={{ padding: '12px 16px' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{item.rule}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protection */}
        <div style={{ borderTop: '0.5px solid var(--border-light)', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>Protection</div>
          <div className="ios-group">
            <div className="ios-group-item">
              <Shield size={16} color="var(--accent)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15 }}>Protection required</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Choose Auto Basic ($25/day) or Auto Essential ($40/day) at checkout.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom booking bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(22,22,22,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: '0.5px solid var(--border-light)',
        padding: '12px 16px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 20px))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 50,
      }}>
        <div>
          {startDate && endDate ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-text)' }}>${car.pricePerDay * days}</span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>before tax</span>
              </div>
              <button onClick={() => setShowDates(true)} style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                {new Date(startDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(endDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {days}d · <span style={{ textDecoration: 'underline' }}>Edit</span>
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontSize: 22, fontWeight: 700 }}>${car.pricePerDay}</span>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>/day</span>
              </div>
              <button onClick={() => setShowDates(true)} style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'underline' }}>
                Select dates
              </button>
            </>
          )}
        </div>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '14px 28px' }}
          onClick={() => {
            if (!startDate || !endDate) {
              setShowDates(true);
            } else {
              onBook(car, { startDate, endDate });
            }
          }}
        >
          {startDate && endDate ? 'Continue' : 'Select dates'}
        </button>
      </div>

      {/* Date picker sheet — visual calendar */}
      {showDates && (() => {
        const generateMonth = (year, month) => {
          const firstDay = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const d = [];
          for (let i = 0; i < firstDay; i++) d.push(null);
          for (let i = 1; i <= daysInMonth; i++) d.push(i);
          return d;
        };
        const handleDayTap = (dateStr) => {
          if (!startDate || (startDate && endDate)) {
            setStartDate(dateStr);
            setEndDate('');
          } else {
            if (dateStr < startDate) {
              setStartDate(dateStr);
              setEndDate('');
            } else {
              setEndDate(dateStr);
            }
          }
        };
        const isInRange = (dateStr) => startDate && endDate && dateStr >= startDate && dateStr <= endDate;

        return (
          <>
            <div className="sheet-backdrop" onClick={() => setShowDates(false)} />
            <div className="sheet" style={{ padding: '0 16px 20px', maxHeight: '80vh' }}>
              <div className="sheet-handle" />
              <div style={{ padding: '16px 0 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Trip dates</span>
                {(startDate || endDate) && (
                  <button onClick={() => { setStartDate(''); setEndDate(''); }} style={{ fontSize: 13, color: 'var(--accent)' }}>Clear</button>
                )}
              </div>

              {/* Selected dates summary */}
              <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', marginBottom: 12, overflow: 'hidden' }}>
                <div style={{ flex: 1, padding: '10px 14px', textAlign: 'center', borderRight: '0.5px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: 2 }}>PICK-UP</div>
                  <div style={{ fontSize: 15, fontWeight: startDate ? 600 : 400, color: startDate ? 'var(--text)' : 'var(--text-tertiary)' }}>
                    {startDate ? new Date(startDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Tap a date'}
                  </div>
                </div>
                <div style={{ flex: 1, padding: '10px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: 2 }}>RETURN</div>
                  <div style={{ fontSize: 15, fontWeight: endDate ? 600 : 400, color: endDate ? 'var(--text)' : 'var(--text-tertiary)' }}>
                    {endDate ? new Date(endDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : startDate ? 'Tap return' : '—'}
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div style={{ overflowY: 'auto', maxHeight: '50vh' }}>
                {[0, 1].map(offset => {
                  const now = new Date();
                  const actualYear = now.getFullYear() + Math.floor((now.getMonth() + offset) / 12);
                  const actualMonth = (now.getMonth() + offset) % 12;
                  const monthName = new Date(actualYear, actualMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  const monthDays = generateMonth(actualYear, actualMonth);
                  return (
                    <div key={offset} style={{ marginBottom: 16 }}>
                      <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{monthName}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 4 }}>
                        {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', padding: '2px 0' }}>{d}</div>)}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
                        {monthDays.map((day, i) => {
                          if (!day) return <div key={i} />;
                          const dateStr = `${actualYear}-${String(actualMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const isPast = dateStr < today;
                          const isStart = dateStr === startDate;
                          const isEnd = dateStr === endDate;
                          const inRange = isInRange(dateStr);
                          const isSelected = isStart || isEnd;
                          return (
                            <button key={i} disabled={isPast} onClick={() => !isPast && handleDayTap(dateStr)} style={{
                              padding: '7px 0', fontSize: 14, minHeight: 34, fontWeight: isSelected ? 700 : 400,
                              color: isPast ? 'var(--text-tertiary)' : isSelected ? 'var(--bg)' : 'var(--text)',
                              background: isSelected ? 'var(--accent)' : inRange ? 'var(--accent-dim)' : 'transparent',
                              borderRadius: isStart && !isEnd ? '50% 0 0 50%' : isEnd && !isStart ? '0 50% 50% 0' : isSelected ? '50%' : 0,
                              opacity: isPast ? 0.3 : 1,
                            }}>{day}</button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time pickers + Price preview — show after dates selected */}
              {startDate && endDate && (
                <>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: 4 }}>PICK-UP TIME</div>
                      <select value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="ios-input" style={{ fontSize: 15 }}>
                        {['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: 4 }}>RETURN TIME</div>
                      <select value={returnTime} onChange={e => setReturnTime(e.target.value)} className="ios-input" style={{ fontSize: 15 }}>
                        {['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: 12, marginBottom: 12, fontSize: 15, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{fmt(car.pricePerDay)}/day × {days} days</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent-text)' }}>{fmt(car.pricePerDay * days)}</span>
                  </div>
                </>
              )}
              <button className="btn-primary" onClick={() => setShowDates(false)} disabled={!startDate || !endDate}>
                {startDate && endDate ? 'Confirm' : !startDate ? 'Select pick-up date' : 'Select return date'}
              </button>
            </div>
          </>
        );
      })()}
    </div>
  );
}
