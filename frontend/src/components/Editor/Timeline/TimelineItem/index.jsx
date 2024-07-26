import React, { useEffect, useState } from "react";
import "./index.css";

const TimelineItem = ({ item, index, updateTimelineItem }) => {
  const [frames, setFrames] = useState([]);

  useEffect(() => {
    const extractFrames = async (videoUrl, interval) => {
      const video = document.createElement("video");
      video.src = videoUrl;
      await video.play();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const frames = [];

      video.pause();

      for (let time = 0; time < video.duration; time += interval) {
        video.currentTime = time;
        await new Promise((resolve) => (video.onseeked = resolve));
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg"));
      }

      setFrames(frames);
    };

    if (item.type.startsWith("video")) {
      extractFrames(item.url, 5); // Extract a frame every 5 second
    }
  }, [item.url, item.type]);

  const handleDurationChange = (e) => {
    const newDuration = parseInt(e.target.value, 10);
    updateTimelineItem(index, { ...item, duration: newDuration });
  };

  const handlePositionChange = (e) => {
    const newPosition = parseInt(e.target.value, 10);
    updateTimelineItem(index, { ...item, startTime: newPosition });
  };

  return (
    <div
      className="timeline-item"
      style={{
        width: `${item.duration * 10}px`,
        left: `${item.startTime * 10}px`,
      }}
    >
      {item.type.startsWith("image") ? (
        <img src={item.url} alt={item.name} />
      ) : (
        frames.map((frame, idx) => (
          <img
            key={idx}
            src={frame}
            alt={`frame-${idx}`}
            style={{ width: `${100 / frames.length}%` }}
          />
        ))
      )}
    </div>
  );
};

export default TimelineItem;
