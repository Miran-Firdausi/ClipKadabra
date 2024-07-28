// Export.js
import React from "react";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import './index.css';

const Export = () => {
  const { selectedAssets } = useSelectedAssets();

  const handleExport = () => {
    if (selectedAssets.length === 1) {
      const videoUrl = selectedAssets[0].url;
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "exported-video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (selectedAssets.length ===0) {
      alert("Please add a video to the timeline");
    }
    else {
      alert("Please merge videos before exporting")
    }
  };

  return (
    <div>
      <h2>Export</h2>
      <div className="btn-container"><button className="export-btn" onClick={handleExport}>Download Video</button></div>
      
    </div>
  );
};

export default Export;
