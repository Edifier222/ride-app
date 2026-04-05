// RIDE API Service — connects to Outdoorsy backend
const SEARCH_API = 'https://search.staging.outdoorsy.com';
const CORE_API = 'https://api.staging.outdoorsy.com/v0';
const PARTNER_ID = 'yK2b7Kmdqp0f2wOo7JqWxt650LmNQjdU';

// Generate realistic content for fields the API doesn't return
function generateDescription(name, type, city, state, fuelType) {
  const descs = {
    suv: `Perfect for exploring ${city}. This ${name} offers plenty of space, comfort, and versatility for any adventure — from city streets to mountain roads.`,
    truck: `Ready for anything in ${city}. This ${name} handles hauling, towing, and daily driving with ease. Perfect for work or weekend adventures.`,
    car: `Reliable and comfortable for your ${city} trip. This ${name} delivers great fuel economy and a smooth ride wherever you go.`,
  };
  const extra = fuelType === 'Electric' ? ' Zero emissions and ultra-quiet driving experience.' : '';
  return (descs[type] || descs.car) + extra;
}

function generateHostBio(hostName) {
  const bios = [
    'Professional fleet manager with years of experience in vehicle rentals. Every car is detailed and inspected before each trip.',
    'Dedicated to providing the best rental experience. All vehicles are professionally maintained and ready for your next adventure.',
    'Running a premium fleet of well-maintained vehicles. Fast response times and flexible pickup options available.',
    'Committed to quality and customer satisfaction. Each vehicle in the fleet is kept in excellent condition.',
  ];
  return bios[Math.abs(hashCode(hostName)) % bios.length];
}

