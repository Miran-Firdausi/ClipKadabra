import './Merger.css'; // Reuse the same CSS file
import { useState } from "react";
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const AudioMerger = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ffmpeg] = useState(() => new FFmpeg());

    const handleVideoFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoUrl(null); // Clear previous video URL
        }
    };

    const handleAudioFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAudioFile(file);
        }
    };

    const mergeVideoAndAudio = async () => {
        if (videoFile && audioFile) {
            setLoading(true);
            setError(null);
            try {
                console.log("Loading FFmpeg...");
                await ffmpeg.load({ coreURL, wasmURL });

                // Write input files to FFmpeg's virtual file system
                console.log("Writing video file...");
                const videoData = await fetchFile(videoFile);
                await ffmpeg.writeFile(videoFile.name, new Uint8Array(videoData));
                console.log("Video file written.");

                console.log("Writing audio file...");
                const audioData = await fetchFile(audioFile);
                await ffmpeg.writeFile(audioFile.name, new Uint8Array(audioData));
                console.log("Audio file written.");

                // Merge video and audio using FFmpeg
                console.log("Executing FFmpeg command...");
                const result = await ffmpeg.exec([
                    '-i', videoFile.name,             // Input video file
                    '-i', audioFile.name,             // Input audio file
                    '-c:v', 'copy',                   // Copy the video codec
                    '-c:a', 'aac',                    // Use AAC audio codec
                    '-map', '0:v:0',                 // Map video from the first input (videoFile)
                    '-map', '1:a:0',                 // Map audio from the second input (audioFile)
                    '-shortest',                      // Ensure the output file ends when the shortest input ends
                    'output.mp4'
                ]);
                console.log("FFmpeg command result:", result);
                console.log("Video and audio merged.");

                // Read the output file
                console.log("Reading output file...");
                const outputData = await ffmpeg.readFile('output.mp4');

                // Create a blob URL for the output video
                const videoBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
                const url = URL.createObjectURL(videoBlob);

                // Set the video URL to state
                setVideoUrl(url);
            } catch (err) {
                console.error('Merging error:', err);
                setError(`An error occurred: ${err.message}`);
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please select both video and audio files.');
        }
    };

    return (
        <div className="video-processor">
            <h1>Video and Audio Merger</h1>
            <div className="controls">
                <label className="input-label">
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                    />
                    <button
                        className="select-button"
                        onClick={() => document.querySelector('input[type="file"][accept="video/*"]').click()}
                    >
                        Select Video
                    </button>
                </label>
                <label className="input-label">
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                    />
                    <button
                        className="select-button"
                        onClick={() => document.querySelector('input[type="file"][accept="audio/*"]').click()}
                    >
                        Select Audio
                    </button>
                </label>
                <button
                    className="process-button"
                    onClick={mergeVideoAndAudio}
                >
                    {loading ? 'Merging...' : 'Merge Video and Audio'}
                </button>
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

export default AudioMerger;