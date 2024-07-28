import React, { useState } from "react";
import { Range, getTrackBackground } from "react-range";

const TwoHandleRange = () => {
  const [values, setValues] = useState([10, 90]);
  const min = 0;
  const max = 100;

  return (
    <div
      style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
    >
      <Range
        values={values}
        step={1}
        min={min}
        max={max}
        onChange={setValues}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "6px",
              width: "100%",
              background: getTrackBackground({
                values,
                colors: ["#ccc", "#548BF4", "#ccc"],
                min,
                max,
              }),
              alignSelf: "center",
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "20px",
              width: "20px",
              borderRadius: "50%",
              backgroundColor: "#FFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 2px 6px #AAA",
            }}
          >
            <div
              style={{
                height: "10px",
                width: "5px",
                backgroundColor: isDragged ? "#548BF4" : "#CCC",
              }}
            />
          </div>
        )}
      />
      <output style={{ marginTop: "30px" }} id="output">
        {values[0]} - {values[1]}
      </output>
    </div>
  );
};

export default TwoHandleRange;
