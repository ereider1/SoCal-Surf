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
    id: 'zuma',
    name: 'Zuma Beach',
    county: 'Los Angeles',
    latitude: 34.0220,
    longitude: -118.8219,
    description: 'A wide, sandy beach break in northern Malibu known for its heavy shorebreak and fast, punchy waves. It catches a lot of swell but can be closed-out when it gets too big. Great for summer south swells and clean morning conditions.',
    optimalSwellDirections: ['S', 'SW', 'W', 'WNW'],
    optimalWindDirection: 350, // N winds are offshore
    offshoreDirectionText: 'N',
    coastlineAngle: 260, // faces South-Southwest
  },
  {
    id: 'malibu',
    name: 'Malibu (Surfrider Beach)',
    county: 'Los Angeles',
    latitude: 34.0350,
    longitude: -118.6787,
    description: 'The iconic Southern California point break. Malibu is world-famous for its long, peeling right-handers that are perfect for longboarders. It shines on southern swells.',
    optimalSwellDirections: ['S', 'SW', 'WSW', 'SSE'],
    optimalWindDirection: 345, // N / NNE winds are offshore
    offshoreDirectionText: 'N',
    coastlineAngle: 255, // faces South-Southwest
  },
  {
    id: 'huntington-beach',
    name: 'Huntington Beach (Pier)',
    county: 'Orange County',
    latitude: 33.6558,
    longitude: -118.0038,
    description: 'Known as "Surf City USA", HB Pier offers consistent beach break peaks on almost any swell. It handles various swell directions and thrives on South/Southwest swells in the summer and West/Northwest in winter.',
    optimalSwellDirections: ['S', 'SW', 'W', 'NW', 'WSW'],
    optimalWindDirection: 45, // NE winds are offshore
    offshoreDirectionText: 'NE',
    coastlineAngle: 315, // faces Southwest
  },
  {
    id: 'wedge',
    name: 'The Wedge',
    county: 'Orange County',
    latitude: 33.5931,
    longitude: -117.8819,
    description: 'A legendary, highly dramatic bodyboarding and surfing wave. Waves refracting off the Newport Harbor jetty collide with incoming swells to create giant, side-washing wedge peaks that slam directly onto dry sand.',
    optimalSwellDirections: ['S', 'SSW', 'SW', 'SSE'],
    optimalWindDirection: 45, // NE winds are offshore
    offshoreDirectionText: 'NE',
    coastlineAngle: 315, // faces Southwest
  },
  {
    id: 'trestles',
    name: 'Lower Trestles',
    county: 'San Diego',
    latitude: 33.3828,
    longitude: -117.5975,
    description: 'The crown jewel of Southern California surf. A cobblestone A-frame reef break that provides skatepark-like performance waves for both lefts and rights. Thrives on southern hemisphere swells.',
    optimalSwellDirections: ['S', 'SW', 'WSW', 'W'],
    optimalWindDirection: 45, // NE/E winds are offshore
    offshoreDirectionText: 'NE',
    coastlineAngle: 315, // faces Southwest
  },
  {
    id: 'swamis',
    name: "Swami's (Encinitas)",
    county: 'San Diego',
    latitude: 33.0347,
    longitude: -117.2925,
    description: 'A classic, high-quality right-hand point break that wraps around a rocky reef. Named after the Self-Realization Fellowship temple overlooking the cliff, it works best on solid West and Northwest winter swells.',
    optimalSwellDirections: ['W', 'WNW', 'NW', 'WSW'],
    optimalWindDirection: 90, // E winds are offshore
    offshoreDirectionText: 'E',
    coastlineAngle: 0, // faces West
  },
  {
    id: 'blacks-beach',
    name: "Black's Beach",
    county: 'San Diego',
    latitude: 32.8886,
    longitude: -117.2530,
    description: 'A powerful, heavy beach break magnified by a deep underwater canyon just offshore. It funnels deep ocean swells into giant, hollow peaks. A premier spot for experienced surfers, best on solid NW winter swells.',
    optimalSwellDirections: ['W', 'WNW', 'NW', 'SW'],
    optimalWindDirection: 90, // E winds are offshore
    offshoreDirectionText: 'E',
    coastlineAngle: 0, // faces West
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
