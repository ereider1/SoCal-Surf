import type { ForecastTimeBlock } from '../types';
import { getDegreeToCardinal } from '../utils/surfRating';

interface ForecastCardProps {
  timeBlock: ForecastTimeBlock;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ timeBlock }) => {
  const { label, timeStr, data, surfRating, ratingExplanation, windType } = timeBlock;

  // Swell and wind directions (arrows represent where they are travelling TO)
  const swellRotation = (data.swellDirection + 180) % 360;
  const windRotation = (data.windDirection + 180) % 360;

  // Get wind badge classes and labels
  const windLabel = windType.charAt(0).toUpperCase() + windType.slice(1);
  const windBadgeClass = `wind-badge ${windType}`;

  // Get weather description
  const getWeatherDescription = (code: number): { text: string; emoji: string } => {
    if (code === 0) return { text: 'Clear Sky', emoji: '☀️' };
    if (code === 1 || code === 2) return { text: 'Partly Cloudy', emoji: '⛅' };
    if (code === 3) return { text: 'Overcast', emoji: '☁️' };
    if (code === 45 || code === 48) return { text: 'Foggy', emoji: '🌫️' };
    if (code >= 51 && code <= 55) return { text: 'Light Drizzle', emoji: '🌧️' };
    if (code >= 61 && code <= 65) return { text: 'Rainy', emoji: '🌧️' };
    if (code >= 80 && code <= 82) return { text: 'Rain Showers', emoji: '🌦️' };
    if (code >= 95) return { text: 'Thunderstorm', emoji: '⛈️' };
    return { text: 'Mild', emoji: '🌊' };
  };

  const weather = getWeatherDescription(data.weatherCode);

  // Render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="star filled">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="star empty">★</span>
        );
      }
    }
    return <div className="stars-container" title={`${rating}/5 stars`}>{stars}</div>;
  };

  return (
    <div className={`forecast-card ${windType}-card`}>
      <div className="card-header">
        <div className="time-info">
          <span className="time-label">{label}</span>
          <span className="time-exact">{timeStr}</span>
        </div>
        <div className="rating-badge">
          {renderStars(surfRating)}
        </div>
      </div>

      {/* Main Wave Height Display */}
      <div className="wave-height-hero">
        <span className="height-number">{data.waveHeightFeet.toFixed(1)}</span>
        <span className="height-unit">FT</span>
        <span className="wave-sub-info">
          at {data.wavePeriod.toFixed(0)}s period
        </span>
      </div>

      {/* Details Grid */}
      <div className="details-grid">
        {/* Swell Detail */}
        <div className="detail-item">
          <span className="detail-title">Swell</span>
          <div className="direction-display">
            <svg
              className="direction-arrow"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ transform: `rotate(${swellRotation}deg)` }}
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
            <div className="direction-values">
              <span className="detail-value">{data.swellHeightFeet.toFixed(1)} ft</span>
              <span className="detail-sub">{getDegreeToCardinal(data.swellDirection)} ({data.swellDirection.toFixed(0)}°)</span>
            </div>
          </div>
        </div>

        {/* Wind Detail */}
        <div className="detail-item">
          <span className="detail-title">Wind</span>
          <div className="direction-display">
            <svg
              className="direction-arrow"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ transform: `rotate(${windRotation}deg)` }}
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
            <div className="direction-values">
              <span className="detail-value">{data.windSpeedMph.toFixed(0)} mph</span>
              <span className="detail-sub">{getDegreeToCardinal(data.windDirection)} ({data.windDirection.toFixed(0)}°)</span>
            </div>
          </div>
          <span className={windBadgeClass}>{windLabel}</span>
        </div>

        {/* Weather Detail */}
        <div className="detail-item full-width-item">
          <span className="detail-title">Atmosphere</span>
          <div className="atmosphere-display">
            <span className="weather-emoji" role="img" aria-label={weather.text}>
              {weather.emoji}
            </span>
            <div className="atmosphere-values">
              <span className="detail-value">{data.temperatureF.toFixed(0)}°F</span>
              <span className="detail-sub">{weather.text}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-explanation">
        <p>{ratingExplanation}</p>
      </div>
    </div>
  );
};
