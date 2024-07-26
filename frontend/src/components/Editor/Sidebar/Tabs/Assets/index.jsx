import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import "./index.css";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const { setSelectedAssets } = useSelectedAssets();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newAssets = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setAssets([...assets, ...newAssets]);
  };

  const handleAddToTimeline = (asset) => {
    setSelectedAssets((prevAssets) => [...prevAssets, asset]);
  };

  const handleDeleteAsset = (index) => {
    const updatedAssets = assets.filter((_, i) => i !== index);
    setAssets(updatedAssets);
  };

  return (
    <div className="assets">
      <h2>Assets</h2>
      <button className="plus-button">
        <input
          type="file"
          accept="video/*,image/*"
          multiple
          onChange={handleFileChange}
        />
        <span>
          <FontAwesomeIcon icon={faPlus} />
        </span>
      </button>
      <div className="asset-list">
        {assets.map((asset, index) => (
          <div key={index} className="asset-item">
            <div className="thumbnail">
              {asset.type.startsWith("image") ? (
                <img src={asset.url} alt={asset.name} />
              ) : (
                <video src={asset.url} />
              )}
              <div className="overlay">
                <button
                  onClick={() => handleAddToTimeline(asset)}
                  className="icon-button"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                <button
                  onClick={() => handleDeleteAsset(index)}
                  className="icon-button"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
            <p>{asset.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assets;
