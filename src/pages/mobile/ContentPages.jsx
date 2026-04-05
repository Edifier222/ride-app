import { ChevronLeft, Shield, CheckCircle, Car, Users, MapPin, Star, Zap, Clock, CreditCard, Phone, Mail, MessageSquare, Award, Briefcase, Globe } from 'lucide-react';
import useIsDesktop from '../../hooks/useIsDesktop';

function PageShell({ title, onBack, children }) {
  const isDesktop = useIsDesktop();
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%' }}>
      <div style={{
        padding: isDesktop ? '16px 32px' : '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        background: isDesktop ? 'transparent' : 'var(--glass)',
        backdropFilter: isDesktop ? 'none' : 'blur(24px)',
        borderBottom: isDesktop ? 'none' : '0.5px solid var(--border)',
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><ChevronLeft size={20} /></button>
        <span style={{ fontSize: 17, fontWeight: 600 }}>{title}</span>
      </div>
      <div style={{ maxWidth: isDesktop ? 800 : 'none', margin: '0 auto', padding: isDesktop ? '32px' : '16px' }}>
        {children}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 16, marginTop: 32 }}>{children}</h2>;
}

function Paragraph({ children }) {
  return <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{children}</p>;
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)', padding: 20, marginBottom: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 'var(--r-sm)',
          background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

// ============================
// HOW IT WORKS
// ============================
export function HowItWorksPage({ onBack }) {
  return (
    <PageShell title="How it works" onBack={onBack}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          Rent a car from <span className="text-gold">real people</span>
        </h1>
        <Paragraph>Skip the rental counter. Book directly from verified local hosts with professionally maintained vehicles.</Paragraph>
      </div>

      <SectionTitle>For guests</SectionTitle>
      <div style={{ display: 'grid', gap: 12 }}>
        <FeatureCard icon={<MapPin size={20} color="var(--accent)" />} title="1. Find your car" desc="Search by location, dates, and vehicle type. Filter by price, fuel type, instant book, and more. Every listing includes photos, reviews, and host details." />
        <FeatureCard icon={<Shield size={20} color="var(--accent)" />} title="2. Book with protection" desc="Choose from Auto Basic ($25/day) or Auto Essential ($40/day) protection plans. Every trip includes liability coverage and 24/7 roadside assistance." />
        <FeatureCard icon={<Car size={20} color="var(--accent)" />} title="3. Pick up & drive" desc="Meet your host or get the car delivered. Keyless access available on select vehicles. Drive with confidence knowing you're fully covered." />
        <FeatureCard icon={<Star size={20} color="var(--accent)" />} title="4. Return & review" desc="Return the car at the agreed time and location. Leave a review for your host. Receipts are sent automatically to your email." />
      </div>

      <SectionTitle>For hosts</SectionTitle>
      <div style={{ display: 'grid', gap: 12 }}>
        <FeatureCard icon={<CreditCard size={20} color="var(--accent)" />} title="1. List your car" desc="Create a listing in minutes. Add photos, set your price, availability, and rules. We'll help you optimize for bookings." />
        <FeatureCard icon={<Users size={20} color="var(--accent)" />} title="2. Accept bookings" desc="Review booking requests or enable instant book for automatic acceptance. Screen guests through ID verification and driving record checks." />
        <FeatureCard icon={<Zap size={20} color="var(--accent)" />} title="3. Earn money" desc="Hosts earn an average of $800+/month per vehicle. Get paid via direct deposit within 3 business days of each trip." />
      </div>

      <div style={{ background: 'var(--accent-dim)', borderRadius: 'var(--r-md)', padding: 24, marginTop: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8, color: 'var(--accent-text)' }}>Ready to get started?</div>
        <Paragraph>Whether you're looking to rent or earn, RIDE makes it simple, safe, and rewarding.</Paragraph>
      </div>
    </PageShell>
  );
}

