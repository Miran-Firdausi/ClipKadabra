import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import "./index.css";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const { selectedAssets } = useSelectedAssets();
  const [videoSrc, setVideoSrc] = useState(null); // Added state for video source

  useEffect(() => {
    if (selectedAssets.length > 0) {
      // Find the first video asset
      const videoAsset = selectedAssets.find(asset => asset.type.startsWith("video"));
      if (videoAsset) {
        setVideoSrc(videoAsset.url);
      } else {
        setVideoSrc(null);
      }
    } else {
      setVideoSrc(null);
    }
  }, [selectedAssets]); // Update videoSrc when selectedAssets change

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  return (
    <div className="video-player">
      <div className="video-container">
        {videoSrc ? (
          <video ref={videoRef} className="video" controls={false}>
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="placeholder">
            Add video to the timeline to see the preview
          </div>
        )}
      </div>

      <div className="controls">
        <button onClick={handlePlayPause} className="control-button">
          {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
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
