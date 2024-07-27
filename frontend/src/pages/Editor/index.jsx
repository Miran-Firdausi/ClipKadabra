import React, { useState } from "react";
import Sidebar from "@/components/Editor/Sidebar";
import VideoPlayer from "@/components/Editor/VideoPlayer";
import Timeline from "@/components/Editor/Timeline";
import { SelectedAssetsProvider } from "@/context/SelectedAssetsContext";
import "./index.css";

const Editor = () => {
  const [selectedAssets, setSelectedAssets] = useState([]);

  return (
    <SelectedAssetsProvider>
      <div className="editor-page">
        <Sidebar setSelectedAssets={setSelectedAssets} />
        <div className="main-editor">
          {selectedAssets.length ? (
            <VideoPlayer assets={selectedAssets} />
          ) : (
            <div className="placeholder">
              Add video to the timeline to see the preview
            </div>
          )}
          
          <Timeline />
          
        </div>
      </div>
      
    </SelectedAssetsProvider>
  );
};

export default Editor;
