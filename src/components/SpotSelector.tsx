import type { SurfSpot } from '../types';

interface SpotSelectorProps {
  spots: SurfSpot[];
  selectedSpot: SurfSpot;
  onSelectSpot: (id: string) => void;
}

export const SpotSelector: React.FC<SpotSelectorProps> = ({
  spots,
  selectedSpot,
  onSelectSpot,
}) => {
  // Group spots by county
  const spotsByCounty = spots.reduce<{ [key: string]: SurfSpot[] }>((acc, spot) => {
    if (!acc[spot.county]) {
      acc[spot.county] = [];
    }
    acc[spot.county].push(spot);
    return acc;
  }, {});

  return (
    <div className="spot-selector-container">
      <div className="spot-selector-header">
        <svg className="spot-selector-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <h3>Select Surf Spot</h3>
      </div>
      
      <div className="county-groups">
        {Object.entries(spotsByCounty).map(([county, countySpots]) => (
          <div key={county} className="county-group">
            <h4 className="county-title">{county}</h4>
            <div className="spot-chips">
              {countySpots.map((spot) => {
                const isSelected = spot.id === selectedSpot.id;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    className={`spot-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => onSelectSpot(spot.id)}
                    aria-label={`Select ${spot.name}`}
                  >
                    <span className="spot-chip-text">{spot.name.split(' (')[0]}</span>
                    {isSelected && (
                      <span className="spot-chip-indicator">
                        <span className="dot" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
