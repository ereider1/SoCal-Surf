import type { SurfSpot, SurfForecastHour } from '../types';

export const SURF_SPOTS: SurfSpot[] = [
  {
    id: 'rincon',
    name: 'Rincon Beach',
    county: 'Ventura / Santa Barbara',
    latitude: 34.3731,
    longitude: -119.4772,
    description: 'The "Queen of the Coast". Rincon is an incredibly long, high-quality right-hand cobblestone point break. It is world-renowned for its perfect peeling sections that light up on strong West/Northwest swells in winter.',
    optimalSwellDirections: ['W', 'WNW', 'NW'],
    optimalWindDirection: 15, // N/NNE winds are offshore
    offshoreDirectionText: 'N',
    coastlineAngle: 285, // faces South-Southwest
  },
  {
    id: 'c-street',
    name: 'C-Street (Ventura Point)',
    county: 'Ventura',
    latitude: 34.2741,
    longitude: -119.3025,
    description: 'A classic, highly popular right-hand cobblestone point break. It offers long, peeling waves that are perfect for all skill levels, with multiple peaks stretching from Ventura Point into the cove.',
    optimalSwellDirections: ['W', 'WNW', 'NW', 'SW'],
    optimalWindDirection: 35, // NE winds are offshore
    offshoreDirectionText: 'NE',
    coastlineAngle: 305, // faces Southwest
  },
  {
    id: 'mondos',
    name: 'Mondos Cove',
    county: 'Ventura',
    latitude: 34.3128,
    longitude: -119.4215,
    description: 'A super mellow, soft beach break located just north of Ventura. Known for its slow, gentle right-hand rollers, Mondos is the ultimate beginner, longboard, and family-friendly spot in the area.',
    optimalSwellDirections: ['W', 'WNW', 'NW', 'SW'],
    optimalWindDirection: 20, // N/NE winds are offshore
    offshoreDirectionText: 'N',
    coastlineAngle: 290, // faces Southwest
  },
  {
    id: 'silver-strand',
    name: 'Silver Strand (Oxnard)',
    county: 'Ventura',
    latitude: 34.1550,
    longitude: -119.2225,
    description: 'A powerful, fast, and heavy sand-bottom beach break that can produce world-class hollow barrels. Breaks best on solid swells and is known for its intense shorebreak and punchy peaks.',
    optimalSwellDirections: ['SW', 'W', 'WNW', 'NW'],
    optimalWindDirection: 45, // NE winds are offshore
    offshoreDirectionText: 'NE',
    coastlineAngle: 315, // faces Southwest
  },
  {
    id: 'carpinteria-state',
    name: 'Carpinteria State Beach',
    county: 'Santa Barbara',
    latitude: 34.3910,
    longitude: -119.5210,
    description: 'A gentle, sandy beach break just minutes north of Rincon. Ideal for longboarding, swimming, and beginner lessons, it offers slow-peeling peaks that break over a soft sand bottom.',
    optimalSwellDirections: ['W', 'WNW', 'WSW', 'SW'],
    optimalWindDirection: 15, // N/NNE winds are offshore
    offshoreDirectionText: 'N',
    coastlineAngle: 285, // faces South-Southwest
  },
  {
    id: 'leadbetter',
    name: 'Leadbetter Point',
    county: 'Santa Barbara',
    latitude: 34.4015,
    longitude: -119.6995,
    description: 'A beautiful, slow, and highly consistent point break located right in Santa Barbara. Great for longboarders and beginners, it needs large West swells to wrap around the Channel Islands and line up.',
    optimalSwellDirections: ['W', 'WNW', 'Wsw'],
    optimalWindDirection: 350, // N winds are offshore
    offshoreDirectionText: 'N',
    coastlineAngle: 260, // faces South
  },
  {
    id: 'sands',
    name: 'Sands Beach (Goleta)',
    county: 'Santa Barbara',
    latitude: 34.4095,
    longitude: -119.8785,
    description: 'A scenic beach and reef break located behind UCSB. Very popular with local students, it features fun left and right peaks that break consistently and handle moderate wind swell well.',
    optimalSwellDirections: ['W', 'WNW', 'NW'],
    optimalWindDirection: 10, // N winds are offshore
    offshoreDirectionText: 'N',
    coastlineAngle: 280, // faces South-Southwest
  },
  {
    id: 'jalama',
    name: 'Jalama Beach',
    county: 'Santa Barbara',
    latitude: 34.5125,
    longitude: -120.5050,
    description: 'A wild, remote, and highly exposed beach break in northern Santa Barbara County. It catches almost any swell running through the Pacific, offering powerful, heavy peaks, though it can get very windy.',
    optimalSwellDirections: ['NW', 'WNW', 'W', 'SW'],
    optimalWindDirection: 75, // E/NE winds are offshore
    offshoreDirectionText: 'E',
    coastlineAngle: 345, // faces West-Southwest
  }
];

