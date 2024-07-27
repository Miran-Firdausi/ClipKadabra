// SelectedAssetsContext.js
import React, { createContext, useContext, useState } from "react";

const SelectedAssetsContext = createContext();

export const useSelectedAssets = () => useContext(SelectedAssetsContext);

export const SelectedAssetsProvider = ({ children }) => {
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Add currentIndex to context

  return (
    <SelectedAssetsContext.Provider
      value={{ selectedAssets, setSelectedAssets, currentIndex, setCurrentIndex }}
    >
      {children}
    </SelectedAssetsContext.Provider>
  );
};
