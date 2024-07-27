// VideoPlayer.js
import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import "./index.css";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playAll, setPlayAll] = useState(false);
  const { selectedAssets, currentIndex, setCurrentIndex } = useSelectedAssets();
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    // Update video source when selectedAssets or currentIndex changes
    if (selectedAssets.length > 0) {
      setVideoSrc(selectedAssets[currentIndex].url);
    } else {
      setVideoSrc(null);
    }
  }, [selectedAssets, currentIndex]);

  useEffect(() => {
    if (videoRef.current) {
      if (playAll && isPlaying) {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [videoSrc, playAll, isPlaying]);

  const handlePlayPause = () => {
    if (selectedAssets.length === 0) return;

    if (playAll) {
      // If already playing all, stop playback
      videoRef.current.pause();
      setIsPlaying(false);
      setPlayAll(false);
    } else {
      // Start playback for the current video
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
      });
      setIsPlaying(true);
      setPlayAll(true);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const handleEnded = () => {
    if (playAll && selectedAssets.length > 0) {
      const nextIndex = (currentIndex + 1) % selectedAssets.length;
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <div className="video-player">
      <div className="video-container">
        {videoSrc ? (
          <video
            ref={videoRef}
            className="video"
            controls={false}
            src={videoSrc}
            onEnded={handleEnded}
          >
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
