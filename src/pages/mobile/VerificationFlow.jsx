import { useState } from 'react';
import { ChevronLeft, Upload, Camera, CheckCircle, Shield, Eye, ArrowRight, X } from 'lucide-react';

const STEPS = ['front', 'back', 'selfie', 'review', 'done'];

export default function VerificationFlow({ onBack, onComplete }) {
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleUpload = () => setTimeout(() => setStep(s => s + 1), 600);
  const handleSimulate = () => setTimeout(() => setStep(s => s + 1), 600);

  const handleSubmit = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep(4); }, 2500);
  };

  // Done screen
  if (step === 4) return (
    <div style={{ minHeight: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(52,199,89,0.12)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', marginBottom: 20,
      }}>
        <CheckCircle size={44} color="var(--success)" />
      </div>
      <div className="text-title2" style={{ marginBottom: 8, textAlign: 'center' }}>Identity verified!</div>
      <p style={{ fontSize: 15, color: 'var(--secondary-label)', textAlign: 'center', marginBottom: 32, maxWidth: 300, lineHeight: 1.5 }}>
        Your trip is fully confirmed. The host has been notified.
      </p>
      <button className="btn-primary" style={{ maxWidth: 300 }} onClick={onComplete}>Done</button>
    </div>
  );

  const stepTitles = ['License (front)', 'License (back)', 'Selfie', 'Review'];

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(22,22,22,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid var(--separator)',
      }}>
        <button onClick={step === 0 ? onBack : () => setStep(s => s - 1)} style={{
          width: 36, height: 36, borderRadius: '50%', background: 'var(--fill)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>Verify identity</span>
        <span style={{ fontSize: 13, color: 'var(--tertiary-label)' }}>{step + 1}/4</span>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 3, padding: '12px 16px 0' }}>
        {stepTitles.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? 'var(--black)' : 'var(--fill)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {/* Success banner for completed steps */}
        {step > 0 && step < 4 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(52,199,89,0.12)', padding: '10px 14px',
            borderRadius: 'var(--r-sm)', marginBottom: 16,
            fontSize: 14, color: '#248a3d',
          }}>
            <CheckCircle size={16} />
            {step === 1 && 'Front of license uploaded'}
            {step === 2 && 'License uploaded (front & back)'}
            {step === 3 && 'All photos captured'}
          </div>
        )}

        {/* Upload screens (0, 1, 2) */}
        {step < 3 && (
          <>
            <div style={{
              background: 'var(--fill)', borderRadius: 'var(--r-lg)',
              padding: '48px 20px', textAlign: 'center', marginBottom: 20,
              border: '2px dashed var(--separator)',
            }}>
              {step < 2 ? (
                <Upload size={44} color="var(--tertiary-label)" style={{ marginBottom: 16 }} />
              ) : (
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', background: 'var(--separator)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}>
                  <Camera size={32} color="var(--tertiary-label)" />
                </div>
              )}
              <div className="text-title3" style={{ marginBottom: 6 }}>
                {step === 0 && 'Front of license'}
                {step === 1 && 'Back of license'}
                {step === 2 && 'Take a selfie'}
              </div>
              <p style={{ fontSize: 14, color: 'var(--secondary-label)', marginBottom: 20, maxWidth: 280, margin: '0 auto 20px' }}>
                {step === 0 && 'Upload or photograph the front of your valid driver\'s license.'}
                {step === 1 && 'Now upload the back of your driver\'s license.'}
                {step === 2 && 'We\'ll match your selfie to your license photo.'}
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <label className="btn-primary btn-sm" style={{ width: 'auto', padding: '12px 20px', cursor: 'pointer' }}>
                  <Upload size={16} /> Upload
                  <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                </label>
                <button className="btn-secondary btn-sm" style={{ width: 'auto', padding: '12px 20px' }} onClick={handleSimulate}>
                  <Camera size={16} /> Capture
                </button>
              </div>
            </div>

            {step === 2 && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: 'var(--fill)', borderRadius: 'var(--r-sm)',
                padding: 12, fontSize: 13, color: 'var(--secondary-label)',
              }}>
                <Eye size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Look directly at the camera. Remove sunglasses or hats. Ensure good lighting.</span>
              </div>
            )}
          </>
        )}

        {/* Review screen */}
        {step === 3 && (
          <>
            <div className="text-title3" style={{ marginBottom: 16 }}>Review submission</div>
            <div className="ios-group" style={{ marginBottom: 20 }}>
              {['License (front)', 'License (back)', 'Selfie'].map(doc => (
                <div key={doc} className="ios-group-item">
                  <span style={{ flex: 1, fontSize: 15 }}>{doc}</span>
                  <span className="badge badge-success"><CheckCircle size={10} /> Uploaded</span>
                </div>
              ))}
            </div>

            <div style={{
              background: 'var(--fill)', borderRadius: 'var(--r-sm)',
              padding: 14, marginBottom: 20, fontSize: 13, color: 'var(--secondary-label)', lineHeight: 1.5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontWeight: 600, color: 'var(--label)' }}>
                <Shield size={14} /> Privacy & Security
              </div>
              Your documents are encrypted and processed via Persona. Your info is never shared with hosts.
            </div>

            <button className="btn-primary" onClick={handleSubmit} disabled={processing}>
              {processing ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Verifying...
                </span>
              ) : (
                <>Submit verification <ArrowRight size={16} /></>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
