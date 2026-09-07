import { useSurfForecast } from './hooks/useSurfForecast';
import { SpotSelector } from './components/SpotSelector';
import { DailyForecastList } from './components/DailyForecastList';
import './App.css';

function App() {
  const {
    spots,
    selectedSpot,
    forecastData,
    loading,
    error,
    selectSpotById,
  } = useSurfForecast();

  // Helper to render rating stars for spot profile
  const renderSpotBadgeStars = (rating: number) => {
    return (
      <div className="mini-rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`mini-star ${i < rating ? 'filled' : 'empty'}`}>★</span>
        ))}
      </div>
    );
  };

  // Find the overall best day to surf in the 7-day forecast
  const getBestDay = () => {
    if (!forecastData || forecastData.dailyForecasts.length === 0) return null;
    return [...forecastData.dailyForecasts].sort((a, b) => b.averageRating - a.averageRating)[0];
  };

  const bestDay = getBestDay();

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="header-logo-group">
          {/* Link back to La Conchita Home */}
          <a href="/" className="back-home-logo-link" title="Back to La Conchita Beach Community Home">
            <div className="laconchita-logo-pill">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lucide-waves-horizontal">
                <path d="M2 12q2.5 2 5 0t5 0 5 0 5 0"></path>
                <path d="M2 19q2.5 2 5 0t5 0 5 0 5 0"></path>
                <path d="M2 5q2.5 2 5 0t5 0 5 0 5 0"></path>
              </svg>
            </div>
            <div className="laconchita-logo-text">
              <span className="brand-title">La Conchita</span>
              <span className="brand-sub">Beach Community</span>
            </div>
          </a>

          {/* Vertical Divider */}
          <div className="logo-divider" />

          {/* SoCal Surf Branding */}
          <div className="socal-surf-logo-brand">
            <svg className="wave-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 18c-3 0-4-3-6-3s-4 3-6 3V2h24v16c-2 0-3-3-6-3s-3 3-6 3z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 12c-1.5 0-2.5-1.5-4-1.5s-2.5 1.5-4 1.5-2.5-1.5-4-1.5" strokeLinecap="round" />
            </svg>
            <div className="socal-logo-text">
              <h2>SoCal Surf</h2>
              <span className="socal-logo-badge">Marine Forecast</span>
            </div>
          </div>
        </div>
        <div className="header-meta">
          <span className="live-pill">● LIVE DATA</span>
          <span className="data-source">Powered by Open-Meteo</span>
        </div>
      </header>

      <main className="main-content">
        <div className="dashboard-grid">
          
          {/* Left Column: Spot Selector & Info */}
          <section className="left-sidebar">
            <SpotSelector
              spots={spots}
              selectedSpot={selectedSpot}
              onSelectSpot={selectSpotById}
            />

            {/* Selected Spot Details Hero */}
            <div className="spot-profile-card">
              <div className="profile-banner">
                <span className="coordinates-badge">
                  {selectedSpot.latitude.toFixed(4)}°N, {Math.abs(selectedSpot.longitude).toFixed(4)}°W
                </span>
                <h2 className="profile-title">{selectedSpot.name}</h2>
                <p className="profile-county">{selectedSpot.county} County</p>
              </div>
              
              <div className="profile-body">
                <p className="profile-desc">{selectedSpot.description}</p>
                
                <div className="optimal-stats">
                  <h4 className="optimal-title">Optimal Surf Config</h4>
                  <div className="optimal-grid">
                    <div className="optimal-item">
                      <span className="opt-label">Ideal Swells</span>
                      <div className="opt-chips-list">
                        {selectedSpot.optimalSwellDirections.map(dir => (
                          <span key={dir} className="opt-chip swell">{dir}</span>
                        ))}
                      </div>
                    </div>
                    <div className="optimal-item">
                      <span className="opt-label">Ideal Wind</span>
                      <span className="opt-chip wind">
                        {selectedSpot.offshoreDirectionText} Offshore ({selectedSpot.optimalWindDirection}°)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Loading States, Errors, and Forecast View */}
          <section className="forecast-main">
            {loading && (
              <div className="loading-container">
                <div className="skeleton-hero-banner" />
                <div className="skeleton-tabs-row">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton-tab" />
                  ))}
                </div>
                <div className="skeleton-cards-grid">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton-card" />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="error-card animate-fade-in">
                <svg className="error-icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h3>Forecast Loading Error</h3>
                <p>{error}</p>
                <button
                  type="button"
                  className="retry-btn"
                  onClick={() => selectSpotById(selectedSpot.id)}
                >
                  Retry Connection
                </button>
              </div>
            )}

            {!loading && !error && forecastData && (
              <div className="forecast-data-container animate-fade-in">
                {/* Spot Highlights / Today's Recommendation Banner */}
                {bestDay && (
                  <div className="highlight-banner-card">
                    <div className="highlight-content">
                      <div className="highlight-tag">WEEKLY BEST DAY</div>
                      <h3 className="highlight-heading">
                        {bestDay.date.split(', ')[0]} looks like the best day this week!
                      </h3>
                      <p className="highlight-text">
                        Expecting clean wave heights peaking around {bestDay.maxWaveHeightFeet.toFixed(1)} ft with an average surf quality rating of:
                      </p>
                    </div>
                    <div className="highlight-rating-badge">
                      {renderSpotBadgeStars(bestDay.averageRating)}
                      <span className="highlight-rating-text">{bestDay.averageRating}/5 Stars</span>
                    </div>
                  </div>
                )}

                {/* Main Forecast Timeline Component */}
                <DailyForecastList dailyForecasts={forecastData.dailyForecasts} />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