export function getDegreeToCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[index];
}

export function calculateSurfRating(
  spot: SurfSpot,
  hourData: Omit<SurfForecastHour, 'time' | 'waveHeightFeet' | 'swellHeightFeet'>
): { rating: number; explanation: string; windType: 'offshore' | 'onshore' | 'cross-shore' | 'light' } {
  const waveHeightFt = hourData.waveHeightMeters * 3.28084;
  const swellCardinal = getDegreeToCardinal(hourData.swellDirection);
  
  let score = 3.0; // start with average
  let explanationParts: string[] = [];

  // 1. Evaluate Wave Height
  if (waveHeightFt < 1.0) {
    score = 1.0;
    explanationParts.push('Flat conditions');
    return { rating: 1, explanation: 'Flat or near flat. Unridable.', windType: 'light' };
  } else if (waveHeightFt < 2.0) {
    score = 2.0;
    explanationParts.push('Very small waves');
  } else if (waveHeightFt >= 2.0 && waveHeightFt < 3.5) {
    score = 3.0;
    explanationParts.push('Playable, small-to-medium surf');
  } else if (waveHeightFt >= 3.5 && waveHeightFt < 6.0) {
    score = 4.0;
    explanationParts.push('Fun, shoulder-to-head high surf');
  } else if (waveHeightFt >= 6.0) {
    score = 4.5;
    explanationParts.push('Solid, overhead surf');
  }

  // 2. Evaluate Wave Period (Energy)
  if (hourData.wavePeriod >= 14) {
    score += 0.8;
    explanationParts.push('long-period groundswell offering great power');
  } else if (hourData.wavePeriod >= 11) {
    score += 0.4;
    explanationParts.push('clean groundswell energy');
  } else if (hourData.wavePeriod < 8) {
    score -= 0.8;
    explanationParts.push('short-period windswell (weak and crumbly)');
  } else {
    explanationParts.push('average swell period');
  }

  // 3. Evaluate Wind Direction relative to the Spot
  let windType: 'offshore' | 'onshore' | 'cross-shore' | 'light' = 'cross-shore';
  
  if (hourData.windSpeedMph < 4.0) {
    windType = 'light';
    score += 0.8;
    explanationParts.push('glassy and calm wind conditions');
  } else {
    // Calculate angle difference
    let diff = Math.abs(hourData.windDirection - spot.optimalWindDirection) % 360;
    diff = diff > 180 ? 360 - diff : diff;

    if (diff <= 50) {
      windType = 'offshore';
      if (hourData.windSpeedMph <= 10) {
        score += 1.0;
        explanationParts.push('perfect light offshore winds keeping it clean');
      } else if (hourData.windSpeedMph <= 16) {
        score += 0.5;
        explanationParts.push('moderate offshore breeze grooming the waves');
      } else {
        score -= 0.4;
        explanationParts.push('strong offshore winds blowing waves down');
      }
    } else if (diff >= 120) {
      windType = 'onshore';
      if (hourData.windSpeedMph <= 7) {
        score -= 0.4;
        explanationParts.push('light onshore chop');
      } else if (hourData.windSpeedMph <= 12) {
        score -= 1.2;
        explanationParts.push('messy onshore texture and crumble');
      } else {
        score -= 2.0;
        explanationParts.push('completely blown out by strong onshore winds');
      }
    } else {
      windType = 'cross-shore';
      if (hourData.windSpeedMph <= 8) {
        explanationParts.push('light cross-shore breeze with slight bump');
      } else {
        score -= 0.8;
        explanationParts.push('side-shore texture causing bumpy faces');
      }
    }
  }

  // 4. Evaluate Swell Direction Wrap
  const isSwellOptimal = spot.optimalSwellDirections.some(dir => {
    // Exact match or partial match (e.g., "SW" in swell direction)
    return dir === swellCardinal || swellCardinal.includes(dir) || dir.includes(swellCardinal);
  });

  if (isSwellOptimal) {
    score += 0.3;
    explanationParts.push('optimal swell angle directly hitting the spot');
  } else {
    // Swell might be shadowed
    score -= 0.5;
    explanationParts.push('swell angle is sub-optimal for this break');
  }

  // Final score clamping
  let rating = Math.round(score);
  if (rating < 1) rating = 1;
  if (rating > 5) rating = 5;

  // Synthesize explanation
  const header = rating >= 4 ? 'Great' : rating === 3 ? 'Fair' : rating === 2 ? 'Poor' : 'Very Poor';
  const description = `${header} conditions. ${explanationParts[0]} with ${explanationParts[1] || 'average conditions'}. Affected by ${explanationParts[2] || 'light winds'}.`;

  return {
    rating,
    explanation: description,
    windType
  };
}