function generateReviews(carId) {
  const reviewPool = [
    { author: 'Michael P.', rating: 5, text: 'Spotless car, easy pickup. Would rent again!', date: '2026-03-15' },
    { author: 'Jennifer W.', rating: 5, text: 'Great communication and the car was perfect for our trip.', date: '2026-03-10' },
    { author: 'Robert S.', rating: 4, text: 'Good value for the price. Car was clean and ran well.', date: '2026-02-28' },
    { author: 'Amanda C.', rating: 5, text: 'Best rental experience. The host went above and beyond.', date: '2026-02-20' },
    { author: 'Chris D.', rating: 5, text: 'Smooth process from booking to return. Highly recommend.', date: '2026-02-15' },
    { author: 'Nicole B.', rating: 4, text: 'Car was great, pickup location was convenient.', date: '2026-01-30' },
  ];
  const idx = Math.abs(hashCode(String(carId))) % reviewPool.length;
  return [reviewPool[idx], reviewPool[(idx + 1) % reviewPool.length], reviewPool[(idx + 2) % reviewPool.length]];
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
  return hash;
}

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
      images: (() => {
        const imgs = primaryImage ? [primaryImage.url, ...images.filter(u => u !== primaryImage.url)] : images;
        if (imgs.length > 0) return imgs;
        // Fallback: real editorial photos by make+model from Car and Driver
        const nameLower = (attrs.name || '').toLowerCase();
        const fallbackByModel = {
          'corolla': 'https://hips.hearstapps.com/hmg-prod/images/2026-toyota-corolla-hybrid-se-awd-204-697a5f6d1689a.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'camry': 'https://hips.hearstapps.com/hmg-prod/images/2026-toyota-camry-se-hybrid-nightshade-fwd-155-695bf27312d0c.jpg?crop=0.77xw:0.64xh;0.16xw,0.26xh&resize=800:*',
          'altima': 'https://hips.hearstapps.com/hmg-prod/images/2025-nissan-altima-sv-special-edition-9-695be69714b9a.jpg?crop=0.79xw:0.66xh;0.18xw,0.31xh&resize=800:*',
          'sentra': 'https://hips.hearstapps.com/hmg-prod/images/2026-nissan-sentra-sl-105-699c7d5eb77f7.jpg?crop=0.8xw:0.68xh;0.1xw,0.22xh&resize=800:*',
          'focus': 'https://hips.hearstapps.com/hmg-prod/images/2017-ford-focus-1557785498.jpg?crop=1xw:0.92xh;0,0.08xh&resize=800:*',
          'fusion': 'https://hips.hearstapps.com/hmg-prod/images/2020-ford-fusion-mmp-1-1568742907.jpeg?crop=0.64xw:0.54xh;0.32xw,0.43xh&resize=800:*',
          'soul': 'https://hips.hearstapps.com/hmg-prod/images/18861-2023-soul-1651667384.jpg?crop=0.61xw:0.65xh;0.19xw,0.28xh&resize=800:*',
          'optima': 'https://hips.hearstapps.com/hmg-prod/images/2025-k5-03-65c4e39963e2d.jpg?crop=0.7xw:0.59xh;0.2xw,0.28xh&resize=800:*',
          'elantra': 'https://hips.hearstapps.com/hmg-prod/images/2024-hyundai-elantra-limited-120-64ef85e5113c4.jpg?crop=0.76xw:0.65xh;0.12xw,0.32xh&resize=800:*',
          'prius': 'https://hips.hearstapps.com/hmg-prod/images/2025-toyota-prius-xle-fwd-lt-470-68654d4ede4ae.jpg?crop=0.75xw:0.63xh;0.21xw,0.28xh&resize=800:*',
          'santa fe': 'https://hips.hearstapps.com/hmg-prod/images/2024-hyundai-santa-fe-calligraphy-awd-101-6568a97b81a95.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'forester': 'https://hips.hearstapps.com/hmg-prod/images/2025-subaru-forester-touring-101-66c393e8ce3c0.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'f-150': 'https://hips.hearstapps.com/hmg-prod/images/2024-ford-f-150-xlt-402a-102-655c7e363e093.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'explorer': 'https://hips.hearstapps.com/hmg-prod/images/2025-ford-explorer-st-101-66e06b6f2cec3.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'yukon': 'https://hips.hearstapps.com/hmg-prod/images/2024-gmc-yukon-denali-ultimate-101-654daa1b5dc3d.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'suburban': 'https://hips.hearstapps.com/hmg-prod/images/2024-chevrolet-suburban-rst-101-6568ee74d8c00.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'trailblazer': 'https://hips.hearstapps.com/hmg-prod/images/2024-chevrolet-trailblazer-rs-101-6568ef6bcc5bb.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'trax': 'https://hips.hearstapps.com/hmg-prod/images/2024-chevrolet-trax-activ-102-64ec3e5fe6de3.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'lightning': 'https://hips.hearstapps.com/hmg-prod/images/2024-ford-f-150-lightning-flash-101-654c1b9d9a437.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'sequoia': 'https://hips.hearstapps.com/hmg-prod/images/2024-toyota-sequoia-trd-pro-101-654c16f79ca62.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'nsx': 'https://hips.hearstapps.com/hmg-prod/images/2024-acura-integra-type-s-102-64fed8e82a42c.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'xj': 'https://hips.hearstapps.com/hmg-prod/images/2024-jaguar-f-type-r-75-coupe-awd-101-6582a55f9f09e.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
          'denali': 'https://hips.hearstapps.com/hmg-prod/images/2024-gmc-sierra-1500-at4x-aev-edition-101-65a20ebab2381.jpg?crop=0.6xw:0.5xh;0.2xw,0.36xh&resize=800:*',
        };
        const modelMatch = Object.keys(fallbackByModel).find(m => nameLower.includes(m));
        return [modelMatch ? fallbackByModel[modelMatch] : 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&h=500&fit=crop'];
      })(),
      features: Object.entries(attrs.FeaturesMap || {})
        .filter(([_, v]) => v === true || v === 'true')
        .map(([k]) => k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
        .slice(0, 6),
      description: attrs.description || generateDescription(
        attrs.name || '', attrs.type || 'car',
        attrs.location?.city || '', attrs.location?.state || '',
        attrs.FeaturesMap?.fuel_type || 'Gas'
      ),
      slug: attrs.slug || '',
      seats: attrs.seatbelts || 5,
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
      rating: attrs.average_reviews?.score || (3.5 + (parseInt(item.id) % 15) / 10),
      trips: attrs.average_reviews?.count || (10 + parseInt(item.id) % 50),
      host: (() => {
        const oid = ownerRef?.id || item.id;
        const hostNames = ['Marcus J.', 'Sarah K.', 'David R.', 'Emily T.', 'James L.', 'Lisa M.', 'Carlos P.', 'Rachel W.', 'Mike H.', 'Anna S.', 'Brian D.', 'Jessica F.'];
        const hostAvatars = [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        ];
        const idx = Math.abs(hashCode(String(oid))) % hostNames.length;
        const avatarIdx = Math.abs(hashCode(String(oid))) % hostAvatars.length;
        const fn = owner?.first_name;
        const ln = owner?.last_name;
        const displayName = fn ? `${fn} ${(ln || '').charAt(0)}.`.trim() : hostNames[idx];
        return {
          id: oid,
          name: displayName,
          firstName: fn || displayName.split(' ')[0],
          avatar: owner?.avatar || hostAvatars[avatarIdx],
          rating: owner?.average_rating || (4.5 + (parseInt(oid) % 5) / 10),
          trips: owner?.rentals_count || (20 + parseInt(oid) % 100),
          joined: owner?.created ? new Date(owner.created).getFullYear().toString() : '2024',
          responseRate: 90 + parseInt(oid) % 10,
          responseTime: 'within an hour',
          bio: generateHostBio(displayName),
        };
      })(),
      reviews: generateReviews(item.id),
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
      body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName, country: 'US', locale: 'en-us' }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Signup failed');
    return json;
  } catch (err) {
    console.error('Signup error:', err);
    throw err;
  }
}

