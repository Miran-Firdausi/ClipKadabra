// SelectedAssetsContext.js
import React, { createContext, useContext, useState } from "react";

const SelectedAssetsContext = createContext();

export const useSelectedAssets = () => useContext(SelectedAssetsContext);

export const SelectedAssetsProvider = ({ children }) => {
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalDuration, setTotalDuration] = useState(10);
  const [timeIntervals, setTimeIntervals] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <SelectedAssetsContext.Provider
      value={{
        selectedAssets,
        setSelectedAssets,
        currentIndex,
        setCurrentIndex,
        totalDuration,
        setTotalDuration,
        timeIntervals,
        setTimeIntervals,
        currentTime,
        setCurrentTime
      }}
    >
      {children}
    </SelectedAssetsContext.Provider>
  );
};