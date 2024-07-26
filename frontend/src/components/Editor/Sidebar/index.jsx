import React, { useState } from "react";
import Assets from "./Tabs/Assets";
import Effects from "./Tabs/Effects";
import Text from "./Tabs/Text";
import Audio from "./Tabs/Audio";
import Export from "./Tabs/Export";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import "./index.css";

const Sidebar = ({ setSelectedVideo }) => {
  const [activeTab, setActiveTab] = useState("assets");

  const { setSelectedAssets } = useSelectedAssets();

  const renderTabContent = () => {
    switch (activeTab) {
      case "assets":
        return <Assets />;
      case "effects":
        return <Effects />;
      case "text":
        return <Text />;
      case "audio":
        return <Audio />;
      case "export":
        return <Export />;
      default:
        return <Assets setSelectedVideo={setSelectedVideo} />;
    }
  };

  return (
    <div className="sidebar">
      <div className="tabs">
        <button
          onClick={() => setActiveTab("assets")}
          className={activeTab === "assets" ? "active" : ""}
        >
          Assets
        </button>
        <button
          onClick={() => setActiveTab("transitions")}
          className={activeTab === "transitions" ? "active" : ""}
        >
          Transitions
        </button>
        <button
          onClick={() => setActiveTab("effects")}
          className={activeTab === "effects" ? "active" : ""}
        >
          Effects
        </button>
        <button
          onClick={() => setActiveTab("text")}
          className={activeTab === "text" ? "active" : ""}
        >
          Text/Title
        </button>
        <button
          onClick={() => setActiveTab("audio")}
          className={activeTab === "audio" ? "active" : ""}
        >
          Audio
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={activeTab === "export" ? "active" : ""}
        >
          Export
        </button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default Sidebar;