// ============================
// TRUST & SAFETY
// ============================
export function TrustSafetyPage({ onBack }) {
  return (
    <PageShell title="Trust & safety" onBack={onBack}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          Your safety is our <span className="text-gold">priority</span>
        </h1>
        <Paragraph>Every trip on RIDE is backed by verification, insurance, and 24/7 support.</Paragraph>
      </div>

      <SectionTitle>Guest verification</SectionTitle>
      <div style={{ display: 'grid', gap: 12 }}>
        <FeatureCard icon={<CheckCircle size={20} color="var(--success)" />} title="ID verification" desc="Every guest must verify their identity with a government-issued ID and selfie before their first trip. We use advanced identity verification technology." />
        <FeatureCard icon={<Shield size={20} color="var(--success)" />} title="Driving record check" desc="We screen driving records to ensure guests meet our safety standards. Guests with major violations or DUIs are not eligible to book." />
        <FeatureCard icon={<Star size={20} color="var(--success)" />} title="Reviews & ratings" desc="Hosts and guests rate each other after every trip. Accounts with poor ratings are reviewed and may be suspended." />
      </div>

      <SectionTitle>Host standards</SectionTitle>
      <div style={{ display: 'grid', gap: 12 }}>
        <FeatureCard icon={<Car size={20} color="var(--blue)" />} title="Vehicle requirements" desc="All vehicles must be model year 2014 or newer, have fewer than 130,000 miles, pass a mechanical inspection, and have a clean title." />
        <FeatureCard icon={<CheckCircle size={20} color="var(--blue)" />} title="Maintenance standards" desc="Hosts are required to maintain vehicles according to manufacturer specifications. We verify registration, insurance, and inspection status." />
      </div>

      <SectionTitle>24/7 support</SectionTitle>
      <div style={{ display: 'grid', gap: 12 }}>
        <FeatureCard icon={<Phone size={20} color="var(--accent)" />} title="Roadside assistance" desc="Every trip includes 24/7 roadside assistance. Flat tire, dead battery, lockout, or tow — we've got you covered at no extra charge." />
        <FeatureCard icon={<MessageSquare size={20} color="var(--accent)" />} title="In-app support" desc="Our trust & safety team is available around the clock. Report issues, request help, or file claims directly through the app." />
      </div>
    </PageShell>
  );
}

// ============================
// INSURANCE & PROTECTION
// ============================
export function InsurancePage({ onBack }) {
  return (
    <PageShell title="Insurance & protection" onBack={onBack}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          Drive with <span className="text-gold">confidence</span>
        </h1>
        <Paragraph>Every trip includes liability coverage. Choose a protection plan that fits your needs.</Paragraph>
      </div>

      <SectionTitle>Protection plans</SectionTitle>
      {[
        { name: 'Auto Essential', price: '$40/day', color: 'var(--accent)', features: ['$0 deductible', 'Comprehensive & collision coverage', 'Liability coverage up to $1M', 'Personal effects coverage up to $500', '24/7 roadside assistance', 'Lost key replacement'] },
        { name: 'Auto Basic', price: '$25/day', color: 'var(--blue)', features: ['$500 deductible', 'Comprehensive & collision coverage', 'Liability coverage up to $750K', '24/7 roadside assistance'] },
        { name: 'Decline protection', price: '$0', color: 'var(--text-tertiary)', features: ['You are responsible for all damage', 'Requires proof of personal auto insurance', 'Liability coverage still included', 'Security deposit required'] },
      ].map(plan => (
        <div key={plan.name} style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)', padding: 20, marginBottom: 12,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{plan.name}</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: plan.color }}>{plan.price}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {plan.features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                <CheckCircle size={14} color={plan.color} /> {f}
              </div>
            ))}
          </div>
        </div>
      ))}

      <SectionTitle>Host protection</SectionTitle>
      <Paragraph>When you share your vehicle on RIDE, you're backed by our Host Protection Plan — up to $1M in liability coverage and up to $250K in physical damage protection, included at no cost to you.</Paragraph>
      <div style={{ display: 'grid', gap: 12 }}>
        <FeatureCard icon={<Shield size={20} color="var(--success)" />} title="$1M liability coverage" desc="Protects you if a guest causes injury or property damage to a third party while driving your vehicle." />
        <FeatureCard icon={<Car size={20} color="var(--success)" />} title="Physical damage protection" desc="Covers repair or replacement costs if your vehicle is damaged during a trip, up to $250,000." />
      </div>
    </PageShell>
  );
}

