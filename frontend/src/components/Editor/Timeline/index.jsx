import React, { useState, useEffect } from "react";
import "./index.css";
import TimelineItem from "./TimelineItem";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";

const Timeline = () => {
  const { selectedAssets, setSelectedAssets } = useSelectedAssets();
  const [activeIndex, setActiveIndex] = useState(null);

  const handleAddToTimeline = (asset) => {
    const startTime = selectedAssets.reduce(
      (sum, asset) => sum + asset.duration,
      0,
    );
    const newAsset = { ...asset, startTime, duration: 10 }; // default duration for new items
    setSelectedAssets([...selectedAssets, newAsset]);
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
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
