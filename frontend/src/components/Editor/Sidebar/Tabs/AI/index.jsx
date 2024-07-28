import React, { useState } from "react";
import axios from "axios";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import "./index.css";

const languageCodes = {
  English: "en",
  Spanish: "es",
  French: "fr",
  German: "de",
  Chinese: "zh",
  Japanese: "ja",
  Korean: "ko",
  Hindi: "hi",
  Marathi: "mr",
  Bengali: "bn",
  Gujarati: "gu",
  Malayalam: "ml",
  Punjabi: "pa",
  Tamil: "ta",
  Telugu: "te",
  Urdu: "ur",
};

const AI = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { selectedAssets, setSelectedAssets, setTotalDuration } =
    useSelectedAssets();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("language", selectedLanguage);

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/process-video/",
        formData,
        {
          responseType: "blob",
        },
      );
      const videoBlob = new Blob([response.data], { type: "video/mp4" });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "video/mp4" }),
      );

      setSelectedAssets((prevAssets) => [
        ...prevAssets,
        {
          name: selectedFile.name,
          url: url,
          type: "video/mp4",
          duration: videoBlob.duration || 10, // Default duration if metadata is not available
        },
      ]);
    } catch (err) {
      console.error("Error uploading video:", err);
      setError("Error processing video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-processor">
      <h2>AI Video Processor</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <select value={selectedLanguage} onChange={handleLanguageChange}>
          {Object.entries(languageCodes).map(([language, code]) => (
            <option key={code} value={code}>
              {language}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload and Process Video"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AI;
