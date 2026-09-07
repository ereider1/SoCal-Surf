import React, { useState } from 'react';
import type { DailyForecast } from '../types';
import { ForecastCard } from './ForecastCard';

interface DailyForecastListProps {
  dailyForecasts: DailyForecast[];
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({ dailyForecasts }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [showWeeklySummary, setShowWeeklySummary] = useState<boolean>(false);

  const activeForecast = dailyForecasts[selectedDayIndex];

  if (!activeForecast) {
    return (
      <div className="empty-forecast">
        <p>No forecast data available for this spot.</p>
      </div>
    );
  }

  // Helper to extract short day (e.g., "Mon") and date (e.g., "Sep 7")
  const parseShortDate = (dateStr: string) => {
    // Expected format: "Monday, Sep 7"
    const parts = dateStr.split(', ');
    if (parts.length >= 2) {
      const weekdayFull = parts[0];
      const weekdayShort = weekdayFull.substring(0, 3);
      const calendarDate = parts[1];
      return { weekdayShort, calendarDate };
    }
    return { weekdayShort: dateStr.substring(0, 3), calendarDate: dateStr };
  };

  return (
    <div className="forecast-section">
      {/* Tab/Day Selector */}
      <div className="day-selector-container">
        <div className="day-tabs-scroll">
          {dailyForecasts.map((forecast, index) => {
            const { weekdayShort, calendarDate } = parseShortDate(forecast.date);
            const isSelected = index === selectedDayIndex;
            
            return (
              <button
                key={forecast.dateKey}
                type="button"
                className={`day-tab ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedDayIndex(index)}
              >
                <span className="tab-weekday">{weekdayShort}</span>
                <span className="tab-date">{calendarDate}</span>
                <span className="tab-wave-range">
                  {forecast.minWaveHeightFeet.toFixed(0)}-{forecast.maxWaveHeightFeet.toFixed(0)} ft
                </span>
                <div className="tab-rating-dots">
                  {Array.from({ length: forecast.averageRating }).map((_, i) => (
                    <span key={i} className="dot-gold">★</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Switches */}
      <div className="forecast-controls">
        <h2 className="selected-day-title">
          {activeForecast.date} Forecast
        </h2>
        <button
          type="button"
          className="toggle-summary-btn"
          onClick={() => setShowWeeklySummary(!showWeeklySummary)}
        >
          {showWeeklySummary ? 'Show Daily Details' : 'Show 7-Day Overview'}
        </button>
      </div>

      {/* Conditional Rendering: 7-Day Summary Table vs. Daily Cards */}
      {showWeeklySummary ? (
        <div className="weekly-summary-card animate-fade-in">
          <h3 className="summary-title">7-Day Surf Outlook</h3>
          <p className="summary-subtitle">Overview of daytime wave heights, average ratings, and wind patterns.</p>
          
          <div className="table-responsive">
            <table className="weekly-summary-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Wave Range</th>
                  <th>Wind (Morning)</th>
                  <th>Wind (Afternoon)</th>
                  <th>Avg Rating</th>
                  <th>Conditions</th>
                </tr>
              </thead>
              <tbody>
                {dailyForecasts.map((forecast, index) => {
                  const morningBlock = forecast.timeBlocks[0];
                  const afternoonBlock = forecast.timeBlocks[1];
                  
                  // Rate condition summary
                  let summaryText = 'Poor';
                  if (forecast.averageRating >= 4) summaryText = 'Excellent';
                  else if (forecast.averageRating === 3) summaryText = 'Good';
                  else if (forecast.averageRating === 2) summaryText = 'Fair';

                  return (
                    <tr 
                      key={forecast.dateKey} 
                      className={`summary-row ${index === selectedDayIndex ? 'highlighted' : ''}`}
                      onClick={() => {
                        setSelectedDayIndex(index);
                        setShowWeeklySummary(false);
                      }}
                    >
                      <td>
                        <strong>{forecast.date.split(', ')[0]}</strong>
                        <div className="small-date">{forecast.date.split(', ')[1]}</div>
                      </td>
                      <td className="range-column">
                        <span className="wave-pill">
                          {forecast.minWaveHeightFeet.toFixed(1)} - {forecast.maxWaveHeightFeet.toFixed(1)} ft
                        </span>
                      </td>
                      <td>
                        <span className={`wind-dot ${morningBlock.windType}`} />
                        {morningBlock.data.windSpeedMph.toFixed(0)} mph {morningBlock.windType}
                      </td>
                      <td>
                        <span className={`wind-dot ${afternoonBlock.windType}`} />
                        {afternoonBlock.data.windSpeedMph.toFixed(0)} mph {afternoonBlock.windType}
                      </td>
                      <td>
                        <div className="stars-column">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`star-mini ${i < forecast.averageRating ? 'filled' : ''}`}>★</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`cond-badge rating-${forecast.averageRating}`}>
                          {summaryText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="time-blocks-grid animate-fade-in">
          {activeForecast.timeBlocks.map((timeBlock) => (
            <ForecastCard key={timeBlock.label} timeBlock={timeBlock} />
          ))}
        </div>
      )}
    </div>
  );
};
