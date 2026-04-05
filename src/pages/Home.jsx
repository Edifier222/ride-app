import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Shield, CheckCircle, Clock, MapPin, ChevronRight, Star } from 'lucide-react';
import CarCard from '../components/CarCard';
import { listings, cities } from '../data/listings';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, openSignup } = useAuth();

  const featuredCars = listings.filter(c => c.rating >= 4.8).slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search${location ? `?city=${encodeURIComponent(location)}` : ''}`);
  };

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'var(--black)',
        color: 'var(--white)',
        padding: 'var(--space-20) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'url(https://images.unsplash.com/photo-1449965408869-ebd13bc0c703?w=1600&h=800&fit=crop) center/cover',
          opacity: 0.3,
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 56, maxWidth: 600, marginBottom: 16, lineHeight: 1.1 }}>
            Find your perfect ride
          </h1>
          <p style={{ fontSize: 20, color: 'var(--muted-gray)', maxWidth: 500, marginBottom: 40, lineHeight: 1.5 }}>
            Cars, trucks, and SUVs from local hosts. Skip the rental counter.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            background: 'var(--white)',
            borderRadius: 'var(--radius-pill)',
            padding: 6,
            maxWidth: 560,
            gap: 4,
          }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0 16px',
            }}>
              <MapPin size={20} color="var(--muted-gray)" />
              <input
                type="text"
                placeholder="City or airport"
                value={location}
                onChange={e => setLocation(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: 16,
                  color: 'var(--black)',
                  background: 'transparent',
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{
              borderRadius: 'var(--radius-pill)',
              padding: '14px 28px',
            }}>
              <Search size={18} /> Search
            </button>
          </form>

          {/* Quick city links */}
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {['Phoenix, AZ', 'Los Angeles, CA', 'Miami, FL', 'Austin, TX'].map(city => (
              <button
                key={city}
                className="btn-chip"
                onClick={() => { setLocation(city.split(',')[0]); }}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: 'var(--white)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 13,
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.15)'}
              >{city}</button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--space-10)', textAlign: 'center' }}>How RIDE works</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-8)',
          }}>
            {[
              { icon: <Search size={28} />, title: 'Find your car', desc: 'Browse hundreds of vehicles from verified local hosts. Filter by type, price, and features.' },
              { icon: <Shield size={28} />, title: 'Book with protection', desc: 'Choose your protection plan and book instantly. Every trip includes liability coverage.' },
              { icon: <CheckCircle size={28} />, title: 'Verify & drive', desc: 'Quick ID verification, then pick up your car or get it delivered. Hit the road.' },
            ].map(step => (
              <div key={step.title} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 'var(--radius-circle)',
                  background: 'var(--chip-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-5)',
                }}>{step.icon}</div>
                <h4 style={{ marginBottom: 8 }}>{step.title}</h4>
                <p style={{ color: 'var(--body-gray)', fontSize: 15, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by city */}
      <section style={{ padding: 'var(--space-12) 0 var(--space-16)', background: 'var(--chip-gray)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
            <h2>Browse by city</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/search')} style={{ gap: 4 }}>
              See all <ChevronRight size={16} />
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
          }}>
            {cities.slice(0, 8).map(city => (
              <button
                key={city.name}
                onClick={() => navigate(`/search?city=${encodeURIComponent(city.name)}`)}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  paddingBottom: '65%',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 14,
                  color: 'var(--white)',
                  fontWeight: 600,
                  fontSize: 15,
                  textAlign: 'left',
                }}>
                  {city.name}, {city.state}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
            <h2>Top-rated cars</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/search')} style={{ gap: 4 }}>
              See all <ChevronRight size={16} />
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {featuredCars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--black)', color: 'var(--white)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Drive with confidence</h2>
          <p style={{ color: 'var(--muted-gray)', fontSize: 18, marginBottom: 'var(--space-10)', maxWidth: 500, margin: '0 auto var(--space-10)' }}>
            Every RIDE trip comes with protection, verified hosts, and 24/7 support.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-8)',
            textAlign: 'left',
          }}>
            {[
              { icon: <Shield size={24} />, title: 'Insurance included', desc: 'Every trip includes liability coverage. Upgrade for more protection.' },
              { icon: <CheckCircle size={24} />, title: 'Verified hosts', desc: 'All hosts are verified with ID checks and vehicle inspections.' },
              { icon: <Clock size={24} />, title: '24/7 support', desc: 'Roadside assistance and customer support around the clock.' },
              { icon: <Star size={24} />, title: 'Rated by renters', desc: 'Real reviews from real renters. Know what to expect.' },
            ].map(item => (
              <div key={item.title} style={{ padding: 'var(--space-6)', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ marginBottom: 12, color: 'var(--white)' }}>{item.icon}</div>
                <h5 style={{ marginBottom: 6, fontSize: 16 }}>{item.title}</h5>
                <p style={{ color: 'var(--muted-gray)', fontSize: 14, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Earn money with your car</h2>
          <p style={{ color: 'var(--body-gray)', fontSize: 18, marginBottom: 'var(--space-8)', maxWidth: 500, margin: '0 auto var(--space-8)' }}>
            List your vehicle on RIDE and start earning. Set your own price, availability, and rules.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => isLoggedIn ? navigate('/list-your-car') : openSignup()}>List your car</button>
        </div>
      </section>
    </div>
  );
}
