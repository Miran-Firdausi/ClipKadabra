import React from 'react';
import './index.css';

const Transitions = () => {
  const transitions = ['Fade', 'Slide', 'Wipe', 'Zoom', 'Flip'];

  return (
    <div className="transitions-container">
      {transitions.map((transition, index) => (
        <button key={index} className="transition-button">
          {transition}
        </button>
      ))}
    </div>
  );
};

export default Transitions;