// ============================
// CANCELLATION POLICY
// ============================
export function CancellationPage({ onBack }) {
  return (
    <PageShell title="Cancellation policy" onBack={onBack}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          Flexible <span className="text-gold">cancellation</span>
        </h1>
        <Paragraph>We understand plans change. Our cancellation policy is designed to be fair for both guests and hosts.</Paragraph>
      </div>

      <SectionTitle>Guest cancellation</SectionTitle>
      {[
        { time: '30+ days before trip', refund: 'Full refund', color: 'var(--success)', desc: 'Cancel anytime more than 30 days before your trip starts for a full refund of the trip price.' },
        { time: '14–30 days before trip', refund: '75% refund', color: 'var(--accent)', desc: 'Cancel between 14 and 30 days before your trip for a 75% refund of the trip price.' },
        { time: '3–14 days before trip', refund: '50% refund', color: 'var(--warning)', desc: 'Cancel between 3 and 14 days before your trip for a 50% refund of the trip price.' },
        { time: 'Less than 3 days', refund: 'No refund', color: 'var(--error)', desc: 'Cancellations made within 72 hours of the trip start time are non-refundable.' },
      ].map(tier => (
        <div key={tier.time} style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)', padding: 16, marginBottom: 10,
          display: 'flex', gap: 14, alignItems: 'flex-start',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: tier.color, marginTop: 6, flexShrink: 0 }} />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{tier.time}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: tier.color }}>{tier.refund}</span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{tier.desc}</span>
          </div>
        </div>
      ))}

      <SectionTitle>Grace period</SectionTitle>
      <Paragraph>You have a 24-hour free cancellation window after booking, as long as your trip start is at least 7 days away. This grace period applies regardless of the standard cancellation policy.</Paragraph>

      <SectionTitle>Host cancellation</SectionTitle>
      <Paragraph>Hosts who cancel confirmed reservations may face penalties including reduced search ranking, cancellation fees, and account review. Guests receive a full refund and assistance rebooking if a host cancels.</Paragraph>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16, marginTop: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Note:</strong> Refunds apply to the trip price minus the service fee. Protection plan costs are always fully refunded. Deposit refunds follow the same timeline. In cases of extenuating circumstances (natural disasters, government restrictions, medical emergencies), exceptions may be made.
        </div>
      </div>
    </PageShell>
  );
}

// ============================
// ABOUT
// ============================
export function AboutPage({ onBack }) {
  return (
    <PageShell title="About RIDE" onBack={onBack}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, letterSpacing: '0.08em', marginBottom: 12 }}>
          <span className="text-gold">RIDE</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          The car rental marketplace
        </h1>
        <Paragraph>A new vertical from Outdoorsy — the world's largest outdoor travel marketplace. RIDE brings the same trusted peer-to-peer model to everyday car rental.</Paragraph>
      </div>

      <SectionTitle>Our mission</SectionTitle>
      <Paragraph>We believe car rental should be personal, not transactional. RIDE connects people who need a car with local hosts who take pride in their vehicles. No rental counters, no hidden fees, no surprises — just great cars from great people.</Paragraph>

      <SectionTitle>By the numbers</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { num: '10K+', label: 'Vehicles listed' },
          { num: '500+', label: 'Cities' },
          { num: '4.8', label: 'Average rating' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent-text)', marginBottom: 4 }}>{s.num}</div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <SectionTitle>Built on trust</SectionTitle>
      <div style={{ display: 'grid', gap: 12 }}>
        <FeatureCard icon={<Shield size={20} color="var(--accent)" />} title="Insurance on every trip" desc="Every booking includes liability coverage and optional physical damage protection. Powered by the same insurance partners trusted by Outdoorsy." />
        <FeatureCard icon={<CheckCircle size={20} color="var(--accent)" />} title="Verified community" desc="ID verification, driving record checks, and two-way reviews keep our community safe and trustworthy." />
        <FeatureCard icon={<Globe size={20} color="var(--accent)" />} title="Powered by Outdoorsy" desc="Backed by the team that built the world's largest RV rental marketplace with over $3B in bookings and 14M+ nights rented." />
      </div>
    </PageShell>
  );
}

