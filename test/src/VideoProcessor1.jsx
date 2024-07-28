import React, { useState } from "react";
import axios from "axios";

const VideoProcessor1 = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/process-video/",
        formData,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "video/mp4" })
      );
      setProcessedVideoUrl(url);
    } catch (err) {
      console.error("Error uploading video:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-processor">
      <h1>Video Processor</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload and Process Video"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {processedVideoUrl && (
        <div className="video-container">
          <h2>Processed Video</h2>
          <video controls src={processedVideoUrl}></video>
        </div>
      )}
    </div>
  );
};

export default VideoProcessor1;
