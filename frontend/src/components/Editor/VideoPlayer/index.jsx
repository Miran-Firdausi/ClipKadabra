import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import "./index.css";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const { selectedAssets } = useSelectedAssets();

  useEffect(() => {
    if (videoSrc) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [videoSrc]);

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="video-player">
      <div className="video-container">
        {selectedAssets.length > 0 ? (
          selectedAssets.map((asset, index) => (
            <div key={index}>
              {asset.type.startsWith("image") ? (
                <img src={asset.url} alt={asset.name} />
              ) : (
                <video ref={videoRef} className="video" controls={false}>
                  {videoSrc && <source src={videoSrc} type="video/mp4" />}
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))
        ) : (
          <div className="placeholder">
            Add video to the timeline to see the preview
          </div>
        )}
      </div>

      <div className="controls">
        <button onClick={handlePlayPause} className="control-button">
          {isPlaying ? <FontAwesomeIcon icon={faPlay} /> : "Play"}
        </button>
        <div className="volume-control">
          <label htmlFor="volume">Volume</label>
          <input
            type="range"
            id="volume"
            name="volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
