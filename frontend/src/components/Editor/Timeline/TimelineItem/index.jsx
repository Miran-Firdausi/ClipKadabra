import React, { useEffect, useState, useRef } from "react";
import DualHandleSlider from "../../DualHandleSlider";
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import "./index.css";

const TimelineItem = ({
  item,
  index,
  updateTimelineItem,
  isActive,
  onClick,
  deleteTimelineItem,
  shiftLeft,
  shiftRight,
}) => {
  const [frames, setFrames] = useState([]);
  const [duration, setDuration] = useState(1);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ffmpeg, setFFmpeg] = useState(null);
  const itemRef = useRef(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const ffmpegInstance = new FFmpeg();
      await ffmpegInstance.load({ coreURL, wasmURL });
      setFFmpeg(ffmpegInstance);
    };

    loadFFmpeg();
  }, []);

  const setAudioDuration = async (audioUrl) => {
    const audio = new Audio(audioUrl);
    await new Promise((resolve) => {
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        setTrimEnd(audio.duration);
        resolve();
      };
    });
  };

  useEffect(() => {
    const extractFrames = async (videoUrl) => {
      const video = document.createElement("video");
      video.src = videoUrl;

      // Wait for the video metadata to load
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      setDuration(video.duration);
      setTrimEnd(video.duration);

      await video.play();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const frames = [];

      video.pause();

      var numberOfFrames = video.duration * 0.5;

      for (let time = 0; time < video.duration; time += video.duration / numberOfFrames) {
        video.currentTime = time;
        await new Promise((resolve) => (video.onseeked = resolve));
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg"));
      }

      setFrames(frames);
    };

    if (item.type.startsWith("video")) {
      extractFrames(item.url);
    } else if (item.type.startsWith("audio")) {
      setAudioDuration(item.url);
    }
  }, [item.url, item.type]);

  const handleTrimConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await ffmpeg.load({ coreURL, wasmURL });

      const data = await fetchFile(item.url);

      const trimDuration = trimEnd - trimStart;
      const outputName = item.type.startsWith("video") ? 'trimmed_output.mp4' : 'trimmed_output.mp3';

      await ffmpeg.writeFile(item.name, new Uint8Array(data));
      await ffmpeg.exec([
        '-i', item.name,
        '-ss', trimStart.toFixed(2),
        '-t', trimDuration.toFixed(2),
        item.type.startsWith("video") ? '-c:v' : '-c:a', item.type.startsWith("video") ? 'libx264' : 'copy',
        '-strict', 'experimental',
        outputName
      ]);

      const outputData = await ffmpeg.readFile(outputName);
      const blobType = item.type.startsWith("video") ? 'video/mp4' : 'audio/mpeg';
      const videoBlob = new Blob([outputData.buffer], { type: blobType });
      const url = URL.createObjectURL(videoBlob);
      updateTimelineItem({ ...item, url, startTime: trimStart, duration: trimDuration });
    } catch (err) {
      setError('An error occurred while processing the video.');
      console.error('Processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    deleteTimelineItem(index);
  };

  return (
    <div
      ref={itemRef}
      className="timeline-item"
      style={{
        left: `${item.startTime * 10}px`,
        minWidth: duration * 100 + `px`,
        maxWidth: duration * 100 + `px`,
      }}
      onClick={() => onClick(index)}
    >
      <div className="video-preview-container">
        <div className="video-item">
          {item.type.startsWith("video") ? (
            frames.map((frame, idx) => (
              <img
                key={idx}
                src={frame}
                alt={`frame-${idx}`}
                style={{ width: `${100 / frames.length}%` }}
              />
            ))
          ) : (
            <div className="audio-placeholder">{item.name}</div>
          )}
        </div>
        {isActive && (
          <div className="trim-controls">
            <DualHandleSlider
              maxLimit={duration}
              onChange={({ min, max }) => {
                setTrimStart(min);
                setTrimEnd(max);
              }}
            />
            <button onClick={handleTrimConfirm} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Trim'}
            </button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={shiftLeft}>Shift Left</button>
            <button onClick={shiftRight}>Shift Right</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineItem;
