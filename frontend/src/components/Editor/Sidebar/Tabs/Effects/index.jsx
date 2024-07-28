import React, { useState } from "react";

const Effects = () => {
  const [filter, setFilter] = useState('none'); // default filter is none

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const applyFilter = () => {
    // This is where the functionality to apply the filter would go
    alert(`Applying filter: ${filter}`);
  };

  return (
    <div className="video-processor">
      <h2>Effects</h2>
      <div className="controls">
        <div className="filter-controls">
          <label>
            Filter:
            <select
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="none">None</option>
              <option value="grayscale">Grayscale</option>
              <option value="saturation">Saturation</option>
              <option value="brightness">Brightness</option>
              <option value="contrast">Contrast</option>
              <option value="sepia">Sepia</option>
              <option value="invert">Invert</option>
              <option value="blur">Blur</option>
              <option value="sharpen">Sharpen</option>
            </select>
          </label>
        </div>
        <button
          className="process-button"
          onClick={applyFilter}
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default Effects;