// Create a quote (real price calculation)
export async function createQuote({ rentalId, dateFrom, dateTo, token }) {
  try {
    const res = await fetch(`${CORE_API}/quotes`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        rental_id: parseInt(rentalId),
        from: dateFrom,
        to: dateTo,
        reserve: true,
        trip_credits_disabled: true,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Quote failed');
    return json;
  } catch (err) {
    console.error('Quote error:', err);
    throw err;
  }
}

// Get quote details
export async function getQuote(quoteId, token) {
  try {
    const res = await fetch(`${CORE_API}/quotes/${quoteId}`, {
      headers: getAuthHeaders(token),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Quote fetch failed');
    return json;
  } catch (err) {
    console.error('Quote fetch error:', err);
    throw err;
  }
}

// Create a booking from a quote
export async function createBooking({ quoteId, rentalId, dateFrom, dateTo, firstName, lastName, email, token }) {
  try {
    const res = await fetch(`${CORE_API}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({
        quote_id: quoteId,
        rental_id: parseInt(rentalId),
        from: dateFrom,
        to: dateTo,
        status: 'negotiating',
        first_name: firstName || '',
        last_name: lastName || '',
        email: email || '',
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Booking failed');
    return json;
  } catch (err) {
    console.error('Booking error:', err);
    throw err;
  }
}

// Get booking details
export async function getBooking(bookingId, token) {
  try {
    const res = await fetch(`${CORE_API}/bookings/${bookingId}`, {
      headers: getAuthHeaders(token),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Booking fetch failed');
    return json;
  } catch (err) {
    console.error('Booking fetch error:', err);
    throw err;
  }
}

// Persona ID Verification
const PERSONA_TEMPLATE_AUTO = 'itmpl_yGBvUKenYmQTWcRL9kpjtX1m8Ajz';
const PERSONA_ENVIRONMENT = 'sandbox'; // staging uses sandbox

export function getPersonaConfig() {
  return {
    templateId: PERSONA_TEMPLATE_AUTO,
    environment: PERSONA_ENVIRONMENT,
  };
}

// Get ID verification status / session
export async function getIdVerification(token) {
  try {
    const res = await fetch(`${CORE_API}/drivers/id-verification`, {
      headers: getAuthHeaders(token),
    });
    const json = await res.json();
    if (!res.ok) return null;
    return json;
  } catch (err) {
    console.error('ID verification fetch error:', err);
    return null;
  }
}

// Check if user's ID is verified
export async function checkIdVerified(userId, token) {
  try {
    const res = await fetch(`${CORE_API}/verify/${userId}/id-verified`, {
      headers: getAuthHeaders(token),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('ID verify check error:', err);
    return null;
  }
}

// Phone verification
export async function sendPhoneVerification(phone, token) {
  try {
    const res = await fetch(`${CORE_API}/verify/phone`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ phone }),
    });
    return await res.json();
  } catch (err) {
    console.error('Phone verify error:', err);
    throw err;
  }
}

// Google OAuth — open popup to Outdoorsy's Google login
export function startGoogleLogin() {
  return new Promise((resolve, reject) => {
    const url = `${CORE_API}/auth/google/login`;
    const width = 500, height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const popup = window.open(url, 'google-login', `width=${width},height=${height},left=${left},top=${top}`);

    if (!popup) {
      // Popup blocked — redirect instead
      window.location.href = url;
      reject(new Error('Popup blocked'));
      return;
    }

    // Poll the popup for the callback
    const interval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(interval);
          reject(new Error('Login cancelled'));
          return;
        }
        // Check if popup redirected back with a token
        const popupUrl = popup.location.href;
        if (popupUrl.includes('token=') || popupUrl.includes('/auth/google/callback')) {
          clearInterval(interval);
          const params = new URLSearchParams(popup.location.search || popup.location.hash.slice(1));
          const token = params.get('token');
          popup.close();
          if (token) resolve({ token });
          else reject(new Error('No token in callback'));
        }
      } catch (e) {
        // Cross-origin — popup still on Google's domain, keep waiting
      }
    }, 500);

    // Timeout after 2 minutes
    setTimeout(() => { clearInterval(interval); popup.close(); reject(new Error('Login timeout')); }, 120000);
  });
}

export async function finalizePhoneVerification(code, token) {
  try {
    const res = await fetch(`${CORE_API}/verify/phone/finalize`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ code }),
    });
    return await res.json();
  } catch (err) {
    console.error('Phone finalize error:', err);
    throw err;
  }
}
