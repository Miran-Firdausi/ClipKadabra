// src/components/VideoTrimmer/VideoTrimmer.jsx

import React, { useState, useEffect } from "react";
//import './VideoTrimmer.css';
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const VideoTrimmer = ({ videoFile, onTrim }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ffmpeg] = useState(() => new FFmpeg());
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(10); // Default end time
    const [duration, setDuration] = useState(10); // Default duration

    useEffect(() => {
        if (videoFile) {
            const video = document.createElement("video");
            video.src = URL.createObjectURL(videoFile);

            video.onloadedmetadata = () => {
                setDuration(video.duration);
                setEndTime(video.duration);
            };
        }
    }, [videoFile]);

    const processVideo = async () => {
        if (videoFile) {
            setLoading(true);
            setError(null);
            try {
                console.log("Loading FFmpeg...");
                
                await ffmpeg.load({ coreURL, wasmURL });

                console.log("Writing file to FFmpeg...");
                const data = await fetchFile(videoFile);
                await ffmpeg.writeFile(videoFile.name, new Uint8Array(data));
                console.log("File written.");

                const trimDuration = endTime - startTime;

                console.log("Executing FFmpeg command...");
                await ffmpeg.exec([
                    '-i', videoFile.name,
                    '-ss', startTime.toString(), // Start time in seconds
                    '-t', trimDuration.toString(), // Duration in seconds
                    '-c:v', 'libx264',           // Video codec
                    '-c:a', 'aac',               // Audio codec
                    '-strict', 'experimental',   // Needed for AAC codec
                    'output.mp4'
                ]);
                console.log("Command executed.");

                console.log("Reading output file...");
                const outputData = await ffmpeg.readFile('output.mp4');
                console.log("Output file read.");

                const videoBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
                const url = URL.createObjectURL(videoBlob);

                setVideoUrl(url);
                onTrim(url); // Pass trimmed video URL to parent
            } catch (err) {
                setError('An error occurred while processing the video.');
                console.error('Processing error:', err);
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please select a video file first.');
        }
    };

    return (
        <div className="video-processor">
            <h1>FFmpeg WebAssembly Video Trimmer</h1>
            <div className="controls">
                <label className="input-label">
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                setVideoUrl(URL.createObjectURL(e.target.files[0]));
                                setInputFile(e.target.files[0]);
                            }
                        }}
                    />
                    <button
                        className="select-button"
                        onClick={() => document.querySelector('input[type="file"]').click()}
                    >
                        Select Video
                    </button>
                </label>
                <div className="trim-controls">
                    <label>
                        Start Time (seconds):
                        <input
                            type="number"
                            value={startTime}
                            onChange={(e) => setStartTime(Number(e.target.value))}
                            min="0"
                            max={duration}
                        />
                    </label>
                    <label>
                        End Time (seconds):
                        <input
                            type="number"
                            value={endTime}
                            onChange={(e) => setEndTime(Number(e.target.value))}
                            min="0"
                            max={duration}
                        />
                    </label>
                    <button
                        className="process-button"
                        onClick={processVideo}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Process Video'}
                    </button>
                </div>
            </div>
            {error && <p className="error">{error}</p>}
            {videoUrl && (
                <div className="video-container">
                    <video controls src={videoUrl}></video>
                </div>
            )}
        </div>
    );
};

export default VideoTrimmer;
