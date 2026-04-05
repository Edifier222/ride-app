import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, ChevronDown } from 'lucide-react';
import CarCard from '../components/CarCard';
import { listings } from '../data/listings';

const TYPES = ['All', 'Car', 'SUV', 'Truck'];
const FUEL_TYPES = ['All', 'Gas', 'Electric', 'Hybrid'];
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || '';

  const [cityFilter, setCityFilter] = useState(initialCity);
  const [typeFilter, setTypeFilter] = useState('All');
  const [fuelFilter, setFuelFilter] = useState('All');
  const [priceMax, setPriceMax] = useState(600);
  const [sort, setSort] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCars = useMemo(() => {
    let result = [...listings];

    if (cityFilter) {
      result = result.filter(c =>
        c.location.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }
    if (typeFilter !== 'All') {
      result = result.filter(c => c.type === typeFilter.toLowerCase());
    }
    if (fuelFilter !== 'All') {
      result = result.filter(c => c.fuelType === fuelFilter);
    }
    result = result.filter(c => c.pricePerDay <= priceMax);

    switch (sort) {
      case 'price-low': result.sort((a, b) => a.pricePerDay - b.pricePerDay); break;
      case 'price-high': result.sort((a, b) => b.pricePerDay - a.pricePerDay); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => b.trips - a.trips);
    }

    return result;
  }, [cityFilter, typeFilter, fuelFilter, priceMax, sort]);

  const clearFilters = () => {
    setCityFilter('');
    setTypeFilter('All');
    setFuelFilter('All');
    setPriceMax(600);
    setSort('recommended');
    setSearchParams({});
  };

  const hasFilters = cityFilter || typeFilter !== 'All' || fuelFilter !== 'All' || priceMax < 600;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Search header */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-light)', padding: 'var(--space-5) 0' }}>
        <div className="container">
          {/* Search input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--chip-gray)',
            borderRadius: 'var(--radius-pill)',
            padding: '10px 20px',
            maxWidth: 500,
            marginBottom: 'var(--space-4)',
          }}>
            <MapPin size={18} color="var(--body-gray)" />
            <input
              type="text"
              placeholder="Search by city..."
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                flex: 1,
                fontSize: 15,
              }}
            />
            {cityFilter && (
              <button onClick={() => setCityFilter('')} style={{ display: 'flex' }}>
                <X size={16} color="var(--muted-gray)" />
              </button>
            )}
          </div>

          {/* Filter bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Type chips */}
            {TYPES.map(type => (
              <button
                key={type}
                className={`btn btn-chip ${typeFilter === type ? 'active' : ''}`}
                onClick={() => setTypeFilter(type)}
                style={{ fontSize: 13, padding: '8px 14px' }}
              >{type}</button>
            ))}

            <div style={{ width: 1, height: 24, background: 'var(--border-light)' }} />

            {/* Fuel type */}
            {FUEL_TYPES.map(fuel => (
              <button
                key={fuel}
                className={`btn btn-chip ${fuelFilter === fuel ? 'active' : ''}`}
                onClick={() => setFuelFilter(fuel)}
                style={{ fontSize: 13, padding: '8px 14px' }}
              >{fuel}</button>
            ))}

            <div style={{ width: 1, height: 24, background: 'var(--border-light)' }} />

            {/* Price range */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--body-gray)' }}>Max</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>${priceMax}/day</span>
              <input
                type="range"
                min={30}
                max={600}
                value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                style={{ width: 100, accentColor: 'var(--black)' }}
              />
            </div>

            <div style={{ flex: 1 }} />

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                background: 'var(--chip-gray)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ fontSize: 13, color: 'var(--body-gray)' }}>
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <p style={{ color: 'var(--body-gray)', fontSize: 14, marginBottom: 'var(--space-6)' }}>
          <strong style={{ color: 'var(--black)' }}>{filteredCars.length}</strong> cars available
          {cityFilter && <> in <strong style={{ color: 'var(--black)' }}>{cityFilter}</strong></>}
        </p>

        {filteredCars.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-6)',
          }}>
            {filteredCars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No cars found</p>
            <p style={{ color: 'var(--body-gray)', marginBottom: 'var(--space-6)' }}>
              Try adjusting your filters or searching a different city.
            </p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
