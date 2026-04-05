import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, MapPin, Zap, Star, ChevronRight, SlidersHorizontal, Navigation, Map, List } from 'lucide-react';
import { listings, cities } from '../../data/listings';
// leaflet CSS imported in global.css

function CarCard({ car, onTap, tripDays }) {
  const showTrip = tripDays > 0;
  return (
    <button className="card" onClick={() => onTap(car.id)} style={{
      width: '100%', textAlign: 'left', marginBottom: 16,
    }}>
      <div style={{ position: 'relative', paddingBottom: '60%', background: 'var(--surface-2)' }}>
        <img src={car.images[0]} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        {car.instantBook && (
          <span style={{ position: 'absolute', top: 12, left: 12, padding: '5px 10px', borderRadius: 'var(--r-pill)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: '#fff' }}>
            <Zap size={10} fill="currentColor" /> Instant
          </span>
        )}
        <div style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
      </div>
      <div style={{ padding: '14px 18px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
            {car.year} {car.make} {car.model}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 13, color: 'var(--accent-text)' }}>
            <Star size={12} fill="currentColor" /> {car.rating}
          </div>
        </div>

        {/* Trips + distance + dates row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8, flexWrap: 'wrap' }}>
          <span>{car.trips} trips</span>
          <span>·</span>
          <span>{((parseInt(car.id) * 7 % 80 + 5) / 10).toFixed(1)} mi away</span>
          {showTrip && (
            <>
              <span>·</span>
              <span style={{ color: 'var(--text-secondary)' }}>{tripDays} days</span>
            </>
          )}
          {car.instantBook && (
            <>
              <span>·</span>
              <span style={{ color: 'var(--success)' }}>Instant</span>
            </>
          )}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[car.fuelType, `${car.seats} seats`, car.milesIncluded + ' mi/day', car.delivery && 'Delivery'].filter(Boolean).map(tag => (
            <span key={tag} style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', padding: '3px 8px', background: 'var(--surface-2)', borderRadius: 'var(--r-pill)', letterSpacing: '0.02em' }}>{tag}</span>
          ))}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '0.5px solid var(--border)' }}>
          {showTrip ? (
            <>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>${car.pricePerDay}/day × {tripDays} days</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-text)' }}>${car.pricePerDay * tripDays} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-tertiary)' }}>before tax</span></span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>From</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent-text)' }}>${car.pricePerDay}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>/day</span>
              </div>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

export default function SearchTab({ onSelectCar }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(600);
  const [fuelFilter, setFuelFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [makeFilter, setMakeFilter] = useState('All');
  const [modelFilter, setModelFilter] = useState('All');
  const [transFilter, setTransFilter] = useState('All');
  const [seatsFilter, setSeatsFilter] = useState('All');
  const [featureFilters, setFeatureFilters] = useState([]);
  const [deliveryFilter, setDeliveryFilter] = useState(false);
  const [instantFilter, setInstantFilter] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const [brandExpanded, setBrandExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [selectedMapCar, setSelectedMapCar] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Unique values from data
  const allMakes = useMemo(() => Array.from(new Set(listings.map(l => l.make))).sort(), []);
  const brandModels = useMemo(() => {
    const map = {};
    listings.forEach(l => { if (!map[l.make]) map[l.make] = new Set(); map[l.make].add(l.model); });
    return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, Array.from(v).sort()]));
  }, []);
  const allFeatures = useMemo(() => Array.from(new Set(listings.flatMap(l => l.features))).sort(), []);

  // Search modal state
  const [searchCity, setSearchCity] = useState('');
  const [searchStart, setSearchStart] = useState('');
  const [searchEnd, setSearchEnd] = useState('');

  const filtered = useMemo(() => {
    let result = [...listings];
    if (city) result = result.filter(c => c.location.city.toLowerCase().includes(city.toLowerCase()));
    if (fuelFilter !== 'All') result = result.filter(c => c.fuelType === fuelFilter);
    if (typeFilter !== 'All') result = result.filter(c => c.type === typeFilter.toLowerCase());
    if (makeFilter !== 'All') result = result.filter(c => c.make === makeFilter);
    if (modelFilter !== 'All') result = result.filter(c => c.model === modelFilter);
    if (transFilter !== 'All') result = result.filter(c => c.transmission === transFilter);
    if (seatsFilter !== 'All') result = result.filter(c => String(c.seats) === seatsFilter);
    if (deliveryFilter) result = result.filter(c => c.delivery);
    if (instantFilter) result = result.filter(c => c.instantBook);
    if (featureFilters.length > 0) result = result.filter(c => featureFilters.every(f => c.features.includes(f)));
    result = result.filter(c => c.pricePerDay <= maxPrice);
    return result.sort((a, b) => b.rating - a.rating);
  }, [city, maxPrice, typeFilter, fuelFilter, makeFilter, modelFilter, transFilter, seatsFilter, deliveryFilter, instantFilter, featureFilters]);

  const activeFilterCount = [typeFilter !== 'All', fuelFilter !== 'All', makeFilter !== 'All', transFilter !== 'All', seatsFilter !== 'All', deliveryFilter, instantFilter, featureFilters.length > 0, maxPrice < 200].filter(Boolean).length;

  // Track if map has been fitted to bounds already
  const mapFittedRef = useRef(false);
  const markersRef = useRef([]);

  // Initialize Leaflet map — only once
  useEffect(() => {
    if (!showMap || !mapRef.current) return;
    let cancelled = false;
    import('leaflet').then(({ default: L }) => {
      if (cancelled || !mapRef.current) return;

      // Create map only once
      if (!mapInstanceRef.current) {
        const map = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: false,
          tap: true,
          dragging: true,
          touchZoom: true,
          scrollWheelZoom: true,
        }).setView([37.0, -98.0], 4);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
        mapInstanceRef.current = map;
        mapFittedRef.current = false;
      }

      const map = mapInstanceRef.current;

      // Remove old markers
      markersRef.current.forEach(m => map.removeLayer(m));
      markersRef.current = [];

      // Add new markers
      const bounds = [];
      const td = startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) : 0;

      filtered.forEach(car => {
        const lat = car.location.lat + (parseInt(car.id) * 0.002);
        const lng = car.location.lng + (parseInt(car.id) * 0.003);
        bounds.push([lat, lng]);
        const price = td > 0 ? `$${car.pricePerDay * td}` : `$${car.pricePerDay}`;
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:#C9A96E;color:#0A0A0A;padding:5px 12px;border-radius:20px;font-size:13px;font-weight:700;font-family:Inter,sans-serif;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.4);cursor:pointer">${price}</div>`,
          iconSize: [70, 30],
          iconAnchor: [35, 15],
        });
        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedMapCar(car));
        markersRef.current.push(marker);
      });

      // Only fit bounds once per city, not on every re-render
      if (bounds.length > 0 && !mapFittedRef.current) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
        mapFittedRef.current = true;
      }

      // Invalidate size after render
      setTimeout(() => map.invalidateSize(), 100);
    });
    return () => { cancelled = true; };
  }, [showMap, filtered, startDate, endDate]);

  // Reset fit when city changes
  useEffect(() => {
    mapFittedRef.current = false;
  }, [city]);
  const hasFilters = activeFilterCount > 0;

  const resetFilters = () => { setMaxPrice(200); setTypeFilter('All'); setFuelFilter('All'); setMakeFilter('All'); setModelFilter('All'); setTransFilter('All'); setSeatsFilter('All'); setFeatureFilters([]); setDeliveryFilter(false); setInstantFilter(false); setFilterSearch(''); setBrandExpanded(false); };

  const toggleFeatureFilter = (f) => setFeatureFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [calendarSelection, setCalendarSelection] = useState('start'); // 'start' or 'end'
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchStartTime, setSearchStartTime] = useState('10:00 AM');
  const [searchEndTime, setSearchEndTime] = useState('10:00 AM');

  // Location suggestions based on typing — only show when not confirmed
  // All major US cities for autocomplete — includes cities with 0 cars
  const allCities = useMemo(() => {
    const extraCities = [
      { name: 'Atlanta', state: 'GA' }, { name: 'Boston', state: 'MA' },
      { name: 'Charlotte', state: 'NC' }, { name: 'Chicago', state: 'IL' },
      { name: 'Dallas', state: 'TX' }, { name: 'Detroit', state: 'MI' },
      { name: 'Houston', state: 'TX' }, { name: 'Indianapolis', state: 'IN' },
      { name: 'Jacksonville', state: 'FL' }, { name: 'Kansas City', state: 'MO' },
      { name: 'Minneapolis', state: 'MN' }, { name: 'Nashville', state: 'TN' },
      { name: 'New Orleans', state: 'LA' }, { name: 'Orlando', state: 'FL' },
      { name: 'Philadelphia', state: 'PA' }, { name: 'Pittsburgh', state: 'PA' },
      { name: 'Portland', state: 'OR' }, { name: 'Raleigh', state: 'NC' },
      { name: 'Sacramento', state: 'CA' }, { name: 'Salt Lake City', state: 'UT' },
      { name: 'San Antonio', state: 'TX' }, { name: 'San Diego', state: 'CA' },
      { name: 'Scottsdale', state: 'AZ' }, { name: 'St. Louis', state: 'MO' },
      { name: 'Tampa', state: 'FL' }, { name: 'Tucson', state: 'AZ' },
      { name: 'Washington', state: 'DC' },
    ];
    const existing = new Set(cities.map(c => c.name));
    const merged = [...cities];
    extraCities.forEach(c => { if (!existing.has(c.name)) merged.push(c); });
    return merged.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const suggestions = searchCity.length > 0 && !locationConfirmed
    ? allCities.filter(c =>
        c.name.toLowerCase().startsWith(searchCity.toLowerCase()) ||
        c.state.toLowerCase().startsWith(searchCity.toLowerCase()) ||
        `${c.name}, ${c.state}`.toLowerCase().includes(searchCity.toLowerCase())
      ).slice(0, 6)
    : [];

  const openSearch = () => {
    setSearchCity(city);
    setSearchStart(startDate);
    setSearchEnd(endDate);
    setLocationConfirmed(!!city);
    setCalendarSelection('start');
    setShowCalendar(false);
    setSearchOpen(true);
  };

  const applySearch = () => {
    setCity(searchCity);
    setStartDate(searchStart);
    setEndDate(searchEnd);
    setSearchOpen(false);
    // Reset map when city changes so it re-centers
    if (searchCity !== city) {
      mapInstanceRef.current = null;
    }
  };

  const selectCity = (c) => {
    setSearchCity(c.name);
    setLocationConfirmed(true);
  };

  // Calendar helper — generate days for a month
  const generateMonth = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  const handleDayTap = (dateStr) => {
    if (!searchStart || calendarSelection === 'start') {
      setSearchStart(dateStr);
      setSearchEnd('');
      setCalendarSelection('end');
    } else {
      if (dateStr < searchStart) {
        setSearchStart(dateStr);
        setSearchEnd('');
        setCalendarSelection('end');
      } else {
        setSearchEnd(dateStr);
        setCalendarSelection('start');
        // Auto-close calendar once both dates are selected
        setTimeout(() => setShowCalendar(false), 400);
      }
    }
  };

  const isInRange = (dateStr) => {
    if (!searchStart || !searchEnd) return false;
    return dateStr >= searchStart && dateStr <= searchEnd;
  };

  const formatDateShort = (d) => {
    if (!d) return '';
    return new Date(d + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const searchSummary = () => {
    const parts = [];
    if (city) parts.push(city);
    if (startDate && endDate) parts.push(`${formatDateShort(startDate)} – ${formatDateShort(endDate)}`);
    return parts.length > 0 ? parts.join(' · ') : 'Where and when?';
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '20px 20px 24px',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, letterSpacing: '0.08em', lineHeight: 1 }}>
            <span className="text-gold">RIDE</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3, letterSpacing: '0.06em' }}>
            powered by <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Outdoorsy</span>
          </div>
          <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 12 }}>
            Professionally managed cars, <span style={{ color: 'var(--accent-text)', fontWeight: 500 }}>ready when you are.</span>
          </div>
        </div>

        {/* Search bar */}
        <button onClick={openSearch} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 18px', background: 'var(--surface-2)',
          borderRadius: 'var(--r-lg)', border: '1px solid var(--border)',
        }}>
          <Search size={20} color="var(--accent)" />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{
              fontSize: 16, fontWeight: city ? 500 : 400,
              color: city ? 'var(--text)' : 'var(--text-tertiary)',
            }}>
              {searchSummary()}
            </div>
          </div>
          {city && (
            <button onClick={(e) => { e.stopPropagation(); setCity(''); setStartDate(''); setEndDate(''); setShowMap(false); }} style={{ padding: 4 }}>
              <X size={16} color="var(--text-tertiary)" />
            </button>
          )}
        </button>
      </div>

      {/* Filter + map toggle */}
      <div style={{ padding: '12px 16px 0', display: 'flex', justifyContent: city ? 'space-between' : 'flex-end', alignItems: 'center' }}>
        {/* Map/List toggle — only when city is selected */}
        {city && (
          <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 'var(--r-pill)', padding: 2, border: '1px solid var(--border)' }}>
            <button onClick={() => setShowMap(false)} style={{
              padding: '6px 14px', borderRadius: 'var(--r-pill)', fontSize: 12, fontWeight: 600,
              background: !showMap ? 'var(--accent)' : 'transparent',
              color: !showMap ? 'var(--bg)' : 'var(--text-tertiary)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}><List size={13} /> List</button>
            <button onClick={() => setShowMap(true)} style={{
              padding: '6px 14px', borderRadius: 'var(--r-pill)', fontSize: 12, fontWeight: 600,
              background: showMap ? 'var(--accent)' : 'transparent',
              color: showMap ? 'var(--bg)' : 'var(--text-tertiary)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}><Map size={13} /> Map</button>
          </div>
        )}
        <button className="chip" onClick={() => setShowFilters(true)} style={{ padding: '6px 12px', fontSize: 13 }}>
          <SlidersHorizontal size={13} /> Filters
          {hasFilters && <span style={{ background: 'var(--accent)', color: 'var(--bg)', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilterCount}</span>}
        </button>
      </div>

      {/* Map view */}
      {showMap && (
        <div style={{ position: 'relative', touchAction: 'none' }} onTouchMove={e => e.stopPropagation()}>
          <div ref={mapRef} style={{ width: '100%', height: 'calc(100vh - 260px)', minHeight: 350, touchAction: 'none' }} />

          {/* Selected car preview card */}
          {selectedMapCar && (
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 1000 }}>
              <button className="card" onClick={() => onSelectCar(selectedMapCar.id, { startDate, endDate })} style={{ width: '100%', textAlign: 'left', display: 'flex', overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <img src={selectedMapCar.images[0]} alt="" style={{ width: 110, height: 80, objectFit: 'cover' }} />
                <div style={{ flex: 1, padding: '10px 14px' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 3 }}>
                    {selectedMapCar.year} {selectedMapCar.make} {selectedMapCar.model}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>
                    <Star size={11} fill="currentColor" color="var(--accent)" /> {selectedMapCar.rating} · {selectedMapCar.trips} trips
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-text)' }}>
                    {startDate && endDate
                      ? `$${selectedMapCar.pricePerDay * Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000)} total`
                      : `$${selectedMapCar.pricePerDay}/day`}
                  </div>
                </div>
              </button>
              <button onClick={() => setSelectedMapCar(null)} style={{
                position: 'absolute', top: -8, right: -4, width: 28, height: 28,
                borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><X size={14} /></button>
            </div>
          )}
        </div>
      )}

      {/* Car list */}
      {!showMap && <div style={{ padding: '8px 16px' }}>
        {filtered.length > 0 ? (
          filtered.map(car => <CarCard key={car.id} car={car} tripDays={startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) : 0} onTap={(id) => onSelectCar(id, { startDate, endDate })} />)
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Search size={28} color="var(--text-tertiary)" />
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: 6 }}>No cars found</div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Try a different location or adjust your filters</div>
            <button className="btn-secondary btn-sm" onClick={() => { setCity(''); setMaxPrice(600); setFuelFilter('All'); }}>Clear all filters</button>
          </div>
        )}
      </div>}

      {/* ========== SEARCH MODAL ========== */}
      {searchOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, background: 'var(--bg)', animation: 'slideUp 0.3s cubic-bezier(0.25,0.1,0.25,1)', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Plan your trip</span>
            <button onClick={() => setSearchOpen(false)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
            {/* WHERE */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 6, display: 'block' }}>WHERE</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="var(--accent)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input className="ios-input" placeholder="City or airport" value={searchCity} onChange={e => { setSearchCity(e.target.value); setLocationConfirmed(false); }} style={{ paddingLeft: 40 }} />
                {searchCity && <button onClick={() => { setSearchCity(''); setLocationConfirmed(false); }} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}><X size={16} color="var(--text-tertiary)" /></button>}
              </div>
              {suggestions.length > 0 && (
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', marginTop: 4, overflow: 'hidden' }}>
                  {suggestions.map(c => {
                    const carCount = listings.filter(l => l.location.city === c.name).length;
                    const hasCars = carCount > 0;
                    return (
                      <button key={c.name} onClick={() => selectCity(c)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', textAlign: 'left', borderBottom: '0.5px solid var(--border)', opacity: hasCars ? 1 : 0.7 }}>
                        <Navigation size={14} color={hasCars ? 'var(--accent)' : 'var(--text-tertiary)'} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 15 }}>{c.name}, {c.state}</span>
                        </div>
                        {hasCars ? (
                          <span style={{ fontSize: 12, color: 'var(--accent-text)', fontWeight: 500 }}>{carCount} car{carCount !== 1 ? 's' : ''}</span>
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 'var(--r-pill)' }}>Coming soon</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* WHEN — dates row */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>WHEN</label>
                {(searchStart || searchEnd) && <button onClick={() => { setSearchStart(''); setSearchEnd(''); setCalendarSelection('start'); }} style={{ fontSize: 12, color: 'var(--accent)' }}>Clear</button>}
              </div>
              <button onClick={() => setShowCalendar(!showCalendar)} style={{ width: '100%', display: 'flex', background: 'var(--surface)', borderRadius: 'var(--r-md)', border: showCalendar ? '1.5px solid var(--accent)' : '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ flex: 1, padding: '12px 14px', borderRight: '0.5px solid var(--border)', textAlign: 'left' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: 2 }}>PICK-UP</div>
                  <div style={{ fontSize: 15, fontWeight: searchStart ? 600 : 400, color: searchStart ? 'var(--text)' : 'var(--text-tertiary)' }}>{searchStart ? formatDateShort(searchStart) : 'Add date'}</div>
                </div>
                <div style={{ flex: 1, padding: '12px 14px', textAlign: 'left' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: 2 }}>RETURN</div>
                  <div style={{ fontSize: 15, fontWeight: searchEnd ? 600 : 400, color: searchEnd ? 'var(--text)' : 'var(--text-tertiary)' }}>{searchEnd ? formatDateShort(searchEnd) : 'Add date'}</div>
                </div>
                {searchStart && searchEnd && (
                  <div style={{ padding: '12px', borderLeft: '0.5px solid var(--border)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-text)' }}>{Math.ceil((new Date(searchEnd) - new Date(searchStart)) / 86400000)}d</span>
                  </div>
                )}
              </button>
            </div>

            {/* Calendar — collapsible */}
            {showCalendar && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{!searchStart ? 'Tap pick-up date' : !searchEnd ? 'Now tap return date' : 'Tap to change'}</div>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  {[0, 1].map(offset => {
                    const now = new Date();
                    const actualYear = now.getFullYear() + Math.floor((now.getMonth() + offset) / 12);
                    const actualMonth = (now.getMonth() + offset) % 12;
                    const monthName = new Date(actualYear, actualMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    const days = generateMonth(actualYear, actualMonth);
                    return (
                      <div key={offset} style={{ padding: '12px 10px', borderBottom: offset === 0 ? '0.5px solid var(--border)' : 'none' }}>
                        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{monthName}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 4 }}>
                          {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', padding: '2px 0' }}>{d}</div>)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center' }}>
                          {days.map((day, i) => {
                            if (!day) return <div key={i} />;
                            const dateStr = `${actualYear}-${String(actualMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isPast = dateStr < today;
                            const isStart = dateStr === searchStart;
                            const isEnd = dateStr === searchEnd;
                            const inRange = isInRange(dateStr);
                            const isSelected = isStart || isEnd;
                            return (
                              <button key={i} disabled={isPast} onClick={() => !isPast && handleDayTap(dateStr)} style={{
                                padding: '7px 0', fontSize: 14, minHeight: 34, fontWeight: isSelected ? 700 : 400,
                                color: isPast ? 'var(--text-tertiary)' : isSelected ? 'var(--bg)' : 'var(--text)',
                                background: isSelected ? 'var(--accent)' : inRange ? 'var(--accent-dim)' : 'transparent',
                                borderRadius: isStart && !isEnd ? '50% 0 0 50%' : isEnd && !isStart ? '0 50% 50% 0' : isSelected ? '50%' : 0,
                                opacity: isPast ? 0.3 : 1,
                              }}>{day}</button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TIME — show after dates picked and calendar closed */}
            {searchStart && searchEnd && !showCalendar && (
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>PICK-UP TIME</label>
                  <select value={searchStartTime} onChange={e => setSearchStartTime(e.target.value)} className="ios-input" style={{ fontSize: 15 }}>
                    {['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>RETURN TIME</label>
                  <select value={searchEndTime} onChange={e => setSearchEndTime(e.target.value)} className="ios-input" style={{ fontSize: 15 }}>
                    {['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Search button — inline, visible after time is set */}
            {searchCity && searchStart && searchEnd && !showCalendar && (
              <div style={{ marginBottom: 16 }}>
                <button className="btn-primary" onClick={applySearch}>
                  <Search size={18} /> Search cars
                </button>
              </div>
            )}

            {/* Popular cities — only when empty */}
            {!searchCity && !locationConfirmed && !showCalendar && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', marginBottom: 8 }}>POPULAR</div>
                <div className="ios-group">
                  {cities.slice(0, 5).map(c => (
                    <button key={c.name} className="ios-group-item" onClick={() => selectCity(c)} style={{ padding: '10px 14px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0 }}><img src={c.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                      <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{c.name}, {c.state}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Search button — fixed bottom, outside scrollable area */}
          <div style={{ flexShrink: 0, padding: '12px 20px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 20px))', borderTop: '0.5px solid var(--border)', background: 'var(--surface)' }}>
            <button className="btn-primary" onClick={applySearch} disabled={!searchCity}>
              <Search size={18} /> Search cars
            </button>
          </div>
        </div>
      )}

      {/* Filters — full screen, Apple-clean */}
      {showFilters && (() => {
        const Toggle = ({ on, onToggle, label }) => (
          <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
            <span style={{ fontSize: 16 }}>{label}</span>
            <div style={{ width: 50, height: 30, borderRadius: 15, background: on ? 'var(--success)' : 'var(--surface-3)', padding: 2, transition: 'background 0.2s' }}>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: '#fff', transform: on ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </button>
        );

        const filteredBrands = filterSearch
          ? allMakes.filter(m => m.toLowerCase().includes(filterSearch.toLowerCase()))
          : allMakes;

        return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'var(--bg)', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s cubic-bezier(0.25,0.1,0.25,1)' }}>
          {/* Header */}
          <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid var(--border)', flexShrink: 0 }}>
            <button onClick={() => { setShowFilters(false); setBrandExpanded(false); setFilterSearch(''); }} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Filters</span>
            <button onClick={() => { setShowFilters(false); setBrandExpanded(false); setFilterSearch(''); }} style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)' }}>Search</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>

            {/* Brand & Model — iOS settings style */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', padding: '12px 0 8px' }}>VEHICLE</div>
              <div className="ios-group">
                {/* Brand row — tappable to expand */}
                <button className="ios-group-item" onClick={() => { setBrandExpanded(!brandExpanded); setFilterSearch(''); }} style={{ padding: '14px 16px' }}>
                  <span style={{ flex: 1, fontSize: 16 }}>Brand</span>
                  <span style={{ fontSize: 15, color: makeFilter !== 'All' ? 'var(--accent-text)' : 'var(--text-tertiary)', marginRight: 4 }}>
                    {makeFilter !== 'All' ? makeFilter : 'All'}
                  </span>
                  <ChevronRight size={16} color="var(--text-tertiary)" style={{ transform: brandExpanded ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
                </button>

                {/* Expanded brand list with search */}
                {brandExpanded && (
                  <div style={{ borderTop: '0.5px solid var(--border)' }}>
                    {/* Search within brands */}
                    <div style={{ padding: '8px 12px' }}>
                      <input
                        className="ios-input"
                        placeholder="Search brands..."
                        value={filterSearch}
                        onChange={e => setFilterSearch(e.target.value)}
                        style={{ padding: '10px 14px', fontSize: 14 }}
                      />
                    </div>
                    {/* All option */}
                    <button onClick={() => { setMakeFilter('All'); setModelFilter('All'); setBrandExpanded(false); setFilterSearch(''); }} style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', borderBottom: '0.5px solid var(--border)',
                    }}>
                      <span style={{ fontSize: 15 }}>All brands</span>
                      {makeFilter === 'All' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}
                    </button>
                    {/* Brand list */}
                    {filteredBrands.map(brand => (
                      <button key={brand} onClick={() => { setMakeFilter(brand); setModelFilter('All'); setBrandExpanded(false); setFilterSearch(''); }} style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', borderBottom: '0.5px solid var(--border)',
                      }}>
                        <span style={{ fontSize: 15 }}>{brand}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{brandModels[brand]?.length} model{brandModels[brand]?.length !== 1 ? 's' : ''}</span>
                          {makeFilter === brand && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Model row — only show when brand is selected */}
                {makeFilter !== 'All' && (
                  <div style={{ borderTop: '0.5px solid var(--border)', padding: '8px 16px 12px' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>Model</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className={`chip ${modelFilter === 'All' ? 'active' : ''}`} onClick={() => setModelFilter('All')} style={{ fontSize: 13 }}>All</button>
                      {(brandModels[makeFilter] || []).map(m => (
                        <button key={m} className={`chip ${modelFilter === m ? 'active' : ''}`} onClick={() => setModelFilter(m)} style={{ fontSize: 13 }}>{m}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fuel + Transmission + Seats */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', padding: '12px 0 8px' }}>SPECIFICATIONS</div>
              <div className="ios-group">
                <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>Vehicle type</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['All', 'Car', 'SUV', 'Truck'].map(t => (
                      <button key={t} className={`chip ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)} style={{ fontSize: 13, flex: 1, justifyContent: 'center' }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>Fuel type</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['All', 'Gas', 'Electric', 'Hybrid'].map(f => (
                      <button key={f} className={`chip ${fuelFilter === f ? 'active' : ''}`} onClick={() => setFuelFilter(f)} style={{ fontSize: 13, flex: 1, justifyContent: 'center' }}>{f}</button>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--border)' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>Transmission</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['All', 'Automatic', 'Manual'].map(t => (
                      <button key={t} className={`chip ${transFilter === t ? 'active' : ''}`} onClick={() => setTransFilter(t)} style={{ fontSize: 13, flex: 1, justifyContent: 'center' }}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 8 }}>Minimum seats</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['All', '2', '4', '5', '7'].map(s => (
                      <button key={s} className={`chip ${seatsFilter === s ? 'active' : ''}`} onClick={() => setSeatsFilter(s)} style={{ fontSize: 13, flex: 1, justifyContent: 'center' }}>{s === 'All' ? 'Any' : s + '+'}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', padding: '12px 0 8px' }}>PRICE</div>
              <div className="ios-group" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Max per day</span>
                  <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--accent-text)' }}>${maxPrice}</span>
                </div>
                <input type="range" min={30} max={200} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>
                  <span>$30</span><span>$200</span>
                </div>
              </div>
            </div>

            {/* Booking options */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', padding: '12px 0 8px' }}>BOOKING</div>
              <div className="ios-group" style={{ padding: '0 16px' }}>
                <Toggle on={instantFilter} onToggle={() => setInstantFilter(!instantFilter)} label="Instant book" />
                <div style={{ borderTop: '0.5px solid var(--border)' }} />
                <Toggle on={deliveryFilter} onToggle={() => setDeliveryFilter(!deliveryFilter)} label="Delivery available" />
              </div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em', padding: '12px 0 8px' }}>FEATURES</div>
              <button onClick={() => setShowFeaturesModal(true)} className="ios-group" style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15 }}>
                  {featureFilters.length > 0 ? `${featureFilters.length} selected` : 'Select features'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {featureFilters.length > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-text)' }}>{featureFilters.join(', ').slice(0, 30)}{featureFilters.join(', ').length > 30 ? '...' : ''}</span>}
                  <ChevronRight size={16} color="var(--text-tertiary)" />
                </div>
              </button>
            </div>
          </div>

          {/* Features modal */}
          {showFeaturesModal && (
            <>
              <div className="sheet-backdrop" onClick={() => setShowFeaturesModal(false)} />
              <div className="sheet" style={{ padding: '0 20px 24px', maxHeight: '60vh' }}>
                <div className="sheet-handle" />
                <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>Features</span>
                  <button onClick={() => setFeatureFilters([])} style={{ fontSize: 14, color: 'var(--accent)' }}>Clear</button>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: '40vh', paddingBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {allFeatures.map(f => (
                      <button key={f} className={`chip ${featureFilters.includes(f) ? 'active' : ''}`} onClick={() => toggleFeatureFilter(f)} style={{ fontSize: 14, padding: '10px 16px' }}>{f}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setShowFeaturesModal(false)} style={{
                  width: '100%', padding: '14px 24px', borderRadius: 'var(--r-md)',
                  background: '#2D9F6F', color: '#fff',
                  fontSize: 16, fontWeight: 700,
                }}>
                  Done{featureFilters.length > 0 ? ` · ${featureFilters.length} selected` : ''}
                </button>
              </div>
            </>
          )}

          {/* Search + reset — always visible at bottom */}
          <div style={{ flexShrink: 0, padding: '12px 20px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 20px))', borderTop: '0.5px solid var(--border)', background: 'var(--surface)' }}>
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} style={{ width: '100%', textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 10, textDecoration: 'underline' }}>
                Reset all filters
              </button>
            )}
            <button onClick={() => { setShowFilters(false); setBrandExpanded(false); setFilterSearch(''); }} style={{
              width: '100%', padding: '16px 24px', borderRadius: 'var(--r-md)',
              background: '#C9A96E', color: '#0A0A0A',
              fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-display)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(201,169,110,0.3)',
            }}>
              <Search size={18} /> Search · {filtered.length} car{filtered.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
