import React from "react";
// import VideoProcessor from './VideoProcessor';
import VideoTrimmer from "./VideoTrimmer";
import VideoProcessor1 from "./VideoProcessor1";
import VideoMerger from "./VideoMerger";
// import VideoTextAdder from './VideoTextAdder';
import TransitionMerger from "./Transition";
import Canva from "./Canva";
import "./App.css";
import AudioMerger from "./Merger";

function App() {
  return (
    <div className="App">
      <VideoProcessor1 />
    </div>
  );
}

export default App;
