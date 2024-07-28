import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import "./index.css";

const VideoPlayer = () => {
  const videoRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const { selectedAssets, currentIndex, setCurrentIndex, setCurrentTime } = useSelectedAssets();

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, selectedAssets.length);
  }, [selectedAssets.length]);

  const handlePlayPause = () => {
    if (selectedAssets.length === 0) return;

    if (isPlaying) {
      videoRefs.current.forEach(video => video.pause());
      setIsPlaying(false);
    } else {
      playVideo(currentIndex);
      setIsPlaying(true);
    }
  };

  const playVideo = (index) => {
    if (index >= selectedAssets.length) return;
    
    const currentVideo = videoRefs.current[index];
    if (currentVideo) {
      currentVideo.play().catch(error => {
        console.error("Error playing video:", error);
      });

      currentVideo.onended = () => {
        const nextIndex = (index + 1) % selectedAssets.length;
        setCurrentIndex(nextIndex);
        playVideo(nextIndex);
      };

      currentVideo.ontimeupdate = () => {
        let totalTime = 0;
        for (let i = 0; i < index; i++) {
          totalTime += selectedAssets[i].duration;
        }
        setCurrentTime(totalTime + currentVideo.currentTime);
      };
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    videoRefs.current.forEach(video => video.volume = newVolume);
    setVolume(newVolume);
  };

  return (
    <div className="video-player">
      <div className="video-container">
        {selectedAssets.map((asset, index) => (
          <video
            key={index}
            ref={el => videoRefs.current[index] = el}
            className="video"
            src={asset.url}
            controls={false}
            muted={false}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              opacity: index === currentIndex ? 1 : 0,
            }}
          >
            Your browser does not support the video tag.
          </video>
        ))}
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

