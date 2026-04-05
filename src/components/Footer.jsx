import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();

  const footerLinks = {
    Explore: [
      { label: 'Browse cars', to: '/search' },
      { label: 'How it works', to: '/how-it-works' },
      { label: 'Trust & safety', to: '/how-it-works' },
      { label: 'Insurance & protection', to: '/how-it-works' },
    ],
    Hosting: [
      { label: 'List your car', to: '/list-your-car' },
      { label: 'Host dashboard', to: '/host' },
      { label: 'Calculator', to: '/list-your-car' },
      { label: 'Host protection', to: '/how-it-works' },
    ],
    Company: [
      { label: 'About', to: '/how-it-works' },
      { label: 'Careers', to: '/how-it-works' },
      { label: 'Press', to: '/how-it-works' },
      { label: 'Blog', to: '/how-it-works' },
    ],
  };

  return (
    <footer style={{
      background: 'var(--black)',
      color: 'var(--white)',
      padding: 'var(--space-16) 0 var(--space-8)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-10)',
          marginBottom: 'var(--space-12)',
        }}>
          <div>
            <div
              onClick={() => navigate('/')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, cursor: 'pointer' }}
            >
              <Car size={28} /> RIDE
            </div>
            <p style={{ color: 'var(--muted-gray)', fontSize: 14, lineHeight: 1.6 }}>
              The local car rental marketplace. Verified hosts, real vehicles, coverage on every trip. A vertical of Outdoorsy.
            </p>
          </div>
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h5 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>{section}</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(link => (
                  <a
                    key={link.label}
                    onClick={() => navigate(link.to)}
                    style={{ color: 'var(--muted-gray)', fontSize: 14, cursor: 'pointer', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'var(--muted-gray)'}
                  >{link.label}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '0 0 var(--space-6)' }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <p style={{ color: 'var(--muted-gray)', fontSize: 12 }}>
            &copy; 2026 Ride, Inc. All rights reserved. A vertical of Outdoorsy.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Terms', 'Privacy', 'Cookie policy'].map(item => (
              <a key={item} style={{ color: 'var(--muted-gray)', fontSize: 12, cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = 'var(--muted-gray)'}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
