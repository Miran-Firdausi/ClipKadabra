import Sidebar from "@/components/Editor/Sidebar";
import VideoPlayer from "@/components/Editor/VideoPlayer";
import Timeline from "@/components/Editor/Timeline";
import { SelectedAssetsProvider } from "@/context/SelectedAssetsContext";
import "./index.css";

const Editor = () => {

  return (
    <SelectedAssetsProvider>
      <div className="editor-page">
        <Sidebar />
        <div className="main-editor">
          <VideoPlayer/>
          <Timeline />
        </div>
      </div>
    </SelectedAssetsProvider>
  );
};

export default Editor;
