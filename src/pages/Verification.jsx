import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Upload, Camera, CheckCircle, Shield, AlertCircle, ArrowRight, X, Eye } from 'lucide-react';

const STEPS = ['license-front', 'license-back', 'selfie', 'review', 'complete'];

export default function Verification() {
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();
  const [step, setStep] = useState(0);
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [processing, setProcessing] = useState(false);

  const currentStep = STEPS[step];

  const handleFileUpload = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setter(url);
      setTimeout(() => setStep(s => s + 1), 800);
    }
  };

  const simulateCapture = (setter) => () => {
    // Simulate camera capture
    setter('captured');
    setTimeout(() => setStep(s => s + 1), 800);
  };

  const handleSubmitVerification = () => {
    setProcessing(true);
    setTimeout(() => {
      updateBooking({
        verification: {
          licenseUploaded: true,
          selfieUploaded: true,
          verified: true,
        },
      });
      setStep(4); // complete
      setProcessing(false);
    }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <div className="container-narrow" style={{ padding: 'var(--space-10) var(--space-6)', maxWidth: 560 }}>

        {/* Header */}
        {currentStep !== 'complete' && (
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 24 }}>Verify your identity</h2>
              <button
                onClick={() => navigate(-1)}
                style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-circle)',
                  background: 'var(--chip-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              ><X size={18} /></button>
            </div>

            {/* Progress steps */}
            <div style={{ display: 'flex', gap: 4 }}>
              {['License (front)', 'License (back)', 'Selfie', 'Review'].map((label, i) => (
                <div key={label} style={{ flex: 1 }}>
                  <div style={{
                    height: 3,
                    borderRadius: 2,
                    background: i <= step ? 'var(--black)' : 'var(--border-light)',
                    marginBottom: 6,
                    transition: 'background 0.3s',
                  }} />
                  <span style={{
                    fontSize: 11,
                    fontWeight: i === step ? 600 : 400,
                    color: i === step ? 'var(--black)' : 'var(--muted-gray)',
                  }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step: License Front */}
        {currentStep === 'license-front' && (
          <div>
            <div style={{
              background: 'var(--chip-gray)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-12) var(--space-6)',
              textAlign: 'center',
              marginBottom: 'var(--space-6)',
              border: '2px dashed var(--border-light)',
            }}>
              <Upload size={40} color="var(--muted-gray)" style={{ marginBottom: 16 }} />
              <h3 style={{ marginBottom: 8 }}>Front of driver's license</h3>
              <p style={{ color: 'var(--body-gray)', fontSize: 14, marginBottom: 'var(--space-6)' }}>
                Take a photo or upload an image of the front of your valid driver's license.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                  <Upload size={16} /> Upload photo
                  <input type="file" accept="image/*" onChange={handleFileUpload(setLicenseFront)} style={{ display: 'none' }} />
                </label>
                <button className="btn btn-secondary" onClick={simulateCapture(setLicenseFront)}>
                  <Camera size={16} /> Take photo
                </button>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--body-gray)', lineHeight: 1.6 }}>
              <p><strong>Tips for a good photo:</strong></p>
              <ul style={{ paddingLeft: 20, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Place your license on a flat, dark surface</li>
                <li>Make sure all text is readable and not blurry</li>
                <li>Avoid glare and shadows</li>
                <li>Include the entire card in the frame</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step: License Back */}
        {currentStep === 'license-back' && (
          <div>
            <div style={{
              background: 'var(--success-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-5)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: '#108c3d',
            }}>
              <CheckCircle size={16} /> Front of license uploaded
            </div>

            <div style={{
              background: 'var(--chip-gray)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-12) var(--space-6)',
              textAlign: 'center',
              marginBottom: 'var(--space-6)',
              border: '2px dashed var(--border-light)',
            }}>
              <Upload size={40} color="var(--muted-gray)" style={{ marginBottom: 16 }} />
              <h3 style={{ marginBottom: 8 }}>Back of driver's license</h3>
              <p style={{ color: 'var(--body-gray)', fontSize: 14, marginBottom: 'var(--space-6)' }}>
                Now upload or photograph the back of your driver's license.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                  <Upload size={16} /> Upload photo
                  <input type="file" accept="image/*" onChange={handleFileUpload(setLicenseBack)} style={{ display: 'none' }} />
                </label>
                <button className="btn btn-secondary" onClick={simulateCapture(setLicenseBack)}>
                  <Camera size={16} /> Take photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Selfie */}
        {currentStep === 'selfie' && (
          <div>
            <div style={{
              background: 'var(--success-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-5)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: '#108c3d',
            }}>
              <CheckCircle size={16} /> License uploaded (front & back)
            </div>

            <div style={{
              background: 'var(--chip-gray)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-12) var(--space-6)',
              textAlign: 'center',
              marginBottom: 'var(--space-6)',
              border: '2px dashed var(--border-light)',
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-circle)',
                background: 'var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Camera size={32} color="var(--muted-gray)" />
              </div>
              <h3 style={{ marginBottom: 8 }}>Take a selfie</h3>
              <p style={{ color: 'var(--body-gray)', fontSize: 14, marginBottom: 'var(--space-6)', maxWidth: 360, margin: '0 auto var(--space-6)' }}>
                We'll match your selfie to the photo on your driver's license to verify your identity.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                  <Upload size={16} /> Upload selfie
                  <input type="file" accept="image/*" capture="user" onChange={handleFileUpload(setSelfie)} style={{ display: 'none' }} />
                </label>
                <button className="btn btn-secondary" onClick={simulateCapture(setSelfie)}>
                  <Camera size={16} /> Take selfie
                </button>
              </div>
            </div>

            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--chip-gray)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13,
              color: 'var(--body-gray)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}>
              <Eye size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>Look directly at the camera. Remove sunglasses, hats, or masks. Ensure good lighting on your face.</span>
            </div>
          </div>
        )}

        {/* Step: Review */}
        {currentStep === 'review' && (
          <div>
            <div style={{
              background: 'var(--success-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: '#108c3d',
            }}>
              <CheckCircle size={16} /> All documents uploaded
            </div>

            <h3 style={{ marginBottom: 'var(--space-5)' }}>Review your submission</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {[
                { label: "Driver's license (front)", status: licenseFront ? 'Uploaded' : 'Missing' },
                { label: "Driver's license (back)", status: licenseBack ? 'Uploaded' : 'Missing' },
                { label: "Selfie", status: selfie ? 'Uploaded' : 'Missing' },
              ].map(doc => (
                <div key={doc.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-4)',
                  background: 'var(--chip-gray)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{doc.label}</span>
                  <span className="badge badge-success">
                    <CheckCircle size={12} /> {doc.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              padding: 'var(--space-4)',
              background: 'var(--chip-gray)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-6)',
              fontSize: 13,
              color: 'var(--body-gray)',
              lineHeight: 1.6,
            }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontWeight: 500, color: 'var(--black)' }}>
                <Shield size={14} /> Privacy & Security
              </p>
              <p>
                Your documents are encrypted and processed securely. We use Persona for identity verification.
                Your information is only used to verify your identity and is not shared with hosts.
                You can request deletion of your verification data at any time.
              </p>
            </div>

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={handleSubmitVerification}
              disabled={processing}
              style={{ marginBottom: 'var(--space-3)' }}
            >
              {processing ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Verifying identity...
                </span>
              ) : (
                <>Submit verification <ArrowRight size={16} /></>
              )}
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => setStep(0)}>
              Retake photos
            </button>
          </div>
        )}

        {/* Step: Complete */}
        {currentStep === 'complete' && (
          <div style={{ textAlign: 'center', padding: 'var(--space-10) 0' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 'var(--radius-circle)',
              background: 'var(--success-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-6)',
            }}>
              <CheckCircle size={40} color="var(--success)" />
            </div>
            <h2 style={{ marginBottom: 8 }}>Identity verified!</h2>
            <p style={{ color: 'var(--body-gray)', fontSize: 16, marginBottom: 'var(--space-8)', lineHeight: 1.6 }}>
              Your identity has been verified successfully. Your trip is now fully confirmed.
              The host has been notified and you're all set.
            </p>

            {booking.vehicle && (
              <div style={{
                background: 'var(--chip-gray)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-5)',
                marginBottom: 'var(--space-8)',
                textAlign: 'left',
              }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <img
                    src={booking.vehicle.images[0]}
                    alt=""
                    style={{ width: 100, height: 68, objectFit: 'cover', borderRadius: 8 }}
                  />
                  <div>
                    <h5 style={{ fontSize: 15, marginBottom: 4 }}>
                      {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                    </h5>
                    <p style={{ fontSize: 13, color: 'var(--body-gray)' }}>
                      Booking #{booking.bookingId}
                    </p>
                    <span className="badge badge-success" style={{ marginTop: 4 }}>
                      <CheckCircle size={10} /> Confirmed
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/')}>
                Back to home
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/search')}>
                Browse more cars
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
