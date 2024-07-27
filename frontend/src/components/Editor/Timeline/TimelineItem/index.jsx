import React, { useEffect, useState, useRef } from "react";
import DualHandleSlider from "../../DualHandleSlider";
import "./index.css";

const TimelineItem = ({
  item,
  index,
  updateTimelineItem,
  isActive,
  onClick,
  deleteTimelineItem,
  shiftLeft,
  shiftRight,
}) => {
  const [frames, setFrames] = useState([]);
  const [videoDuration, setVideoDuration] = useState(1);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(1);
  const itemRef = useRef(null);

  useEffect(() => {
    const extractFrames = async (videoUrl) => {
      const video = document.createElement("video");
      video.src = videoUrl;

      // Wait for the video metadata to load
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      setVideoDuration(video.duration);
      setTrimEnd(video.duration);

      await video.play();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const frames = [];

      video.pause();

      var numberOfFrames = video.duration*0.5

      for (let time = 0; time < video.duration; time += video.duration / numberOfFrames) {
        video.currentTime = time;
        await new Promise((resolve) => (video.onseeked = resolve));
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg"));
      }

      setFrames(frames);
    };

    if (item.type.startsWith("video")) {
      extractFrames(item.url);
    }
  }, [item.url, item.type]);

  const handleTrimConfirm = () => {
    updateTimelineItem(index, {
      ...item,
      startTime: trimStart,
      duration: trimEnd - trimStart,
    });
  };

  const handleDelete = () => {
    deleteTimelineItem(index);
  };

  return (
    <div
      ref={itemRef}
      className="timeline-item"
      style={{
        left: `${item.startTime * 10}px`,
        minWidth: videoDuration * 100 + `px`,
        maxWidth: videoDuration * 100 + `px`,
      }}
      onClick={() => onClick(index)}
    >
      <div className="video-preview-container">
        <div className="video-item">
          {frames.map((frame, idx) => (
            <img
              key={idx}
              src={frame}
              alt={`frame-${idx}`}
              style={{ width: `${100 / frames.length}%` }}
            />
          ))}
        </div>
        {isActive && (
          <div className="trim-controls">
            <DualHandleSlider
              maxLimit={videoDuration}
              onChange={({ min, max }) => {
                setTrimStart(min);
                setTrimEnd(max);
              }}
            />
            <button onClick={handleTrimConfirm}>Confirm Trim</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={shiftLeft}>Shift Left</button>
            <button onClick={shiftRight}>Shift Right</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
