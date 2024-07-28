import React, { useState, useEffect } from "react";
import "./index.css";
import TimelineItem from "./TimelineItem";
import { useSelectedAssets } from "@/context/SelectedAssetsContext";
import coreURL from "@ffmpeg/core?url";
import wasmURL from "@ffmpeg/core/wasm?url";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const Timeline = () => {
  const {
    selectedAssets,
    setSelectedAssets,
    setCurrentIndex,
    totalDuration,
    setTotalDuration,
    timeIntervals,
    setTimeIntervals,
    currentTime,
    selectedAudios,
  } = useSelectedAssets();
  const [activeIndex, setActiveIndex] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ffmpeg, setFFmpeg] = useState(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpegInstance = new FFmpeg();
      await ffmpegInstance.load({ coreURL, wasmURL });
      setFFmpeg(ffmpegInstance);
    };

    loadFFmpeg();
  }, []);

  const deleteTimelineItem = (index) => {
    setSelectedAssets(selectedAssets.filter((_, i) => i !== index));
    setCurrentIndex(0); // Reset currentIndex to 0 after deleting
  };

  const shiftLeft = (index) => {
    if (index > 0) {
      const newAssets = [...selectedAssets];
      [newAssets[index - 1], newAssets[index]] = [
        newAssets[index],
        newAssets[index - 1],
      ];
      setSelectedAssets(newAssets);
      setCurrentIndex(0); // Reset currentIndex to 0 after shifting
    }
  };

  const shiftRight = (index) => {
    if (index < selectedAssets.length - 1) {
      const newAssets = [...selectedAssets];
      [newAssets[index], newAssets[index + 1]] = [
        newAssets[index + 1],
        newAssets[index],
      ];
      setSelectedAssets(newAssets);
      setCurrentIndex(0); // Reset currentIndex to 0 after shifting
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".timeline-item")) return;
      setActiveIndex(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const generateTimeIntervals = (totalDuration) => {
    const intervals = [];
    for (let i = 0; i <= totalDuration; i++) {
      intervals.push(i);
    }
    return intervals;
  };

  const calculateTotalDuration = () => {
    var duration = 0;
    for (var i = 0; i < selectedAssets.length; i++) {
      duration += selectedAssets[i].duration;
    }
    return duration;
  };

  useEffect(() => {
    const totalDuration = calculateTotalDuration();
    const timeIntervals = generateTimeIntervals(totalDuration);
    setTotalDuration(totalDuration);
    setTimeIntervals(timeIntervals);
  }, [selectedAssets, setTotalDuration, setTimeIntervals]);

  const seekerPosition = () => {
    let position = 0;
    for (let i = 0; i < selectedAssets.length; i++) {
      if (position + selectedAssets[i].duration > currentTime) {
        return position + currentTime - position;
      }
      position += selectedAssets[i].duration;
    }
    return currentTime;
  };

  const mergeVideos = async () => {
    if (!ffmpeg) {
      setError("FFmpeg is not loaded yet.");
      return;
    }

    if (selectedAssets.length > 1) {
      setLoading(true);
      setError(null);
      try {
        // Write input files to FFmpeg's virtual file system
        for (let asset of selectedAssets) {
          console.log(asset.url);
          const data = await fetchFile(asset.url);
          await ffmpeg.writeFile(asset.name, new Uint8Array(data));
        }

        // Create a file list for FFmpeg
        const fileListContent = selectedAssets
          .map((asset) => `file '${asset.name}'`)
          .join("\n");
        await ffmpeg.writeFile(
          "fileList.txt",
          new TextEncoder().encode(fileListContent),
        );

        // Merge videos using FFmpeg
        await ffmpeg.exec([
          "-f",
          "concat",
          "-safe",
          "0",
          "-i",
          "fileList.txt",
          "-c:v",
          "copy",
          "-c:a",
          "aac", // Ensure audio is included
          "output.mp4",
        ]);

        // Read the output file
        const outputData = await ffmpeg.readFile("output.mp4");

        // Create a blob URL for the output video
        const videoBlob = new Blob([outputData.buffer], { type: "video/mp4" });
        const url = URL.createObjectURL(videoBlob);

        // Set the merged video as the only item in the selected assets
        setSelectedAssets([
          {
            url,
            name: "output.mp4",
            type: "video/mp4",
            duration: totalDuration,
          },
        ]);
        setCurrentIndex(0); // Reset currentIndex to 0
      } catch (err) {
        setError("An error occurred while merging the videos.");
        console.error("Merging error:", err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please select at least two video files.");
    }
  };

  return (
    <div className="timeline-container">
      <h2>Timeline</h2>
      <div className="timeline">
        <div className="time-interval">
          {timeIntervals.map((interval, index) => (
            <div
              key={index}
              className="time-interval-marker"
              style={{ left: `${interval * 100}px` }}
            >
              {interval}s
            </div>
          ))}
        </div>
        <div
          className="seeker-cursor"
          style={{ left: `${10 + seekerPosition() * 100}px` }}
        />
        {selectedAssets.map((asset, index) => (
          <TimelineItem
            key={index}
            item={asset}
            index={index}
            isActive={index === activeIndex}
            onClick={(clickedIndex) => setActiveIndex(clickedIndex)}
            updateTimelineItem={(updatedItem) => {
              const newAssets = [...selectedAssets];
              newAssets[index] = updatedItem;
              setSelectedAssets(newAssets);
            }}
            deleteTimelineItem={deleteTimelineItem}
            shiftLeft={() => shiftLeft(index)}
            shiftRight={() => shiftRight(index)}
          />
        ))}
        <div className="sound-layer">
          {selectedAudios.map((asset, index) => (
            <TimelineItem
              key={index}
              item={asset}
              index={index}
              isActive={index === activeIndex}
              onClick={(clickedIndex) => setActiveIndex(clickedIndex)}
              updateTimelineItem={(updatedItem) => {
                const newAssets = [...selectedAssets];
                newAssets[index] = updatedItem;
                setSelectedAudios(newAssets);
              }}
              deleteTimelineItem={deleteTimelineItem}
              shiftLeft={() => shiftLeft(index)}
              shiftRight={() => shiftRight(index)}
            />
          ))}
        </div>
      </div>

      <div className="merge-controls">
        <button onClick={mergeVideos} disabled={loading}>
          {loading ? "Merging..." : "Merge Videos"}
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Timeline;
