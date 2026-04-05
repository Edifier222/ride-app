// RIDE API Service — connects to Outdoorsy backend
const SEARCH_API = 'https://search.outdoorsy.com';
const CORE_API = 'https://api.staging.outdoorsy.com/v0';
const PARTNER_ID = 'yK2b7Kmdqp0f2wOo7JqWxt650LmNQjdU';

const headers = {
  'Partner-ID': PARTNER_ID,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

function getAuthHeaders(token) {
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
}

// Parse JSON:API response — extract data + included into flat objects
function parseJsonApi(response) {
  const { data, included = [], meta = {} } = response;

  // Build lookup for included resources (images, owners, etc.)
  const includedMap = {};
  included.forEach(item => {
    const key = `${item.type}-${item.id}`;
    includedMap[key] = { id: item.id, type: item.type, ...item.attributes };
  });

  // Flatten each rental
  const listings = (Array.isArray(data) ? data : [data]).map(item => {
    const attrs = item.attributes || {};
    const rels = item.relationships || {};

    // Get primary image
    const primaryImageRef = rels.primary_image?.data;
    const primaryImage = primaryImageRef
      ? includedMap[`${primaryImageRef.type}-${primaryImageRef.id}`]
      : null;

    // Get all images
    const imageRefs = rels.images?.data || [];
    const images = imageRefs
      .map(ref => includedMap[`${ref.type}-${ref.id}`])
      .filter(Boolean)
      .map(img => img.url);

    // Get owner
    const ownerRef = rels.owner?.data;
    const owner = ownerRef ? includedMap[`${ownerRef.type}-${ownerRef.id}`] : null;

    return {
      id: String(item.id),
      name: attrs.name || attrs.vehicle_title || '',
      type: attrs.type || 'car',
      rentalCategory: attrs.rental_category,
      year: parseInt(attrs.name?.match(/^\d{4}/)?.[0]) || null,
      make: attrs.name?.replace(/^\d{4}\s+/, '').split(' ')[0] || '',
      model: attrs.name?.replace(/^\d{4}\s+\S+\s*/, '') || '',
      displayVehicleType: attrs.display_vehicle_type || attrs.type,
      pricePerDay: Math.round((attrs.price_per_day || 0) / 100),
      location: {
        city: attrs.location?.city || '',
        state: attrs.location?.state || '',
        lat: attrs.location?.lat || 0,
        lng: attrs.location?.lng || 0,
      },
      images: primaryImage ? [primaryImage.url, ...images.filter(u => u !== primaryImage.url)] : images,
      features: Object.entries(attrs.FeaturesMap || {})
        .filter(([_, v]) => v === true || v === 'true')
        .map(([k]) => k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
        .slice(0, 6),
      description: attrs.description || '',
      slug: attrs.slug || '',
      seats: attrs.sleeps || 5, // auto doesn't use sleeps, default 5
      doors: 4,
      transmission: 'Automatic',
      fuelType: attrs.FeaturesMap?.fuel_type || 'Gas',
      mpg: '',
      cancelPolicy: attrs.cancel_policy || 'flexible',
      instantBook: attrs.instant_book || false,
      delivery: attrs.delivery || false,
      deliveryFee: 0,
      milesIncluded: 200,
      extraMileRate: 0.35,
      rating: attrs.average_reviews?.score || 0,
      trips: attrs.average_reviews?.count || 0,
      host: owner ? {
        id: ownerRef.id,
        name: `${owner.first_name || ''} ${(owner.last_name || '').charAt(0)}.`.trim(),
        firstName: owner.first_name || '',
        avatar: owner.avatar || '',
        rating: owner.average_rating || 0,
        trips: owner.rentals_count || 0,
        joined: owner.created ? new Date(owner.created).getFullYear().toString() : '',
        responseRate: 95,
        responseTime: 'within an hour',
        bio: '',
      } : {
        id: 0, name: 'Host', firstName: 'Host', avatar: '', rating: 4.8, trips: 0,
        joined: '2024', responseRate: 95, responseTime: 'within an hour', bio: '',
      },
      reviews: [],
      raw: attrs, // keep raw for debugging
    };
  });

  return { listings, meta };
}

// Search auto rentals
export async function searchRentals({ city, state, lat, lng, dateFrom, dateTo, type, limit = 24, offset = 0 } = {}) {
  const params = new URLSearchParams();
  params.set('filter[rental_category]', 'auto');
  params.set('page[limit]', String(limit));
  params.set('page[offset]', String(offset));

  if (lat && lng) {
    params.set('filter[lat]', String(lat));
    params.set('filter[lng]', String(lng));
  }
  if (dateFrom) params.set('date[from]', dateFrom);
  if (dateTo) params.set('date[to]', dateTo);
  if (type && type !== 'All') params.set('filter[type]', type.toLowerCase());

  const url = `${SEARCH_API}/rentals?${params.toString()}`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    const json = await res.json();
    return parseJsonApi(json);
  } catch (err) {
    console.error('Search error:', err);
    return { listings: [], meta: {} };
  }
}

// Get single rental detail
export async function getRental(id) {
  try {
    const res = await fetch(`${CORE_API}/rentals/${id}`, { headers });
    if (!res.ok) throw new Error(`Rental fetch failed: ${res.status}`);
    const json = await res.json();

    // Core API returns flat format, not JSON:API
    if (Array.isArray(json)) {
      // It's the old format — single item in array
      const item = json[0];
      if (!item) return null;
      return flattenCoreRental(item);
    }
    // JSON:API format
    return parseJsonApi(json).listings[0] || null;
  } catch (err) {
    console.error('Rental detail error:', err);
    return null;
  }
}

// Flatten a core API rental (non-JSON:API format)
function flattenCoreRental(r) {
  return {
    id: String(r.id),
    name: `${r.vehicle?.year || ''} ${r.vehicle?.make || ''} ${r.vehicle?.model || ''}`.trim(),
    type: r.type || 'car',
    rentalCategory: r.rental_category,
    year: r.vehicle?.year,
    make: r.vehicle?.make || '',
    model: r.vehicle?.model || '',
    displayVehicleType: r.display_vehicle_type || r.type,
    pricePerDay: Math.round((r.active_price?.day || 0) / 100),
    location: {
      city: r.location?.city || r.home?.city || '',
      state: r.location?.state || r.home?.state || '',
      lat: r.location?.lat || r.home?.lat || 0,
      lng: r.location?.lng || r.home?.lng || 0,
    },
    images: (r.images || []).map(img => img.url).filter(Boolean),
    features: Object.entries(r.features || {})
      .filter(([_, v]) => v === true)
      .map(([k]) => k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
      .slice(0, 6),
    description: r.description || '',
    slug: r.slug || '',
    seats: r.seatbelts || 5,
    doors: 4,
    transmission: 'Automatic',
    fuelType: r.features?.fuel_type || 'Gas',
    cancelPolicy: r.cancel_policy || 'flexible',
    instantBook: r.instant_book || false,
    delivery: r.delivery || false,
    deliveryFee: r.delivery_usage_item?.price ? Math.round(r.delivery_usage_item.price / 100) : 0,
    milesIncluded: 200,
    extraMileRate: 0.35,
    rating: r.average_reviews?.score || 0,
    trips: r.average_reviews?.count || 0,
    host: {
      id: r.owner?.id || 0,
      name: `${r.owner?.first_name || 'Host'} ${(r.owner?.last_name || '').charAt(0)}.`.trim(),
      firstName: r.owner?.first_name || 'Host',
      avatar: r.owner?.avatar || '',
      rating: r.owner?.average_rating || 4.8,
      trips: 0,
      joined: '2024',
      responseRate: 95,
      responseTime: 'within an hour',
      bio: '',
    },
    reviews: [],
  };
}

// Login
export async function login(email, password) {
  try {
    const res = await fetch(`${CORE_API}/auth/creds/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    return json;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

// Signup
export async function signup({ email, password, firstName, lastName }) {
  try {
    const res = await fetch(`${CORE_API}/auth/creds/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Signup failed');
    return json;
  } catch (err) {
    console.error('Signup error:', err);
    throw err;
  }
}
