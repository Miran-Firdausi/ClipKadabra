import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import "./index.css";


const Assets = () => {
  const [audios, setAudios] = useState([]);
  const { setSelectedAudios } = useSelectedAssets();
  useEffect(() => {
    const fetchAudioFiles = async () => {
      const audioFiles = [
        { name: "Good Night", url: "/audios/good-night-160166.mp3", type: "audio/mp3" },
        { name: "Inside You", url: "/audios/inside-you-162760.mp3", type: "audio/mp3" },
        { name: "Lofi Study", url: "/audios/lofi-study-112191.mp3", type: "audio/mp3" },
        { name: "Once In Paris", url: "/audios/once-in-paris-168895.mp3", type: "audio/mp3" },
      ];
      setAudios(audioFiles.map(audio => ({
        ...audio,
        gradient: getRandomGradient() 
      })));
    };

    fetchAudioFiles();
  }, [])

  const getRandomGradient = () => {
    const colors = [
      'linear-gradient(135deg, #FFB6C1, #FF69B4)',
      'linear-gradient(135deg, #FFD700, #FF6347)',
      'linear-gradient(135deg, #00FF7F, #32CD32)',
      'linear-gradient(135deg, #8A2BE2, #4B0082)',
      'linear-gradient(135deg, #00BFFF, #1E90FF)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newAudios = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      gradient: getRandomGradient()
    }));
    setAudios([...audios, ...newAudios]);
  };

  const handleAddToTimeline = (audio) => {
    setSelectedAudios((prevAudios) => [...prevAudios, audio]);
  };

  const handleDeleteAsset = (index) => {
    const updatedAudios = audios.filter((_, i) => i !== index);
    setAudios(updatedAudios);
  };

  return (
    <div className="assets">
      <h2>Audio</h2>
      <button className="plus-button">
        <input
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileChange}
        />
        <span>
          <FontAwesomeIcon icon={faPlus} />
        </span>
      </button>
      <div className="asset-list">
        {audios.map((asset, index) => (
          <div key={index} className="asset-item" style={{ background: asset.gradient }}>
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
            <p className="asname">{asset.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assets;
