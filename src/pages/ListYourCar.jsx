import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, MapPin, DollarSign, Camera, Check, ChevronRight, ChevronLeft, Upload, Plus } from 'lucide-react';

const STEPS = ['Vehicle', 'Photos', 'Pricing', 'Review'];
const CAR_TYPES = ['Car', 'SUV', 'Truck'];
const FUEL_TYPES = ['Gas', 'Electric', 'Hybrid'];
const FEATURES_LIST = [
  'Bluetooth', 'Apple CarPlay', 'Android Auto', 'Backup Camera', 'GPS Navigation',
  'Heated Seats', 'Leather Seats', 'Sunroof', 'Keyless Entry', 'USB Charger',
  'Cruise Control', 'Lane Assist', '4WD', 'Tow Package', 'Roof Rack',
];

export default function ListYourCar() {
  const { user, openLogin } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    year: '', make: '', model: '', type: 'Car', fuelType: 'Gas',
    transmission: 'Automatic', seats: '5', doors: '4',
    city: '', state: '',
    description: '', features: [],
    photos: [],
    pricePerDay: '', milesIncluded: '200',
    delivery: false, deliveryFee: '',
    instantBook: false,
  });

  if (!user) { openLogin(); navigate('/'); return null; }

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleFeature = (f) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter(x => x !== f)
        : [...prev.features, f],
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map(f => URL.createObjectURL(f));
    setForm(prev => ({ ...prev, photos: [...prev.photos, ...urls] }));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(4); // done
    }, 2000);
  };

  const canNext = () => {
    if (step === 0) return form.year && form.make && form.model && form.city && form.state;
    if (step === 1) return true; // photos optional for PoC
    if (step === 2) return form.pricePerDay;
    return true;
  };

  // Success state
  if (step === 4) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--chip-gray)' }}>
        <div className="container-narrow" style={{ padding: 'var(--space-16) var(--space-6)', textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-6)',
          }}>
            <Check size={36} color="white" />
          </div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Your car is listed!</h1>
          <p style={{ color: 'var(--body-gray)', fontSize: 16, marginBottom: 'var(--space-8)', maxWidth: 400, margin: '0 auto var(--space-8)' }}>
            Your {form.year} {form.make} {form.model} is now live on RIDE. Renters in {form.city} can find and book it.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/host')}>Go to dashboard</button>
            <button className="btn btn-primary" onClick={() => { setStep(0); setForm({ ...form, year: '', make: '', model: '' }); }}>List another car</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--chip-gray)' }}>
      <div className="container-narrow" style={{ padding: 'var(--space-10) var(--space-6)' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-8)' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ flex: 1 }}>
              <div style={{ height: 3, borderRadius: 2, background: i <= step ? 'var(--black)' : 'var(--border-light)', marginBottom: 6, transition: 'background 0.3s' }} />
              <span style={{ fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--black)' : 'var(--muted-gray)' }}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step 0: Vehicle info */}
        {step === 0 && (
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Tell us about your car</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div className="input-group"><label>Year</label><input type="number" placeholder="2024" value={form.year} onChange={e => update('year', e.target.value)} /></div>
              <div className="input-group"><label>Make</label><input type="text" placeholder="Toyota" value={form.make} onChange={e => update('make', e.target.value)} /></div>
              <div className="input-group"><label>Model</label><input type="text" placeholder="Camry" value={form.model} onChange={e => update('model', e.target.value)} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div className="input-group">
                <label>Type</label>
                <select value={form.type} onChange={e => update('type', e.target.value)}>
                  {CAR_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Fuel type</label>
                <select value={form.fuelType} onChange={e => update('fuelType', e.target.value)}>
                  {FUEL_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Seats</label>
                <input type="number" value={form.seats} onChange={e => update('seats', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Doors</label>
                <input type="number" value={form.doors} onChange={e => update('doors', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              <div className="input-group"><label>City</label><input type="text" placeholder="Phoenix" value={form.city} onChange={e => update('city', e.target.value)} /></div>
              <div className="input-group"><label>State</label><input type="text" placeholder="AZ" value={form.state} onChange={e => update('state', e.target.value)} /></div>
            </div>
            <div className="input-group" style={{ marginBottom: 'var(--space-5)' }}>
              <label>Description</label>
              <textarea rows={3} placeholder="Tell renters about your car..." value={form.description} onChange={e => update('description', e.target.value)} style={{ padding: '12px 16px', border: '1px solid var(--black)', borderRadius: 'var(--radius-sm)', resize: 'vertical' }} />
            </div>
            <label style={{ fontSize: 14, fontWeight: 500, color: 'var(--body-gray)', marginBottom: 8, display: 'block' }}>Features</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FEATURES_LIST.map(f => (
                <button key={f} className={`btn btn-chip ${form.features.includes(f) ? 'active' : ''}`} style={{ fontSize: 13, padding: '6px 12px' }} onClick={() => toggleFeature(f)}>
                  {form.features.includes(f) && <Check size={12} />} {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Photos */}
        {step === 1 && (
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
            <h2 style={{ marginBottom: 8 }}>Add photos</h2>
            <p style={{ color: 'var(--body-gray)', marginBottom: 'var(--space-6)' }}>Great photos help your car get booked. Add at least 3 photos.</p>

            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: '2px dashed var(--border-light)', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-10)', cursor: 'pointer', marginBottom: 'var(--space-5)',
              background: 'var(--chip-gray)',
            }}>
              <Camera size={40} color="var(--muted-gray)" style={{ marginBottom: 12 }} />
              <span style={{ fontWeight: 500, marginBottom: 4 }}>Upload photos</span>
              <span style={{ fontSize: 13, color: 'var(--body-gray)' }}>JPG, PNG up to 10MB each</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>

            {form.photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                {form.photos.map((url, i) => (
                  <div key={i} style={{ position: 'relative', paddingBottom: '66%', borderRadius: 8, overflow: 'hidden' }}>
                    <img src={url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => setForm(prev => ({ ...prev, photos: prev.photos.filter((_, j) => j !== i) }))}
                      style={{
                        position: 'absolute', top: 6, right: 6, width: 24, height: 24,
                        borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                      }}
                    >&times;</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Pricing */}
        {step === 2 && (
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Set your price</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <div className="input-group">
                <label>Daily price ($)</label>
                <input type="number" placeholder="75" value={form.pricePerDay} onChange={e => update('pricePerDay', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Miles included per day</label>
                <input type="number" value={form.milesIncluded} onChange={e => update('milesIncluded', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              <label style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-4)', background: 'var(--chip-gray)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>Instant book</div>
                  <div style={{ fontSize: 12, color: 'var(--body-gray)' }}>Renters can book without waiting for approval</div>
                </div>
                <input type="checkbox" checked={form.instantBook} onChange={e => update('instantBook', e.target.checked)} style={{ width: 20, height: 20, accentColor: 'var(--black)' }} />
              </label>

              <label style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--space-4)', background: 'var(--chip-gray)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>Offer delivery</div>
                  <div style={{ fontSize: 12, color: 'var(--body-gray)' }}>Deliver the car to the renter's location</div>
                </div>
                <input type="checkbox" checked={form.delivery} onChange={e => update('delivery', e.target.checked)} style={{ width: 20, height: 20, accentColor: 'var(--black)' }} />
              </label>
            </div>

            {form.delivery && (
              <div className="input-group" style={{ marginBottom: 'var(--space-5)' }}>
                <label>Delivery fee ($)</label>
                <input type="number" placeholder="25" value={form.deliveryFee} onChange={e => update('deliveryFee', e.target.value)} />
              </div>
            )}

            {form.pricePerDay && (
              <div style={{ background: 'var(--chip-gray)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)' }}>
                <div style={{ fontSize: 13, color: 'var(--body-gray)', marginBottom: 4 }}>Estimated monthly earnings (20 days booked)</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>${Math.round(form.pricePerDay * 20 * 0.75)}</div>
                <div style={{ fontSize: 12, color: 'var(--body-gray)' }}>After RIDE's 25% host fee</div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: 'var(--space-6)' }}>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Review your listing</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { label: 'Vehicle', value: `${form.year} ${form.make} ${form.model}` },
                { label: 'Type', value: `${form.type} · ${form.fuelType} · ${form.seats} seats` },
                { label: 'Location', value: `${form.city}, ${form.state}` },
                { label: 'Price', value: `$${form.pricePerDay}/day` },
                { label: 'Miles included', value: `${form.milesIncluded}/day` },
                { label: 'Features', value: form.features.join(', ') || 'None selected' },
                { label: 'Photos', value: `${form.photos.length} uploaded` },
                { label: 'Instant book', value: form.instantBook ? 'Yes' : 'No' },
                { label: 'Delivery', value: form.delivery ? `Yes ($${form.deliveryFee})` : 'No' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: 'var(--space-3) 0',
                  borderBottom: '1px solid var(--border-light)',
                  fontSize: 14,
                }}>
                  <span style={{ color: 'var(--body-gray)' }}>{item.label}</span>
                  <span style={{ fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 'var(--space-6)' }}>
          {step > 0 && (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step < 3 ? (
            <button className="btn btn-primary" style={{ flex: 1 }} disabled={!canNext()} onClick={() => setStep(s => s + 1)}>
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish listing'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
