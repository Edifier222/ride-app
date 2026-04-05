import { useNavigate } from 'react-router-dom';
import { Search, Shield, CheckCircle, Car, CreditCard, Camera, Clock, MapPin, Star, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ marginBottom: 'var(--space-4)' }}>How RIDE works</h1>
          <p style={{ color: 'var(--body-gray)', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>
            Rent a car from a local host in minutes. No counter, no line, no hassle.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '0 0 var(--space-16)' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          {[
            {
              icon: <Search size={24} />,
              title: '1. Find your car',
              desc: 'Browse by city, vehicle type, price, and features. Every listing includes real photos, specs, and reviews from verified renters.',
            },
            {
              icon: <Shield size={24} />,
              title: '2. Choose protection',
              desc: 'Select from Minimum, Standard, or Premier protection plans. Every trip includes state-minimum liability. Upgrade for collision, comprehensive, and roadside.',
            },
            {
              icon: <CreditCard size={24} />,
              title: '3. Book & pay',
              desc: 'Secure checkout with instant booking available on many vehicles. Free cancellation up to 24 hours before your trip.',
            },
            {
              icon: <Camera size={24} />,
              title: '4. Verify your identity',
              desc: 'After booking, upload your driver\'s license and take a quick selfie. We use Persona to verify your identity securely. This step confirms your trip.',
            },
            {
              icon: <Car size={24} />,
              title: '5. Pick up & drive',
              desc: 'Meet your host at the pickup location or get the car delivered. Do a quick walkthrough, get the keys, and you\'re on your way.',
            },
            {
              icon: <MapPin size={24} />,
              title: '6. Return',
              desc: 'Return the car at the agreed time and location. Fill up the tank to the same level. That\'s it!',
            },
          ].map((step, i) => (
            <div key={step.title} style={{
              display: 'flex',
              gap: 'var(--space-6)',
              padding: 'var(--space-6) 0',
              borderBottom: i < 5 ? '1px solid var(--border-light)' : 'none',
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-circle)',
                background: 'var(--chip-gray)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>{step.icon}</div>
              <div>
                <h3 style={{ fontSize: 20, marginBottom: 6 }}>{step.title}</h3>
                <p style={{ color: 'var(--body-gray)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--black)', color: 'var(--white)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to ride?</h2>
          <p style={{ color: 'var(--muted-gray)', fontSize: 18, marginBottom: 'var(--space-8)' }}>
            Find cars near you and book in minutes.
          </p>
          <button className="btn btn-lg" style={{ background: 'var(--white)', color: 'var(--black)', gap: 8 }} onClick={() => navigate('/search')}>
            Browse cars <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
