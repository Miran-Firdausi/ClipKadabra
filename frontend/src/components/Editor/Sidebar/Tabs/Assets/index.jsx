import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import "./index.css";

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const { selectedAssets, setSelectedAssets, setTotalDuration } = useSelectedAssets();

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const newAssetsPromises = files.map(async (file) => {
      const url = URL.createObjectURL(file);
      let duration = 0;

      if (file.type.startsWith("video")) {
        const video = document.createElement("video");
        video.src = url;

        // Wait for metadata to be loaded
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            duration = video.duration;
            resolve();
          };
        });
      }

      return {
        name: file.name,
        url,
        type: file.type,
        duration: duration || 10, // Default duration for non-video files
      };
    });

    const newAssets = await Promise.all(newAssetsPromises);
    setAssets([...assets, ...newAssets]);
  };

  const handleAddToTimeline = (asset) => {
    setSelectedAssets((prevAssets) => {
      const newAssets = [...prevAssets, asset];
      return newAssets;
    });
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
            <p className="asset-name-cnt">{asset.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assets;
