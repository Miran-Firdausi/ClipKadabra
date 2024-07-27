import React, { useState, useEffect } from "react";
import "./index.css";
import TimelineItem from "./TimelineItem";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";

const Timeline = () => {
  const { selectedAssets, setSelectedAssets, setCurrentIndex, totalDuration, setTotalDuration, timeIntervals, setTimeIntervals, currentTime } = useSelectedAssets();
  const [activeIndex, setActiveIndex] = useState(null);


  const deleteTimelineItem = (index) => {
    setSelectedAssets(selectedAssets.filter((_, i) => i !== index));
    setCurrentIndex(0); // Reset currentIndex to 0 after deleting
  };

  const shiftLeft = (index) => {
    if (index > 0) {
      const newAssets = [...selectedAssets];
      [newAssets[index - 1], newAssets[index]] = [newAssets[index], newAssets[index - 1]];
      setSelectedAssets(newAssets);
      setCurrentIndex(0); // Reset currentIndex to 0 after shifting
    }
  };

  const shiftRight = (index) => {
    if (index < selectedAssets.length - 1) {
      const newAssets = [...selectedAssets];
      [newAssets[index], newAssets[index + 1]] = [newAssets[index + 1], newAssets[index]];
      setSelectedAssets(newAssets);
      setCurrentIndex(0); // Reset currentIndex to 0 after shifting
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.timeline-item')) return;
      setActiveIndex(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const generateTimeIntervals = (totalDuration) => {
    const intervals = [];
    for (let i = 0; i <= totalDuration; i++) {
      intervals.push(i);
    }
    return intervals;``
  };

  const calculateTotalDuration = () => {    
    var duration = 0
    for (var i = 0; i < selectedAssets.length; i++) {
      duration += selectedAssets[i].duration;
    }
    return duration;
  };

  useEffect(() => {
    const totalDuration = calculateTotalDuration();
    const timeIntervals = generateTimeIntervals(totalDuration);
    setTotalDuration(totalDuration);
    setTimeIntervals(timeIntervals);

  }, [selectedAssets, setTotalDuration, setTimeIntervals]);

  const seekerPosition = () => {
    let position = 0;
    for (let i = 0; i < selectedAssets.length; i++) {
      if (position + selectedAssets[i].duration > currentTime) {
        return position + currentTime - position;
      }
      position += selectedAssets[i].duration;
    }
    return currentTime;
  };

  return (
    <div className="timeline-container">
      <h2>Timeline</h2>
      <div className="timeline">
        <div className="time-interval">
          {timeIntervals.map((interval, index) => (
            <div
              key={index}
              className="time-interval-marker"
              style={{ left: `${interval * 100}px` }}
            >
              {interval}s
            </div>
          ))}
        </div>
        <div 
          className="seeker-cursor"
          style={{ left: `${10+seekerPosition() * 100}px` }}
        />
        {selectedAssets.map((asset, index) => (
          <TimelineItem
            key={index}
            item={asset}
            index={index}
            isActive={index === activeIndex}
            onClick={(clickedIndex) => setActiveIndex(clickedIndex)}
            updateTimelineItem={(updatedItem) => {
              const newAssets = [...selectedAssets];
              newAssets[index] = updatedItem;
              setSelectedAssets(newAssets);
            }}
            deleteTimelineItem={deleteTimelineItem}
            shiftLeft={() => shiftLeft(index)}
            shiftRight={() => shiftRight(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;