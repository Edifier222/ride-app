import { Heart, Star, MapPin } from 'lucide-react';
import { listings } from '../../data/listings';
import useIsDesktop from '../../hooks/useIsDesktop';

const fmt = (n) => typeof n === "number" ? "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "$" + n;

export default function FavoritesTab({ favoriteIds, onToggleFavorite, onSelectCar }) {
  const isDesktop = useIsDesktop();
  const favorites = listings.filter(c => favoriteIds.has(c.id));

  return (
    <div style={{ minHeight: '100%' }}>
      <div style={{
        padding: isDesktop ? '0' : '16px 16px 12px',
        background: isDesktop ? 'transparent' : 'rgba(22,22,22,0.85)',
        backdropFilter: isDesktop ? 'none' : 'blur(24px)',
      }}>
        {!isDesktop && <h1 className="text-large-title">Favorites</h1>}
      </div>

      <div className={isDesktop ? 'desktop-list-layout' : ''} style={isDesktop ? {} : { padding: '8px 16px' }}>
        {isDesktop && <h1 className="text-title1" style={{ marginBottom: 20 }}>Favorites</h1>}
        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Heart size={48} color="var(--text-tertiary)" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 6 }}>No favorites yet</div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Tap the heart on any car to save it here</div>
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
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={11} fill="currentColor" color="var(--accent)" /> {car.rating} · <MapPin size={11} /> {car.location.city}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700 }}>{fmt(car.pricePerDay)}<span style={{ fontWeight: 400, fontSize: 13, color: 'var(--text-secondary)' }}>/day</span></span>
                  <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(car.id); }} style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2)',
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
