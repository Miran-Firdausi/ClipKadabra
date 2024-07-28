import React, { useRef, useState, useEffect } from "react";
import download from "downloadjs";
import coreURL from "@ffmpeg/core?url";
import wasmURL from "@ffmpeg/core/wasm?url";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import * as fabric from "fabric";

const VideoTextOverlay = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const textInputRef = useRef(null);
  const [texts, setTexts] = useState([]);
  const [frames, setFrames] = useState([]);
  const ffmpeg = new FFmpeg();

  const log = (message) => {
    console.log(message);
  };

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);

    canvas.on("mouse:down", (options) => {
      if (options.target && options.target.type === "text") {
        canvas.setActiveObject(options.target);
      }
    });

    canvas.on("object:modified", () => {
      const updatedTexts = canvas.getObjects("text").map((text) => ({
        content: text.text,
        left: text.left,
        top: text.top,
        angle: text.angle,
      }));
      setTexts(updatedTexts);
    });

    const updateCanvas = () => {
      const video = videoRef.current;
      if (video && !video.paused && !video.ended) {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL("image/jpeg", 0.95);
        setFrames((prevFrames) => [...prevFrames, imageDataURL]);
        requestAnimationFrame(updateCanvas);
      } else {
        log("Video playback stopped or not started");
      }
    };

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleVideoInput = (e) => {
    const file = e.target.files[0];
    if (!file) {
      log("No file selected");
      return;
    }
    log("File selected: " + file.name);
    const videoURL = URL.createObjectURL(file);
    const video = videoRef.current;
    video.src = videoURL;
    video.addEventListener("loadedmetadata", () => {
      log("Video metadata loaded");
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      log("Canvas size set to: " + canvas.width + "x" + canvas.height);
      video
        .play()
        .then(() => {
          log("Video playback started");
          updateCanvas();
        })
        .catch((error) => {
          log("Error playing video: " + error);
        });
    });
    video.addEventListener("error", (e) => {
      log("Video error: " + e.target.error.message);
    });
  };

  const addText = () => {
    const textValue = textInputRef.current.value.trim();
    if (textValue !== "") {
      const canvas = canvasRef.current.__fabricInstance;
      const text = new fabric.Text(textValue, {
        left: canvas.width / 2,
        top: canvas.height / 2,
        fill: "white",
        fontSize: 20,
        editable: true,
      });
      canvas.add(text).setActiveObject(text);
      canvas.renderAll();
      setTexts((prevTexts) => [
        ...prevTexts,
        { content: textValue, left: text.left, top: text.top },
      ]);
      log("Text added: " + textValue);
      textInputRef.current.value = "";
    }
  };

  const downloadVideo = async () => {
    log("Preparing video for download...");
    await ffmpeg.load({ coreURL, wasmURL });
    frames.forEach(async (frame, index) => {
      await ffmpeg.writeFile(`frame${index}.jpg`, await fetchFile(frame));
    });

    await ffmpeg.exec([
      "-framerate",
      "30",
      "-i",
      "frame%d.jpg",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "output.mp4",
    ]);
    const data = ffmpeg.readFile("output.mp4");
    const blob = new Blob([data.buffer], { type: "video/mp4" });
    download(blob, "video_with_text.mp4", "video/mp4");
    log("Video download started");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <input type="file" accept="video/*" onChange={handleVideoInput} />
      <div
        id="canvas-container"
        style={{ position: "relative", marginTop: "20px" }}
      >
        <canvas ref={canvasRef} width="640" height="360"></canvas>
      </div>
      <div
        id="text-input-container"
        style={{
          display: "flex",
          marginTop: "10px",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <input
          ref={textInputRef}
          type="text"
          placeholder="Enter text to add to video"
          style={{ flexGrow: 1, marginRight: "10px" }}
        />
        <button
          onClick={addText}
          style={{
            padding: "5px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            margin: "5px",
          }}
        >
          OK
        </button>
      </div>
      <button
        onClick={downloadVideo}
        style={{
          padding: "5px 15px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
          margin: "5px",
        }}
      >
        Download Video
      </button>
    </div>
  );
};

export default VideoTextOverlay;
