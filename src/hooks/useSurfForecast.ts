import { useState, useEffect } from 'react';
import type { SurfSpot, SpotForecastData } from '../types';
import { fetchSurfForecast } from '../services/weatherService';
import { SURF_SPOTS } from '../utils/surfRating';

const defaultSpot = SURF_SPOTS.find((s) => s.id === 'rincon') || SURF_SPOTS[0];

export function useSurfForecast() {
  const [selectedSpot, setSelectedSpot] = useState<SurfSpot>(defaultSpot);
  const [forecastData, setForecastData] = useState<SpotForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadForecast() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSurfForecast(selectedSpot);
        if (active) {
          setForecastData(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred while fetching surf data.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadForecast();

    return () => {
      active = false;
    };
  }, [selectedSpot]);

  const selectSpotById = (id: string) => {
    const spot = SURF_SPOTS.find((s) => s.id === id);
    if (spot) {
      setSelectedSpot(spot);
    }
  };

  return {
    spots: SURF_SPOTS,
    selectedSpot,
    forecastData,
    loading,
    error,
    selectSpotById,
  };
}
