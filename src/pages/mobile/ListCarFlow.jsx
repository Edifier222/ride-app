import { useState } from 'react';
import { ChevronLeft, Camera, Check, ChevronRight, Plus } from 'lucide-react';

const FEATURES = ['Bluetooth', 'Apple CarPlay', 'Android Auto', 'Backup Camera', 'GPS', 'Heated Seats', 'Leather Seats', 'Sunroof', 'Keyless Entry', 'USB Charger', 'Cruise Control', '4WD'];

export default function ListCarFlow({ onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    year: '', make: '', model: '', type: 'Car', fuelType: 'Gas', seats: '5',
    city: '', state: '', description: '', features: [], photos: [],
    pricePerDay: '', instantBook: true, delivery: false,
  });

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleFeature = (f) => setForm(p => ({ ...p, features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f] }));

  const header = (title) => (
    <div style={{
      padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '0.5px solid var(--separator)',
    }}>
      <button onClick={step === 0 ? onBack : () => setStep(s => s - 1)} style={{
        width: 36, height: 36, borderRadius: '50%', background: 'var(--fill)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><ChevronLeft size={20} /></button>
      <span style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>{title}</span>
      <span style={{ fontSize: 13, color: 'var(--tertiary-label)' }}>{step + 1}/3</span>
    </div>
  );

  // Done
  if (step === 3) return (
    <div style={{ minHeight: '100%', background: 'var(--white)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Check size={36} color="white" />
      </div>
      <div className="text-title2" style={{ marginBottom: 8 }}>Your car is listed!</div>
      <p style={{ fontSize: 15, color: 'var(--secondary-label)', textAlign: 'center', marginBottom: 32 }}>
        {form.year} {form.make} {form.model} is now live in {form.city}.
      </p>
      <button className="btn-primary" style={{ maxWidth: 300 }} onClick={onComplete}>Go to profile</button>
    </div>
  );

  // Step 1: Vehicle info
  if (step === 0) return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      {header('Vehicle details')}
      <div style={{ padding: 16 }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--r-md)', padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label style={{ fontSize: 12, color: 'var(--secondary-label)', display: 'block', marginBottom: 4 }}>Year</label><input className="ios-input" placeholder="2024" value={form.year} onChange={e => update('year', e.target.value)} /></div>
            <div><label style={{ fontSize: 12, color: 'var(--secondary-label)', display: 'block', marginBottom: 4 }}>Make</label><input className="ios-input" placeholder="Toyota" value={form.make} onChange={e => update('make', e.target.value)} /></div>
            <div><label style={{ fontSize: 12, color: 'var(--secondary-label)', display: 'block', marginBottom: 4 }}>Model</label><input className="ios-input" placeholder="Camry" value={form.model} onChange={e => update('model', e.target.value)} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div><label style={{ fontSize: 12, color: 'var(--secondary-label)', display: 'block', marginBottom: 4 }}>City</label><input className="ios-input" placeholder="Phoenix" value={form.city} onChange={e => update('city', e.target.value)} /></div>
            <div><label style={{ fontSize: 12, color: 'var(--secondary-label)', display: 'block', marginBottom: 4 }}>State</label><input className="ios-input" placeholder="AZ" value={form.state} onChange={e => update('state', e.target.value)} /></div>
          </div>
          <label style={{ fontSize: 12, color: 'var(--secondary-label)', display: 'block', marginBottom: 4 }}>Description</label>
          <textarea className="ios-input" rows={3} placeholder="Tell renters about your car..." value={form.description} onChange={e => update('description', e.target.value)} style={{ resize: 'none' }} />
        </div>

        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--secondary-label)', marginBottom: 8 }}>Features</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {FEATURES.map(f => (
            <button key={f} className={`chip ${form.features.includes(f) ? 'active' : ''}`} onClick={() => toggleFeature(f)} style={{ fontSize: 13 }}>
              {form.features.includes(f) && <Check size={12} />} {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px 32px' }}>
        <button className="btn-primary" disabled={!form.year || !form.make || !form.model || !form.city} onClick={() => setStep(1)}>Continue</button>
      </div>
    </div>
  );

  // Step 2: Photos & Pricing
  if (step === 1) return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      {header('Photos & pricing')}
      <div style={{ padding: 16 }}>
        {/* Photo upload */}
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: 'var(--card-bg)', borderRadius: 'var(--r-md)',
          padding: '40px 20px', marginBottom: 16, border: '2px dashed var(--separator)',
          cursor: 'pointer',
        }}>
          <Camera size={36} color="var(--tertiary-label)" style={{ marginBottom: 10 }} />
          <span style={{ fontWeight: 500 }}>Add photos</span>
          <span style={{ fontSize: 13, color: 'var(--secondary-label)' }}>{form.photos.length} uploaded</span>
          <input type="file" accept="image/*" multiple onChange={e => {
            const urls = Array.from(e.target.files || []).map(f => URL.createObjectURL(f));
            update('photos', [...form.photos, ...urls]);
          }} style={{ display: 'none' }} />
        </label>

        {/* Pricing */}
        <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--r-md)', padding: 16, marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: 'var(--secondary-label)', display: 'block', marginBottom: 4 }}>Daily price ($)</label>
          <input className="ios-input" type="number" placeholder="75" value={form.pricePerDay} onChange={e => update('pricePerDay', e.target.value)} style={{ marginBottom: 12 }} />

          <div className="ios-group-item" onClick={() => update('instantBook', !form.instantBook)} style={{ borderBottom: '0.5px solid var(--separator)', cursor: 'pointer' }}>
            <span style={{ flex: 1, fontSize: 15 }}>Instant book</span>
            <div style={{ width: 44, height: 26, borderRadius: 13, background: form.instantBook ? 'var(--success)' : 'var(--fill)', padding: 2, transition: 'background 0.2s' }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', transform: form.instantBook ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
          <div className="ios-group-item" onClick={() => update('delivery', !form.delivery)} style={{ border: 'none', cursor: 'pointer' }}>
            <span style={{ flex: 1, fontSize: 15 }}>Offer delivery</span>
            <div style={{ width: 44, height: 26, borderRadius: 13, background: form.delivery ? 'var(--success)' : 'var(--fill)', padding: 2, transition: 'background 0.2s' }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', transform: form.delivery ? 'translateX(18px)' : 'translateX(0)', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        </div>

        {form.pricePerDay && (
          <div style={{ background: 'var(--black)', color: 'var(--white)', borderRadius: 'var(--r-md)', padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Est. monthly earnings</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>${Math.round(form.pricePerDay * 20 * 0.75)}</div>
            <div style={{ fontSize: 12, color: '#999' }}>After 25% host fee</div>
          </div>
        )}
      </div>

      <div style={{ padding: '0 16px 32px' }}>
        <button className="btn-primary" disabled={!form.pricePerDay} onClick={() => setStep(2)}>Continue</button>
      </div>
    </div>
  );

  // Step 3: Review
  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      {header('Review listing')}
      <div style={{ padding: 16 }}>
        <div className="ios-group" style={{ marginBottom: 20 }}>
          {[
            { label: 'Vehicle', value: `${form.year} ${form.make} ${form.model}` },
            { label: 'Location', value: `${form.city}, ${form.state}` },
            { label: 'Price', value: `$${form.pricePerDay}/day` },
            { label: 'Instant book', value: form.instantBook ? 'Yes' : 'No' },
            { label: 'Delivery', value: form.delivery ? 'Yes' : 'No' },
            { label: 'Features', value: form.features.length > 0 ? form.features.join(', ') : 'None' },
          ].map(item => (
            <div key={item.label} className="ios-group-item">
              <span style={{ fontSize: 15, color: 'var(--secondary-label)' }}>{item.label}</span>
              <span style={{ flex: 1, textAlign: 'right', fontSize: 15, fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={() => setStep(3)}>Publish listing</button>
      </div>
    </div>
  );
}
