// Timeline.js
import React, { useState, useEffect } from "react";
import "./index.css";
import TimelineItem from "./TimelineItem";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";

const Timeline = () => {
  const { selectedAssets, setSelectedAssets, setCurrentIndex } = useSelectedAssets();
  const [activeIndex, setActiveIndex] = useState(null);

  const handleAddToTimeline = (asset) => {
    const startTime = selectedAssets.reduce(
      (sum, asset) => sum + asset.duration,
      0,
    );
    const newAsset = { ...asset, startTime, duration: 10 }; 
    setSelectedAssets([...selectedAssets, newAsset]);
  };

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

  return (
    <div className="timeline-container">
      <h2>Timeline</h2>
      <div className="timeline">
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
