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

            <VideoPlayer assets={selectedAssets} />
          
          <Timeline />
          
        </div>
      </div>
      
    </SelectedAssetsProvider>
  );
};

export default Editor;
