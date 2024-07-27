import React from "react";
import "./index.css";
import TimelineItem from "./TimelineItem";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";

const Timeline = () => {
  const { selectedAssets, setSelectedAssets } = useSelectedAssets();

  const handleAddToTimeline = (asset) => {
    const startTime = selectedAssets.reduce(
      (sum, asset) => sum + asset.duration,
      0,
    );
    const newAsset = { ...asset, startTime, duration: 10 }; // default duration for new items
    setSelectedAssets([...selectedAssets, newAsset]);
  };

  return (
    <div className="timeline-container">
      <h2>Timeline</h2>
      <div className="timeline">
        {selectedAssets.map((asset, index) => (
          <TimelineItem
            key={index}
            item={asset}
            index={index}
            updateTimelineItem={(updatedItem) => {
              const newAssets = [...selectedAssets];
              newAssets[index] = updatedItem;
              setSelectedAssets(newAssets);
            }}
          />
        ))}
        <div className="time-intervals">
          {[...Array(300).keys()].map((time) => (
            <div key={time} className="time-interval">
              {time}s
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;

// import React, { useState } from "react";
// import "./index.css";
// import TimelineItem from "./TimelineItem";

// const Timeline = ({ assets }) => {
//   const [timelineItems, setTimelineItems] = useState([]);

//   const handleAddToTimeline = (asset) => {
//     setTimelineItems([
//       ...timelineItems,
//       { ...asset, startTime: 0, duration: 10 },
//     ]); // default duration for new items
//   };

//   const updateTimelineItem = (index, updatedItem) => {
//     const newTimelineItems = [...timelineItems];
//     newTimelineItems[index] = updatedItem;
//     setTimelineItems(newTimelineItems);
//   };

//   return (
//     <div className="timeline-container">
//       <h2>Timeline</h2>
//       <div className="timeline">
//         {timelineItems.length
//           ? timelineItems.map((item, index) => (
//               <TimelineItem
//                 key={index}
//                 item={item}
//                 index={index}
//                 updateTimelineItem={updateTimelineItem}
//               />
//             ))
//           : "No item"}
//         <div className="time-intervals">
//           {[...Array(100).keys()].map((time) => (
//             <div key={time} className="time-interval">
//               {time}s
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="assets-list">
//         {assets
//           ? assets.map((asset, index) => (
//               <div key={index} className="asset-item">
//                 <p>{asset.name}</p>
//                 <button onClick={() => handleAddToTimeline(asset)}>
//                   Add to Timeline
//                 </button>
//               </div>
//             ))
//           : "No assets"}
//       </div>
//     </div>
//   );
// };

// export default Timeline;
