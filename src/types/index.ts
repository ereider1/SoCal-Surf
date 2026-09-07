export interface SurfSpot {
  id: string;
  name: string;
  county: string;
  latitude: number;
  longitude: number;
  description: string;
  optimalSwellDirections: string[]; // e.g. ["S", "SW", "W"]
  optimalWindDirection: number; // angle in degrees which is perfectly offshore
  offshoreDirectionText: string; // e.g. "NE" or "N"
  coastlineAngle: number; // approximate angle of coastline (90 degrees to this is offshore)
}

export interface SurfForecastHour {
  time: string; // ISO format or hour string
  waveHeightMeters: number;
  waveHeightFeet: number;
  wavePeriod: number;
  waveDirection: number;
  swellHeightMeters: number;
  swellHeightFeet: number;
  swellPeriod: number;
  swellDirection: number;
  windSpeedMph: number;
  windDirection: number;
  temperatureF: number;
  weatherCode: number;
}

export interface ForecastTimeBlock {
  label: 'Morning' | 'Afternoon' | 'Evening';
  timeStr: string; // e.g. "9:00 AM"
  data: SurfForecastHour;
  surfRating: number; // 1 to 5 stars
  ratingExplanation: string;
  windType: 'offshore' | 'onshore' | 'cross-shore' | 'light';
}

export interface DailyForecast {
  date: string; // e.g. "Monday, Sep 7"
  dateKey: string; // e.g. "2026-09-07"
  timeBlocks: ForecastTimeBlock[];
  averageRating: number;
  maxWaveHeightFeet: number;
  minWaveHeightFeet: number;
}

export interface SpotForecastData {
  spot: SurfSpot;
  dailyForecasts: DailyForecast[];
}
