// src/components/DualHandleSlider/DualHandleSlider.jsx

import React, { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';

const DualHandleSlider = ({ maxLimit, onChange }) => {
  const [values, setValues] = useState([0, maxLimit]);
  const min = 0;

  useEffect(() => {
    // Update the end value when maxLimit changes
    setValues([values[0], maxLimit]);
  }, [maxLimit]);


  useEffect(() => {
    onChange({ min: values[0], max: values[1] });
  }, [values, onChange]);


  return (
    <div>
      <Range
        step={1}
        min={min}
        max={maxLimit}
        values={values}
        onChange={(newValues) => {
          // Ensure the values don't exceed the current maxLimit
          const clampedValues = newValues.map(value => Math.min(value, maxLimit));
          setValues(clampedValues);
        }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%'
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '5px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', '#548BF4', '#ccc'],
                  min: min,
                  max: maxLimit
                }),
                alignSelf: 'center'
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: '20px',
              width: '20px',
              borderRadius: '50%',
              backgroundColor: '#FFF',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 2px 6px #AAA'
            }}
          >
            <div
              style={{
                height: '10px',
                width: '10px',
                backgroundColor: isDragged ? '#548BF4' : '#CCC'
              }}
            />
          </div>
        )}
      />
      <p>{values[0].toFixed(2)} - {values[1].toFixed(2)}</p>
    </div>
  );
};

export default DualHandleSlider;
