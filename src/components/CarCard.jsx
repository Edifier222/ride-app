import { Link } from 'react-router-dom';
import { Star, Zap, MapPin } from 'lucide-react';

export default function CarCard({ car }) {
  return (
    <Link to={`/car/${car.id}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        position: 'relative',
        paddingBottom: '62%',
        overflow: 'hidden',
        background: '#f5f5f5',
      }}>
        <img
          src={car.images[0]}
          alt={`${car.year} ${car.make} ${car.model}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading="lazy"
        />
        {car.instantBook && (
          <span style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'var(--black)',
            color: 'var(--white)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: 12,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <Zap size={12} fill="currentColor" /> Instant
          </span>
        )}
      </div>

      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h4 style={{ fontSize: 16, fontWeight: 600 }}>
            {car.year} {car.make} {car.model}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 500, flexShrink: 0, marginLeft: 8 }}>
            <Star size={14} fill="currentColor" /> {car.rating}
            <span style={{ color: 'var(--muted-gray)', fontWeight: 400 }}>({car.trips})</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--body-gray)', fontSize: 13, marginBottom: 8 }}>
          <MapPin size={13} /> {car.location.city}, {car.location.state}
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {[car.fuelType, car.transmission, `${car.seats} seats`].map(tag => (
            <span key={tag} style={{
              background: 'var(--chip-gray)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--body-gray)',
            }}>{tag}</span>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 700 }}>${car.pricePerDay}</span>
            <span style={{ color: 'var(--body-gray)', fontSize: 14 }}>/day</span>
          </div>
          {car.delivery && (
            <span style={{ fontSize: 12, color: 'var(--body-gray)' }}>Delivery available</span>
          )}
        </div>
      </div>
    </Link>
  );
}
