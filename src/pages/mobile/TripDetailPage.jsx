import { useState } from 'react';
import { ChevronLeft, MapPin, Calendar, Shield, Star, MessageSquare, Phone, ChevronRight, CheckCircle, Clock, X, AlertTriangle, FileText, Edit3, DollarSign } from 'lucide-react';
import { protectionPlans } from '../../data/listings';

const fmt = (n) => typeof n === "number" ? "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "$" + n;

export default function TripDetailPage({ trip, onBack, onVerify, onMessage, onViewCar }) {
  const v = trip?.vehicle;
  if (!v) return <div style={{ padding: 40, textAlign: 'center' }}><button onClick={onBack} className="btn-primary">Back</button></div>;
  const isPending = trip.status === 'pending';
  const isUpcoming = trip.status === 'upcoming';
  const isCompleted = trip.status === 'completed';

  const [showCancel, setShowCancel] = useState(false);
  const [showModifyProtection, setShowModifyProtection] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(trip.protectionPlan || 'Standard');
  const [cancelled, setCancelled] = useState(false);

  // Dynamic countdown
  const getCountdown = () => {
    const start = new Date(trip.startDate + 'T10:00:00');
    const now = new Date();
    const diff = start - now;
    if (diff <= 0) return 'Trip has started';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} and ${hours} hour${hours > 1 ? 's' : ''} until pickup`;
    return `${hours} hour${hours > 1 ? 's' : ''} until pickup`;
  };

  // Cancellation policy logic
  const getDaysUntilTrip = () => {
    const start = new Date(trip.startDate + 'T10:00:00');
    return Math.ceil((start - new Date()) / 86400000);
  };
  const daysUntil = getDaysUntilTrip();
  const refundPercent = daysUntil >= 30 ? 100 : daysUntil >= 1 ? 50 : 0;
  const refundAmount = Math.round(trip.total * (refundPercent / 100));

  const statusConfig = {
    pending: { label: 'Waiting on owner', bg: 'var(--warning-bg)', color: 'var(--warning)', icon: <Clock size={14} /> },
    upcoming: { label: 'Confirmed', bg: 'var(--success-bg)', color: 'var(--success)', icon: <CheckCircle size={14} /> },
    completed: { label: 'Completed', bg: 'var(--surface-2)', color: 'var(--text-tertiary)', icon: null },
  };
  const s = statusConfig[trip.status] || statusConfig.pending;

  if (cancelled) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--error-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <X size={36} color="var(--error)" />
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Trip cancelled</div>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 8, maxWidth: 300 }}>
          Your booking for the {v.year} {v.make} {v.model} has been cancelled.
        </p>
        <p style={{ fontSize: 15, color: 'var(--accent-text)', fontWeight: 600, marginBottom: 24 }}>Refund: ${refundAmount}</p>
        <button className="btn-primary" style={{ maxWidth: 280 }} onClick={onBack}>Back to trips</button>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(22,22,22,0.85)', backdropFilter: 'blur(24px)', borderBottom: '0.5px solid var(--border)' }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Trip details</span>
      </div>

      <div style={{ padding: 16 }}>
        {/* Status + countdown */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 'var(--r-pill)', background: s.bg, color: s.color, fontSize: 13, fontWeight: 600 }}>
            {s.icon} {s.label}
          </span>
          {(isUpcoming || isPending) && (
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>
              <Clock size={13} style={{ verticalAlign: -2 }} /> {getCountdown()}
            </div>
          )}
        </div>

        {/* Vehicle card */}
        <button onClick={onViewCar} style={{ width: '100%', textAlign: 'left', background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 16 }}>
          <img src={v.images[0]} alt="" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{v.year} {v.make} {v.model}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}><MapPin size={12} style={{ verticalAlign: -1 }} /> {v.location.city}, {v.location.state}</div>
            </div>
            <ChevronRight size={18} color="var(--text-tertiary)" />
          </div>
        </button>

        {/* Booking details */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', padding: '14px 16px 0' }}>BOOKING DETAILS</div>
          {[
            { icon: <Calendar size={16} />, label: 'Dates', value: `${new Date(trip.startDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(trip.endDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` },
            { icon: <Clock size={16} />, label: 'Pick-up time', value: '10:00 AM' },
            { icon: <MapPin size={16} />, label: 'Pick-up', value: `${v.location.city}, ${v.location.state}` },
            { icon: <Shield size={16} />, label: 'Protection', value: trip.protectionPlan, action: (isUpcoming || isPending) ? () => setShowModifyProtection(true) : null },
            { icon: <DollarSign size={16} />, label: 'Total', value: fmt(trip.total), bold: true },
          ].map((item, i) => (
            <button key={item.label} onClick={item.action} disabled={!item.action} style={{
              width: '100%', display: 'flex', alignItems: 'center', padding: '14px 16px',
              borderTop: i > 0 ? '0.5px solid var(--border)' : 'none',
            }}>
              <span style={{ color: 'var(--text-secondary)', marginRight: 12 }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 15, textAlign: 'left' }}>{item.label}</span>
              <span style={{ fontSize: 15, fontWeight: item.bold ? 700 : 500, color: item.bold ? 'var(--accent-text)' : 'var(--text)' }}>{item.value}</span>
              {item.action && <Edit3 size={14} color="var(--accent)" style={{ marginLeft: 8 }} />}
            </button>
          ))}
          <div style={{ padding: '8px 16px 14px', fontSize: 12, color: 'var(--text-tertiary)' }}>
            Booking #{trip.id}
          </div>
        </div>

        {/* Actions for active trips */}
        {(isPending || isUpcoming) && (
          <>
            {/* Verify ID */}
            {!trip.verified && (
              <button onClick={onVerify} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 10, textAlign: 'left' }}>
                <span style={{ fontSize: 24 }}>🪪</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Verify your ID</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Required before your trip</div>
                </div>
                <ChevronRight size={16} color="var(--text-tertiary)" />
              </button>
            )}

            {/* Cancellation policy */}
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Cancellation policy</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)', padding: '2px 8px', background: 'var(--success-bg)', borderRadius: 'var(--r-pill)' }}>Flexible</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                {daysUntil >= 30
                  ? '✓ Full refund if cancelled now (30+ days before trip)'
                  : daysUntil >= 1
                    ? `⚠️ 50% refund if cancelled now (${daysUntil} days before trip)`
                    : '✗ No refund available (trip starts within 24h)'}
              </div>
              <button onClick={() => setShowCancel(true)} style={{ fontSize: 14, color: 'var(--error)', fontWeight: 500, textDecoration: 'underline' }}>
                Cancel this trip
              </button>
            </div>
          </>
        )}

        {/* Host info */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 12 }}>HOST</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <img src={v.host.avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{v.host.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}><Star size={11} fill="currentColor" color="var(--accent)" style={{ verticalAlign: -1 }} /> {v.host.rating} · {v.host.trips} trips</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onMessage} className="btn-secondary btn-sm" style={{ flex: 1 }}><MessageSquare size={15} /> Message</button>
            <button className="btn-secondary btn-sm" style={{ flex: 1 }}><Phone size={15} /> Call</button>
          </div>
        </div>

        {/* Timeline for pending */}
        {isPending && (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Booking status</div>
            {[
              { icon: '✅', label: 'REQUEST SENT', time: '11:27 AM · Apr 3', desc: "You'll know within 24 hours.", done: true },
              { icon: '⏳', label: 'BOOKING CONFIRMED', desc: 'Waiting for host.', done: false },
              { icon: '🚗', label: 'TRIP STARTS', desc: '', done: false },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < 2 ? 14 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  {i < 2 && <div style={{ width: 1.5, flex: 1, background: item.done ? 'var(--success)' : 'var(--border-light)', marginTop: 4 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', color: item.done ? 'var(--success)' : 'var(--text-tertiary)' }}>{item.label}</span>
                    {item.time && <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.time}</span>}
                  </div>
                  {item.desc && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{item.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed trip — rental details + review */}
        {isCompleted && (
          <>
            {/* Rental contract/receipt */}
            <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', padding: '14px 16px 0' }}>RECEIPT</div>
              {[
                { label: `${fmt(v.pricePerDay).replace('$','')}/day × ${Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000)} days`, value: fmt(v.pricePerDay * Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000)) },
                { label: 'Protection (' + trip.protectionPlan + ')', value: trip.protectionPlan === 'Standard' ? '$45' : trip.protectionPlan === 'Premier' ? '$90' : '$0' },
                { label: 'Service fee', value: fmt(Math.round(trip.total * 0.12)) },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>{item.label}</span><span>{item.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderTop: '0.5px solid var(--border)', fontSize: 16, fontWeight: 700 }}>
                <span>Total charged</span><span style={{ color: 'var(--accent-text)' }}>{fmt(trip.total)}</span>
              </div>
            </div>

            {/* Download receipt */}
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: 16, textAlign: 'left' }}>
              <FileText size={18} color="var(--text-secondary)" />
              <span style={{ flex: 1, fontSize: 15 }}>Download rental agreement</span>
              <ChevronRight size={16} color="var(--text-tertiary)" />
            </button>

            {/* Review */}
            {trip.review ? (
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Your review</div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                  {Array.from({ length: trip.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" color="var(--accent)" />)}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{trip.review}</p>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>{trip.endDate}</p>
              </div>
            ) : (
              <button className="btn-primary" style={{ marginBottom: 16 }}>
                <Star size={16} /> Leave a review
              </button>
            )}
          </>
        )}
      </div>

      {/* ===== CANCEL MODAL ===== */}
      {showCancel && (
        <>
          <div className="sheet-backdrop" onClick={() => setShowCancel(false)} />
          <div className="sheet" style={{ padding: '0 20px 24px' }}>
            <div className="sheet-handle" />
            <div style={{ padding: '20px 0 6px', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--error-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <AlertTriangle size={24} color="var(--error)" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 6 }}>Cancel this trip?</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {v.year} {v.make} {v.model} · {new Date(trip.startDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: 16, margin: '16px 0' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 10 }}>REFUND ESTIMATE</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Trip total</span>
                <span>{fmt(trip.total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Refund rate ({daysUntil}d before trip)</span>
                <span>{refundPercent}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, paddingTop: 8, borderTop: '0.5px solid var(--border)' }}>
                <span>Your refund</span>
                <span style={{ color: refundPercent > 0 ? 'var(--success)' : 'var(--error)' }}>${refundAmount}</span>
              </div>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5, marginBottom: 16 }}>
              {refundPercent === 100 && 'Full refund. Free cancellation since your trip is 30+ days away.'}
              {refundPercent === 50 && `50% refund. Your trip is ${daysUntil} days away (under 30-day cutoff). Service fee is non-refundable.`}
              {refundPercent === 0 && 'No refund available. Trip starts within 24 hours.'}
            </div>

            <button onClick={() => setCancelled(true)} style={{
              width: '100%', padding: 16, borderRadius: 'var(--r-md)',
              background: 'var(--error)', color: '#fff', fontSize: 16, fontWeight: 600,
              marginBottom: 8,
            }}>
              Cancel trip · Refund ${refundAmount}
            </button>
            <button onClick={() => setShowCancel(false)} className="btn-secondary">Keep my trip</button>
          </div>
        </>
      )}

      {/* ===== MODIFY PROTECTION MODAL ===== */}
      {showModifyProtection && (
        <>
          <div className="sheet-backdrop" onClick={() => setShowModifyProtection(false)} />
          <div className="sheet" style={{ padding: '0 20px 24px', maxHeight: '80vh' }}>
            <div className="sheet-handle" />
            <div style={{ padding: '20px 0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Change protection</span>
              <button onClick={() => setShowModifyProtection(false)}><X size={20} /></button>
            </div>

            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Currently: <strong style={{ color: 'var(--text)' }}>{selectedPlan}</strong>
            </div>

            {protectionPlans.map(plan => (
              <button key={plan.id} onClick={() => setSelectedPlan(plan.name)} style={{
                width: '100%', textAlign: 'left', padding: 16, marginBottom: 8,
                background: 'var(--surface-2)', borderRadius: 'var(--r-sm)',
                border: selectedPlan === plan.name ? '1.5px solid var(--accent)' : '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{plan.name}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-text)' }}>{plan.pricePerDay === 0 ? 'Free' : `$${plan.pricePerDay}/day`}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{plan.deductible} deductible · {plan.coverage}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{plan.details.slice(0, 2).join(' · ')}</div>
              </button>
            ))}

            <button onClick={() => setShowModifyProtection(false)} className="btn-primary" style={{ marginTop: 8 }}>
              Save changes
            </button>
          </div>
        </>
      )}
    </div>
  );
}
