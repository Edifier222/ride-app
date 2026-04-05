import { useState, useEffect, useRef } from 'react';
import { searchRentals } from '../services/api';
import { listings as fakeListings, cities } from '../data/listings';

export function useSearch({ city, startDate, endDate, type, fuelType, make, model }) {
  const [results, setResults] = useState(fakeListings); // start with fake data
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ total: fakeListings.length });
  const [isLive, setIsLive] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    // Find city coordinates
    const cityData = cities.find(c => c.name.toLowerCase() === (city || '').toLowerCase());

    // If no city, show fake data
    if (!city) {
      setResults(fakeListings);
      setMeta({ total: fakeListings.length });
      setIsLive(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      try {
        const { listings, meta: apiMeta } = await searchRentals({
          city,
          lat: cityData?.lat,
          lng: cityData?.lng,
          dateFrom: startDate || undefined,
          dateTo: endDate || undefined,
          type: type !== 'All' ? type : undefined,
          limit: 50,
        });

        if (listings.length > 0) {
          setResults(listings);
          setMeta(apiMeta);
          setIsLive(true);
        } else {
          // Fallback to fake data filtered by city
          const filtered = fakeListings.filter(l =>
            l.location.city.toLowerCase().includes(city.toLowerCase())
          );
          setResults(filtered.length > 0 ? filtered : fakeListings);
          setMeta({ total: filtered.length || fakeListings.length });
          setIsLive(false);
        }
      } catch (err) {
        console.error('Search failed, using fake data:', err);
        const filtered = fakeListings.filter(l =>
          l.location.city.toLowerCase().includes(city.toLowerCase())
        );
        setResults(filtered.length > 0 ? filtered : fakeListings);
        setMeta({ total: filtered.length || fakeListings.length });
        setIsLive(false);
      }

      setLoading(false);
    };

    fetchData();
  }, [city, startDate, endDate, type]);

  return { results, loading, meta, isLive };
}
