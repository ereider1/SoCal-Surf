import type { SurfSpot, SurfForecastHour, DailyForecast, SpotForecastData, ForecastTimeBlock } from '../types';
import { calculateSurfRating } from '../utils/surfRating';

/**
 * Fetches and normalizes surf forecast data for a given spot using Open-Meteo APIs.
 */
export async function fetchSurfForecast(spot: SurfSpot): Promise<SpotForecastData> {
  const { latitude, longitude } = spot;
  const timezone = 'America/Los_Angeles';

  // 1. Construct URLs
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=wind_speed_10m,wind_direction_10m,temperature_2m,weather_code&timezone=${timezone}&wind_speed_unit=mph`;
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${latitude}&longitude=${longitude}&hourly=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_direction,swell_wave_period&timezone=${timezone}`;

  try {
    // 2. Fetch in parallel
    const [weatherRes, marineRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(marineUrl),
    ]);

    if (!weatherRes.ok || !marineRes.ok) {
      throw new Error('Failed to retrieve forecast data from weather services.');
    }

    const weatherData = await weatherRes.json();
    const marineData = await marineRes.json();

    const hourlyWeather = weatherData.hourly;
    const hourlyMarine = marineData.hourly;

    if (!hourlyWeather || !hourlyMarine || !hourlyWeather.time || !hourlyMarine.time) {
      throw new Error('Invalid data structure received from APIs.');
    }

    // 3. Align and merge hourly data
    const mergedHours: SurfForecastHour[] = [];
    const totalHours = Math.min(hourlyWeather.time.length, hourlyMarine.time.length);

    for (let i = 0; i < totalHours; i++) {
      const time = hourlyWeather.time[i];
      const waveHeightM = hourlyMarine.wave_height[i] || 0;
      const swellHeightM = hourlyMarine.swell_wave_height[i] || 0;

      mergedHours.push({
        time,
        waveHeightMeters: waveHeightM,
        waveHeightFeet: waveHeightM * 3.28084,
        wavePeriod: hourlyMarine.wave_period[i] || 0,
        waveDirection: hourlyMarine.wave_direction[i] || 0,
        swellHeightMeters: swellHeightM,
        swellHeightFeet: swellHeightM * 3.28084,
        swellPeriod: hourlyMarine.swell_wave_period[i] || 0,
        swellDirection: hourlyMarine.swell_wave_direction[i] || 0,
        windSpeedMph: hourlyWeather.wind_speed_10m[i] || 0,
        windDirection: hourlyWeather.wind_direction_10m[i] || 0,
        temperatureF: hourlyWeather.temperature_2m[i] || 60,
        weatherCode: hourlyWeather.weather_code[i] || 0,
      });
    }

    // 4. Group by day (each day has 24 hourly readings)
    // We group hourly records into days. Each day's date key is YYYY-MM-DD
    const daysMap: { [key: string]: SurfForecastHour[] } = {};
    mergedHours.forEach((hour) => {
      const dateKey = hour.time.substring(0, 10); // Extract "YYYY-MM-DD"
      if (!daysMap[dateKey]) {
        daysMap[dateKey] = [];
      }
      daysMap[dateKey].push(hour);
    });

    const dailyForecasts: DailyForecast[] = [];

    // Sort the dates to ensure chronological order
    const sortedDateKeys = Object.keys(daysMap).sort();

    // Map each date's data to a DailyForecast
    sortedDateKeys.forEach((dateKey) => {
      const hours = daysMap[dateKey];
      if (hours.length < 24) return; // Skip incomplete days if any

      // Find representative hours for Morning, Afternoon, Evening
      // Morning (9 AM -> index 9), Afternoon (3 PM -> index 15), Evening (6 PM -> index 18)
      const morningData = hours[9];
      const afternoonData = hours[15];
      const eveningData = hours[18];

      if (!morningData || !afternoonData || !eveningData) return;

      // Calculate Ratings for each time block
      const morningRating = calculateSurfRating(spot, morningData);
      const afternoonRating = calculateSurfRating(spot, afternoonData);
      const eveningRating = calculateSurfRating(spot, eveningData);

      const timeBlocks: ForecastTimeBlock[] = [
        {
          label: 'Morning',
          timeStr: '9:00 AM',
          data: morningData,
          surfRating: morningRating.rating,
          ratingExplanation: morningRating.explanation,
          windType: morningRating.windType,
        },
        {
          label: 'Afternoon',
          timeStr: '3:00 PM',
          data: afternoonData,
          surfRating: afternoonRating.rating,
          ratingExplanation: afternoonRating.explanation,
          windType: afternoonRating.windType,
        },
        {
          label: 'Evening',
          timeStr: '6:00 PM',
          data: eveningData,
          surfRating: eveningRating.rating,
          ratingExplanation: eveningRating.explanation,
          windType: eveningRating.windType,
        },
      ];

      // Calculate Daily Statistics
      // Wave height ranges during daylight hours (6 AM to 8 PM, index 6 to 20)
      const daylightHours = hours.slice(6, 21);
      const waveHeights = daylightHours.map(h => h.waveHeightFeet);
      const maxWaveHeightFeet = Math.max(...waveHeights);
      const minWaveHeightFeet = Math.min(...waveHeights);

      const averageRating = Math.round(
        (morningRating.rating + afternoonRating.rating + eveningRating.rating) / 3
      );

      // Format date beautifully, e.g. "Monday, Sep 7"
      const dateObj = new Date(dateKey + 'T00:00:00-07:00'); // enforce local PST interpretation
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });

      dailyForecasts.push({
        date: formattedDate,
        dateKey,
        timeBlocks,
        averageRating,
        maxWaveHeightFeet,
        minWaveHeightFeet,
      });
    });

    return {
      spot,
      dailyForecasts: dailyForecasts.slice(0, 7), // Limit to 7 days forecast
    };

  } catch (error) {
    console.error('Error fetching surf forecast:', error);
    throw error;
  }
}
