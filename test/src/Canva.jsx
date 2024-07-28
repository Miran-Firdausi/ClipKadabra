import React, { useRef, useState, useEffect } from "react";
import "./App.css";

const Canva = () => {
  const canvasRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [text, setText] = useState("Sample Text");
  const [textPos, setTextPos] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos(files);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const playVideo = (videoFile) => {
    const videoElement = document.createElement("video");
    videoElement.src = URL.createObjectURL(videoFile);
    videoElement.onloadeddata = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      videoElement.play();

      videoElement.onplay = () => {
        const drawFrame = () => {
          if (!videoElement.paused && !videoElement.ended) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            // Add text in the specified position
            ctx.font = "48px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "white";
            ctx.fillText(text, textPos.x, textPos.y);

            requestAnimationFrame(drawFrame);
          } else if (videoElement.ended) {
            setCurrentVideoIndex((prevIndex) => prevIndex + 1);
          }
        };
        drawFrame();
      };
    };
  };

  useEffect(() => {
    if (currentVideoIndex < videos.length) {
      playVideo(videos[currentVideoIndex]);
    }
  }, [currentVideoIndex, videos]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const textWidth = canvasRef.current
      .getContext("2d")
      .measureText(text).width;
    const textHeight = 48; // Approximate height based on font size

    if (
      x > textPos.x - textWidth / 2 &&
      x < textPos.x + textWidth / 2 &&
      y > textPos.y - textHeight / 2 &&
      y < textPos.y + textHeight / 2
    ) {
      setDragging(true);
      setOffset({ x: x - textPos.x, y: y - textPos.y });
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTextPos({ x: x - offset.x, y: y - offset.y });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div className="App">
      <h1>Video to Canvas</h1>
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={handleVideoChange}
      />
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text"
      />
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // To handle the case when the mouse leaves the canvas while dragging
      ></canvas>
    </div>
  );
};

export default Canva;
