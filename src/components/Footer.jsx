const footerLinks = {
  Explore: ['Browse cars', 'How it works', 'Trust & safety', 'Insurance & protection', 'Cancellation policy'],
  Hosting: ['List your car', 'Host tools', 'Earnings calculator', 'Host protection', 'All-Star Hosts'],
  Company: ['About', 'Careers', 'Press', 'Blog', 'OpenRoad'],
  Support: ['Help center', 'Get help', 'Safety', 'Report issue'],
};

const cities = ['Austin', 'Denver', 'Los Angeles', 'Miami', 'Phoenix', 'San Francisco', 'Seattle', 'New York'];

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--surface)', borderTop: '1px solid var(--border)',
      marginTop: 60,
    }}>
      {/* Popular locations bar */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '32px 48px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14, letterSpacing: '0.03em' }}>
          POPULAR LOCATIONS
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {cities.map(city => (
            <span key={city} style={{
              padding: '6px 16px', borderRadius: 'var(--r-pill)',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Car rental {city}
            </span>
          ))}
        </div>
      </div>

      {/* Main footer grid */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '40px 48px',
        display: 'grid',
        gridTemplateColumns: '1.5fr repeat(4, 1fr)',
        gap: 40,
      }}>
        {/* Brand column */}
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 22, letterSpacing: '0.08em', marginBottom: 12,
          }}>
            <span className="text-gold">RIDE</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 20, maxWidth: 240 }}>
            The local car rental marketplace. Verified hosts, real cars, coverage on every trip.
          </p>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 16 }}>
            A vertical of <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Outdoorsy</span>
          </div>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'Instagram', path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z' },
              { label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
              { label: 'Twitter', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
              { label: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z' },
            ].map(s => (
              <a key={s.label} title={s.label} style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-2)'; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>{section}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(link => (
                <a key={link} style={{
                  fontSize: 13, color: 'var(--text-tertiary)', cursor: 'pointer',
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                >{link}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid var(--border)',
        maxWidth: 1280, margin: '0 auto', padding: '20px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          &copy; 2026 Ride, Inc. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Terms of Service', 'Privacy Policy', 'Cookie Preferences', 'Sitemap'].map(item => (
            <a key={item} style={{
              fontSize: 12, color: 'var(--text-tertiary)', cursor: 'pointer',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >{item}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
