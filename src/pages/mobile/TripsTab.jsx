import { useState } from 'react';
import { Calendar, Star, ChevronRight, Clock, CheckCircle, X } from 'lucide-react';
import { guestTrips } from '../../data/mockBookings';

const fmt = (n) => typeof n === "number" ? "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "$" + n;

export default function TripsTab({ lastBooking, onVerify, onSelectTrip }) {
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const trips = [];
  if (lastBooking && lastBooking.vehicle) trips.push(lastBooking);
  guestTrips.forEach(t => { if (t && t.vehicle) trips.push(t); });

  const pending = trips.filter(t => t.status === 'pending');
  const upcoming = trips.filter(t => t.status === 'upcoming');
  const completed = trips.filter(t => t.status === 'completed');

  const TripCard = ({ trip }) => {
    const v = trip.vehicle;
    if (!v) return null;
    const images = v.images || [];
    return (
      <button onClick={() => onSelectTrip(trip)} style={{
        width: '100%', textAlign: 'left',
        background: 'var(--surface)', borderRadius: 'var(--r-md)',
        border: '1px solid var(--border)', overflow: 'hidden',
        marginBottom: 10,
      }}>
        <div style={{ display: 'flex', gap: 14, padding: '14px 16px' }}>
          {images[0] && (
            <img src={images[0]} alt="" style={{ width: 90, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 3 }}>
              {v.year} {v.make} {v.model}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <Calendar size={11} />
              {new Date(trip.startDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <button onClick={(e) => { e.stopPropagation(); setPriceBreakdown(trip); }} style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-text)', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}>
              ${typeof trip.total === 'number' ? trip.total.toFixed(2) : trip.total}
            </button>
          </div>
          <ChevronRight size={18} color="var(--text-tertiary)" style={{ alignSelf: 'center' }} />
        </div>

        {/* Verify prompt for pending */}
        {trip.status === 'pending' && !trip.verified && (
          <div style={{ padding: '0 16px 14px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onVerify(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--warning-bg)', padding: '10px 12px', borderRadius: 'var(--r-sm)',
                fontSize: 13, color: 'var(--warning)',
              }}
            >
              <span>🪪</span>
              <span style={{ flex: 1, textAlign: 'left' }}>Verify ID to confirm trip</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </button>
    );
  };

  const SectionHeader = ({ icon, title, count, color }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '20px 0 10px',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 'var(--r-sm)',
        background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-display)', flex: 1 }}>{title}</span>
      <span style={{
        fontSize: 13, fontWeight: 600, color: 'var(--text-tertiary)',
        background: 'var(--surface-2)', padding: '2px 10px', borderRadius: 'var(--r-pill)',
      }}>{count}</span>
    </div>
  );

  if (trips.length === 0) {
    return (
      <div style={{ minHeight: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <Calendar size={48} color="var(--text-tertiary)" style={{ marginBottom: 16 }} />
        <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 6 }}>No trips yet</div>
        <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Your booked trips will appear here</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(22,22,22,0.85)',
        backdropFilter: 'blur(24px)',
      }}>
        <h1 className="text-large-title">Trips</h1>
      </div>

      <div style={{ padding: '0 16px 20px' }}>

        {/* PENDING */}
        {pending.length > 0 && (
          <div>
            <SectionHeader
              icon={<Clock size={16} color="#D49F3A" />}
              title="Pending"
              count={pending.length}
              color="#D49F3A"
            />
            {pending.map((trip, i) => <TripCard key={trip.id || `p${i}`} trip={trip} />)}
          </div>
        )}

        {/* UPCOMING */}
        {upcoming.length > 0 && (
          <div>
            <SectionHeader
              icon={<CheckCircle size={16} color="#2D9F6F" />}
              title="Upcoming"
              count={upcoming.length}
              color="#2D9F6F"
            />
            {upcoming.map((trip, i) => <TripCard key={trip.id || `u${i}`} trip={trip} />)}
          </div>
        )}

        {/* COMPLETED */}
        {completed.length > 0 && (
          <div>
            <SectionHeader
              icon={<Star size={16} color="#999" />}
              title="Completed"
              count={completed.length}
              color="#999999"
            />
            {completed.map((trip, i) => (
              <div key={trip.id || `c${i}`}>
                <TripCard trip={trip} />
                {trip.review && (
                  <div style={{
                    background: 'var(--surface)', borderRadius: 'var(--r-sm)',
                    border: '1px solid var(--border)', padding: '10px 14px',
                    marginTop: -6, marginBottom: 10,
                  }}>
                    <div style={{ display: 'flex', gap: 1, marginBottom: 4 }}>
                      {Array.from({ length: trip.rating || 0 }).map((_, j) => <Star key={j} size={11} fill="currentColor" color="var(--accent)" />)}
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{trip.review}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price breakdown sheet */}
      {priceBreakdown && (() => {
        const t = priceBreakdown;
        const v = t.vehicle;
        const days = Math.max(Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / 86400000), 1);
        const dailyRate = v.pricePerDay;
        const vehicleCost = dailyRate * days;
        const protectionRate = t.protectionPlan === 'Premier' ? 30 : t.protectionPlan === 'Standard' ? 15 : 0;
        const protectionCost = protectionRate * days;
        const taxRates = { AZ: 0.056, CA: 0.0725, FL: 0.06, TX: 0.0625, NY: 0.08, CO: 0.029, WA: 0.065, NV: 0.0685 };
        const taxRate = taxRates[v.location?.state] || 0.06;
        const subtotal = vehicleCost + protectionCost;
        const tax = Math.round(subtotal * taxRate);
        const total = typeof t.total === 'number' ? t.total : subtotal + tax;

        return (
          <>
            <div className="sheet-backdrop" onClick={() => setPriceBreakdown(null)} />
            <div className="sheet" style={{ padding: '0 20px 24px' }}>
              <div className="sheet-handle" />
              <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Price breakdown</span>
                <button onClick={() => setPriceBreakdown(null)}><X size={20} /></button>
              </div>

              {/* Car info */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--r-sm)' }}>
                {v.images?.[0] && <img src={v.images[0]} alt="" style={{ width: 60, height: 42, objectFit: 'cover', borderRadius: 6 }} />}
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{v.year} {v.make} {v.model}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                    {new Date(t.startDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(t.endDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {days} days
                  </div>
                </div>
              </div>

              {/* Line items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: 'var(--text-secondary)' }}>
                  <span>{fmt(dailyRate)} × {days} days</span>
                  <span>{fmt(vehicleCost)}</span>
                </div>
                {protectionCost > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: 'var(--text-secondary)' }}>
                    <span>{t.protectionPlan} protection</span>
                    <span>{fmt(protectionCost)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: 'var(--text-secondary)' }}>
                  <span>Tax ({v.location?.state || 'State'} {(taxRate * 100).toFixed(1)}%)</span>
                  <span>{fmt(tax)}</span>
                </div>
              </div>

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, paddingTop: 12, borderTop: '0.5px solid var(--border)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent-text)' }}>{fmt(total)}</span>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
