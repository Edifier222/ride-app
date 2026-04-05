import { useState } from 'react';
import { Heart, Star, MapPin, Zap } from 'lucide-react';
import { savedCars } from '../../data/mockBookings';

export default function FavoritesTab({ onSelectCar }) {
  const [favorites, setFavorites] = useState(savedCars);

  const removeFav = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ minHeight: '100%' }}>
      <div style={{
        padding: '16px 16px 8px',
        background: 'rgba(22,22,22,0.85)',
        backdropFilter: 'blur(24px)',
      }}>
        <h1 className="text-large-title">Favorites</h1>
      </div>

      <div style={{ padding: '8px 16px' }}>
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Heart size={48} color="var(--tertiary-label)" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>No favorites yet</div>
            <div style={{ fontSize: 15, color: 'var(--secondary-label)' }}>Cars you save will appear here</div>
          </div>
        ) : (
          favorites.map(car => (
            <button key={car.id} className="card" onClick={() => onSelectCar(car.id)} style={{
              width: '100%', textAlign: 'left', marginBottom: 12,
              display: 'flex', overflow: 'hidden',
            }}>
              <img src={car.images[0]} alt="" style={{ width: 120, height: 100, objectFit: 'cover' }} />
              <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 3 }}>
                    {car.year} {car.make} {car.model}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--secondary-label)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={11} fill="currentColor" color="var(--label)" /> {car.rating} · <MapPin size={11} /> {car.location.city}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>${car.pricePerDay}<span style={{ fontWeight: 400, fontSize: 13, color: 'var(--secondary-label)' }}>/day</span></span>
                  <button onClick={(e) => removeFav(e, car.id)} style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'var(--fill)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Heart size={14} fill="#ff3b30" stroke="#ff3b30" />
                  </button>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