// ============================
// CAREERS
// ============================
export function CareersPage({ onBack }) {
  const openings = [
    { team: 'Engineering', roles: ['Senior Frontend Engineer — React', 'Backend Engineer — Go', 'Mobile Engineer — React Native', 'Staff Infrastructure Engineer'] },
    { team: 'Product', roles: ['Product Manager — Marketplace', 'Product Designer — Mobile', 'UX Researcher'] },
    { team: 'Operations', roles: ['Market Launcher — US West', 'Trust & Safety Analyst', 'Host Success Manager'] },
    { team: 'Marketing', roles: ['Growth Marketing Manager', 'Content Strategist', 'Brand Designer'] },
  ];

  return (
    <PageShell title="Careers" onBack={onBack}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          Join the <span className="text-gold">RIDE</span> team
        </h1>
        <Paragraph>We're building the future of car rental. Remote-friendly, fast-moving, and backed by Outdoorsy.</Paragraph>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <FeatureCard icon={<Globe size={20} color="var(--accent)" />} title="Remote-first" desc="Work from anywhere in the US. We have hubs in Austin, Denver, and San Francisco for those who prefer office life." />
        <FeatureCard icon={<Award size={20} color="var(--accent)" />} title="Competitive comp" desc="Top-of-market salary, equity, health/dental/vision, 401k match, unlimited PTO, and a $2,000 annual learning stipend." />
        <FeatureCard icon={<Briefcase size={20} color="var(--accent)" />} title="High impact" desc="Small team, big problems. You'll ship features that millions of people use. No layers of approval — just build." />
      </div>

      <SectionTitle>Open positions</SectionTitle>
      {openings.map(dept => (
        <div key={dept.team} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 8 }}>{dept.team.toUpperCase()}</div>
          <div className="ios-group">
            {dept.roles.map(role => (
              <div key={role} className="ios-group-item" style={{ padding: '14px 16px', cursor: 'pointer' }}>
                <span style={{ flex: 1, fontSize: 15 }}>{role}</span>
                <span style={{ fontSize: 12, color: 'var(--accent-text)' }}>Apply →</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: 'var(--accent-dim)', borderRadius: 'var(--r-md)', padding: 24, marginTop: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Don't see your role?</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Send us your resume at <span style={{ color: 'var(--accent-text)', fontWeight: 500 }}>careers@ride.co</span></div>
      </div>
    </PageShell>
  );
}

// ============================
// BLOG
// ============================
export function BlogPage({ onBack }) {
  const posts = [
    { tag: 'Product', title: 'Introducing RIDE: A new way to rent cars', desc: 'We\'re launching a peer-to-peer car rental marketplace built on the trust and infrastructure of Outdoorsy.', date: 'Mar 28, 2026' },
    { tag: 'Safety', title: 'How we verify every guest and host', desc: 'A deep dive into our identity verification, driving record checks, and community standards.', date: 'Mar 20, 2026' },
    { tag: 'Hosting', title: '5 tips to maximize your earnings as a host', desc: 'From pricing strategies to photo tips, here\'s how top hosts earn $1,000+ per month per vehicle.', date: 'Mar 15, 2026' },
    { tag: 'Travel', title: 'The best road trips from Austin, TX', desc: 'Hill Country, Fredericksburg wine trails, and Big Bend — all within driving distance.', date: 'Mar 10, 2026' },
    { tag: 'Product', title: 'New: Instant book is here', desc: 'Skip the wait. Book instantly on select vehicles and hit the road faster.', date: 'Mar 5, 2026' },
    { tag: 'Insurance', title: 'Understanding your protection options', desc: 'Auto Essential vs Auto Basic — which plan is right for your next trip?', date: 'Feb 28, 2026' },
  ];

  return (
    <PageShell title="Blog" onBack={onBack}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8 }}>
          The RIDE <span className="text-gold">blog</span>
        </h1>
        <Paragraph>Stories, tips, and news from the RIDE team.</Paragraph>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {posts.map(post => (
          <button key={post.title} style={{
            textAlign: 'left', width: '100%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)', padding: 20,
            transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-text)', background: 'var(--accent-dim)', padding: '3px 10px', borderRadius: 'var(--r-pill)' }}>{post.tag}</span>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{post.date}</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 6 }}>{post.title}</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{post.desc}</div>
          </button>
        ))}
      </div>
    </PageShell>
  );
}
