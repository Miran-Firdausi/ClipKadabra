import './VideoMerger.css'; // Reuse the same CSS file
import { useState } from "react";
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const VideoMerger = () => {
    const [videoUrls, setVideoUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ffmpeg] = useState(() => new FFmpeg());
    const [inputFiles, setInputFiles] = useState([]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length) {
            setInputFiles(files);
            setVideoUrls([]); // Clear previous video URLs
        }
    };

    const mergeVideos = async () => {
        if (inputFiles.length > 1) {
            setLoading(true);
            setError(null);
            try {
                console.log("Loading FFmpeg...");
                
                await ffmpeg.load({ coreURL, wasmURL  });

                // Write input files to FFmpeg's virtual file system
                for (let i = 0; i < inputFiles.length; i++) {
                    const file = inputFiles[i];
                    const data = await fetchFile(file);
                    await ffmpeg.writeFile(file.name, new Uint8Array(data));
                }
                console.log("Files written.");

                // Create a file list for FFmpeg
                const fileListContent = inputFiles.map((file, index) => `file '${file.name}'`).join("\n");
                await ffmpeg.writeFile("fileList.txt", new TextEncoder().encode(fileListContent));

                // Merge videos using FFmpeg
                await ffmpeg.exec([
                    "-f", "concat",
                    "-safe", "0",
                    "-i", "fileList.txt",
                    "-c:v", "libx264",
                    "-c:a", "aac", // Ensure audio is included
                    "output.mp4"
                ]);
                console.log("Videos merged.");

                // Read the output file
                const outputData = await ffmpeg.readFile("output.mp4");

                // Create a blob URL for the output video
                const videoBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
                const url = URL.createObjectURL(videoBlob);

                // Set the video URL to state
                setVideoUrls([url]);
            } catch (err) {
                setError('An error occurred while merging the videos.');
                console.error('Merging error:', err);
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please select at least two video files.');
        }
    };

    return (
        <div className="video-processor">
            <h1>FFmpeg WebAssembly Video Merger</h1>
            <div className="controls">
                <label className="input-label">
                    <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleFileChange}
                    />
                    <button
                        className="select-button"
                        onClick={() => document.querySelector('input[type="file"]').click()}
                    >
                        Select Videos
                    </button>
                </label>
                <button
                    className="process-button"
                    onClick={mergeVideos}
                >
                    {loading ? 'Merging...' : 'Merge Videos'}
                </button>
            </div>
            {error && <p className="error">{error}</p>}
            {videoUrls.length > 0 && (
                <div className="video-container">
                    {videoUrls.map((url, index) => (
                        <video key={index} controls src={url}></video>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VideoMerger;
