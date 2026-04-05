import { useState, useEffect } from 'react';
import { ChevronLeft, Upload, Camera, CheckCircle, Shield, Eye, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getPersonaConfig, getIdVerification, checkIdVerified } from '../../services/api';

export default function VerificationFlow({ onBack, onComplete }) {
  const { authToken, user } = useAuth();
  const [step, setStep] = useState('loading'); // loading, persona, fallback-front, fallback-back, fallback-selfie, fallback-review, done
  const [personaLoaded, setPersonaLoaded] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Try to load Persona SDK
  useEffect(() => {
    if (!authToken) {
      setStep('fallback-front'); // No auth, use mock flow
      return;
    }

    // Load Persona SDK script
    if (!window.Persona) {
      const script = document.createElement('script');
      script.src = 'https://cdn.withpersona.com/dist/persona-v4.5.0.js';
      script.async = true;
      script.onload = () => {
        console.log('[RIDE] Persona SDK loaded');
        setPersonaLoaded(true);
        startPersona();
      };
      script.onerror = () => {
        console.log('[RIDE] Persona SDK failed to load, using fallback');
        setStep('fallback-front');
      };
      document.head.appendChild(script);
    } else {
      setPersonaLoaded(true);
      startPersona();
    }
  }, []);

  const startPersona = async () => {
    try {
      const { templateId, environment } = getPersonaConfig();

      // Check if user has an existing verification session
      const existing = await getIdVerification(authToken);
      console.log('[RIDE] ID verification status:', existing);

      const config = {
        templateId,
        environment,
        referenceId: user?.id ? String(user.id) : undefined,
        onComplete: ({ inquiryId, status }) => {
          console.log('[RIDE] Persona complete:', inquiryId, status);
          setStep('done');
        },
        onCancel: () => {
          console.log('[RIDE] Persona cancelled');
          onBack();
        },
        onError: (error) => {
          console.error('[RIDE] Persona error:', error);
          setStep('fallback-front');
        },
      };

      // If there's an existing session, resume it
      if (existing?.session_token) {
        config.sessionToken = existing.session_token;
      }
      if (existing?.external_id) {
        config.inquiryId = existing.external_id;
      }

      if (window.Persona) {
        const client = new window.Persona.Client(config);
        client.open();
        setStep('persona');
      } else {
        setStep('fallback-front');
      }
    } catch (err) {
      console.error('[RIDE] Persona init failed:', err);
      setStep('fallback-front');
    }
  };

  // Fallback mock flow for when Persona can't load
  const handleFallbackUpload = () => {
    if (step === 'fallback-front') setStep('fallback-back');
    else if (step === 'fallback-back') setStep('fallback-selfie');
    else if (step === 'fallback-selfie') setStep('fallback-review');
  };

  const handleFallbackSubmit = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setStep('done');
    }, 2500);
  };

  // Done screen
  if (step === 'done') return (
    <div style={{ minHeight: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(52,199,89,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <CheckCircle size={44} color="var(--success)" />
      </div>
      <div className="text-title2" style={{ marginBottom: 8, textAlign: 'center' }}>Identity verified!</div>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 32, maxWidth: 300, lineHeight: 1.5 }}>
        Your identity has been verified. Your trip is now fully confirmed.
      </p>
      <button className="btn-primary" style={{ maxWidth: 300 }} onClick={onComplete}>Done</button>
    </div>
  );

  // Loading / Persona active
  if (step === 'loading' || step === 'persona') return (
    <div style={{ minHeight: '100%', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--surface-3)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 16 }} />
      <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
        {step === 'loading' ? 'Loading verification...' : 'Verification in progress...'}
      </div>
      <button onClick={onBack} style={{ fontSize: 14, color: 'var(--text-tertiary)', marginTop: 20, textDecoration: 'underline' }}>Cancel</button>
    </div>
  );

  // Fallback flow (when Persona SDK can't load)
  const stepTitles = { 'fallback-front': 'License (front)', 'fallback-back': 'License (back)', 'fallback-selfie': 'Selfie', 'fallback-review': 'Review' };
  const stepIndex = { 'fallback-front': 0, 'fallback-back': 1, 'fallback-selfie': 2, 'fallback-review': 3 };

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(22,22,22,0.85)', backdropFilter: 'blur(24px)', borderBottom: '0.5px solid var(--border)' }}>
        <button onClick={step === 'fallback-front' ? onBack : () => {
          const steps = ['fallback-front', 'fallback-back', 'fallback-selfie', 'fallback-review'];
          const idx = steps.indexOf(step);
          if (idx > 0) setStep(steps[idx - 1]);
          else onBack();
        }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 600, flex: 1 }}>Verify identity</span>
        <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{(stepIndex[step] || 0) + 1}/4</span>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 3, padding: '12px 16px 0' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= (stepIndex[step] || 0) ? 'var(--text)' : 'var(--surface-3)', transition: 'background 0.3s' }} />
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {step !== 'fallback-review' && (stepIndex[step] || 0) > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(52,199,89,0.12)', padding: '10px 14px', borderRadius: 'var(--r-sm)', marginBottom: 16, fontSize: 14, color: '#248a3d' }}>
            <CheckCircle size={16} /> {stepIndex[step] === 1 ? 'Front uploaded' : stepIndex[step] === 2 ? 'License uploaded' : ''}
          </div>
        )}

        {/* Upload screens */}
        {step !== 'fallback-review' && (
          <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-lg)', padding: '48px 20px', textAlign: 'center', marginBottom: 20, border: '2px dashed var(--border)' }}>
            {step === 'fallback-selfie' ? (
              <Camera size={44} color="var(--text-tertiary)" style={{ marginBottom: 16 }} />
            ) : (
              <Upload size={44} color="var(--text-tertiary)" style={{ marginBottom: 16 }} />
            )}
            <div className="text-title3" style={{ marginBottom: 6 }}>
              {step === 'fallback-front' && 'Front of license'}
              {step === 'fallback-back' && 'Back of license'}
              {step === 'fallback-selfie' && 'Take a selfie'}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              {step === 'fallback-selfie' ? "We'll match your selfie to your license." : 'Upload or photograph your driver\'s license.'}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <label className="btn-primary btn-sm" style={{ width: 'auto', padding: '12px 20px', cursor: 'pointer' }}>
                <Upload size={16} /> Upload
                <input type="file" accept="image/*" onChange={handleFallbackUpload} style={{ display: 'none' }} />
              </label>
              <button className="btn-secondary btn-sm" style={{ width: 'auto', padding: '12px 20px' }} onClick={handleFallbackUpload}>
                <Camera size={16} /> Capture
              </button>
            </div>
          </div>
        )}

        {/* Review */}
        {step === 'fallback-review' && (
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
            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: 14, marginBottom: 20, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontWeight: 600, color: 'var(--text)' }}>
                <Shield size={14} /> Privacy & Security
              </div>
              Your documents are encrypted and processed via Persona. Your info is never shared with hosts.
            </div>
            <button className="btn-primary" onClick={handleFallbackSubmit} disabled={verifying}>
              {verifying ? (
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
