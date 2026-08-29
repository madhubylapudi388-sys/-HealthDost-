/**
 * Geolocation and Distance Utilities for HealthDost
 */

export interface GeolocationCoords {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface CityLocationPreset {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  type: 'metro' | 'tier2' | 'rural_hub';
}

export const POPULAR_LOCATION_PRESETS: CityLocationPreset[] = [
  { id: 'delhi_central', name: 'New Delhi (Central)', state: 'Delhi NCR', lat: 28.6139, lng: 77.2090, type: 'metro' },
  { id: 'mumbai_dadar', name: 'Mumbai (Dadar/Central)', state: 'Maharashtra', lat: 19.0178, lng: 72.8478, type: 'metro' },
  { id: 'bengaluru_koramangala', name: 'Bengaluru (Koramangala/HSR)', state: 'Karnataka', lat: 12.9352, lng: 77.6245, type: 'metro' },
  { id: 'hyderabad_secunderabad', name: 'Hyderabad (Charminar/Secunderabad)', state: 'Telangana', lat: 17.3850, lng: 78.4867, type: 'metro' },
  { id: 'chennai_t_nagar', name: 'Chennai (T. Nagar/Central)', state: 'Tamil Nadu', lat: 13.0418, lng: 80.2341, type: 'metro' },
  { id: 'kolkata_howrah', name: 'Kolkata (Park Street/Howrah)', state: 'West Bengal', lat: 22.5726, lng: 88.3639, type: 'metro' },
  { id: 'pune_kothrud', name: 'Pune (Shivajinagar/Kothrud)', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, type: 'tier2' },
  { id: 'ahmedabad_navrangpura', name: 'Ahmedabad (Navrangpura)', state: 'Gujarat', lat: 23.0225, lng: 72.5714, type: 'tier2' },
  { id: 'jaipur_mansarovar', name: 'Jaipur (Mansarovar/Pink City)', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, type: 'tier2' },
  { id: 'lucknow_hazratganj', name: 'Lucknow (Hazratganj/Alambagh)', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, type: 'tier2' },
  { id: 'patna_kankarbagh', name: 'Patna (Kankarbagh/Gandhi Maidan)', state: 'Bihar', lat: 25.5941, lng: 85.1376, type: 'tier2' },
  { id: 'varanasi_cantt', name: 'Varanasi (Cantt/Sigra)', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, type: 'tier2' },
  { id: 'visakhapatnam_gajuwaka', name: 'Visakhapatnam (RK Beach/Gajuwaka)', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, type: 'tier2' },
  { id: 'vijayawada_benz_circle', name: 'Vijayawada (Benz Circle/Governorpet)', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, type: 'tier2' },
  { id: 'bhopal_mp_nagar', name: 'Bhopal (MP Nagar/Arera)', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, type: 'tier2' },
  { id: 'indore_palasia', name: 'Indore (Palasia/Vijay Nagar)', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, type: 'tier2' },
  { id: 'coimbatore_rs_puram', name: 'Coimbatore (RS Puram/Gandhipuram)', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, type: 'tier2' },
  { id: 'chandigarh_sec17', name: 'Chandigarh (Sector 17/PGIMER)', state: 'Punjab & Haryana', lat: 30.7333, lng: 76.7794, type: 'tier2' },
  { id: 'ranchi_doranda', name: 'Ranchi (Doranda/Main Road)', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, type: 'tier2' },
  { id: 'guwahati_paltan_bazar', name: 'Guwahati (Paltan Bazar/GMC)', state: 'Assam', lat: 26.1445, lng: 91.7362, type: 'tier2' },
  { id: 'rural_mandal_hub_1', name: 'Nalgonda / Suryapet Rural Taluk Hub', state: 'Telangana', lat: 17.0575, lng: 79.2684, type: 'rural_hub' },
  { id: 'rural_mandal_hub_2', name: 'Sitapur / Lakhimpur Rural PHC Zone', state: 'Uttar Pradesh', lat: 27.5667, lng: 80.6833, type: 'rural_hub' },
  { id: 'rural_mandal_hub_3', name: 'Satara / Karad Rural Health Block', state: 'Maharashtra', lat: 17.6805, lng: 74.0183, type: 'rural_hub' }
];

/**
 * Calculates straight-line distance in kilometers using the Haversine formula
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Formats distance into a human-readable metric string
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Gets the current position from navigator.geolocation
 */
export function getBrowserGeolocation(
  highAccuracy = true,
  timeoutMs = 12000
): Promise<{ lat: number; lng: number; accuracy: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your current browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let msg = 'Unable to determine your current location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission was denied. Please allow location access or choose your city from presets.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is currently unavailable. Checking nearby area presets.';
            break;
          case error.TIMEOUT:
            msg = 'GPS location request timed out. Please retry or select your region.';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: highAccuracy,
        timeout: timeoutMs,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Reverse geocodes coordinates to a human-friendly locality name
 */
export async function reverseGeocodeLocality(lat: number, lng: number): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HealthDost-Applet/1.0',
        },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const locality =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.village ||
        addr.town ||
        addr.city_district ||
        addr.city ||
        addr.county ||
        addr.state_district;
      const cityOrState = addr.city || addr.town || addr.state || '';

      if (locality && cityOrState && locality !== cityOrState) {
        return `${locality}, ${cityOrState}`;
      } else if (locality) {
        return locality;
      } else if (data.display_name) {
        return data.display_name.split(',').slice(0, 2).join(',').trim();
      }
    }
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
  }

  // Fallback to nearest preset city or coordinates
  const nearestPreset = findNearestPreset(lat, lng);
  if (nearestPreset && nearestPreset.distance < 45) {
    return `${nearestPreset.preset.name}, ${nearestPreset.preset.state}`;
  }

  return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
}

/**
 * Finds the closest city preset for given coordinates
 */
export function findNearestPreset(lat: number, lng: number): { preset: CityLocationPreset; distance: number } | null {
  let closest: CityLocationPreset | null = null;
  let minDistance = Infinity;

  for (const preset of POPULAR_LOCATION_PRESETS) {
    const d = calculateHaversineDistanceKm(lat, lng, preset.lat, preset.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = preset;
    }
  }

  return closest ? { preset: closest, distance: minDistance } : null;
}
