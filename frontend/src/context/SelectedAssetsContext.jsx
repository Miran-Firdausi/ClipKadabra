import React, { createContext, useContext, useState } from "react";

const SelectedAssetsContext = createContext();

export const useSelectedAssets = () => useContext(SelectedAssetsContext);

export const SelectedAssetsProvider = ({ children }) => {
  const [selectedAssets, setSelectedAssets] = useState([]);

  return (
    <SelectedAssetsContext.Provider
      value={{ selectedAssets, setSelectedAssets }}
    >
      {children}
    </SelectedAssetsContext.Provider>
  );
};
