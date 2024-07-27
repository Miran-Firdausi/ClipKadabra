import './VideoTrimmer.css'; // Make sure to create or adjust the styles
import { useState } from "react";
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const VideoTrimmer = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ffmpeg] = useState(() => new FFmpeg());
    const [inputFile, setInputFile] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [duration, setDuration] = useState(10); // default duration is 10 seconds

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setInputFile(file);
            setVideoUrl(''); // Clear previous video URL
        }
    };

    const processVideo = async () => {
        if (inputFile) {
            setLoading(true);
            setError(null);
            try {
                console.log("Loading FFmpeg...");
                
                await ffmpeg.load({ coreURL, wasmURL });

                console.log("Writing file to FFmpeg...");
                const data = await fetchFile(inputFile);
                await ffmpeg.writeFile(inputFile.name, new Uint8Array(data));
                console.log("File written.");

                console.log("Executing FFmpeg command...");
                // Command to trim video and audio using start time and duration
                await ffmpeg.exec([
                    '-i', inputFile.name,
                    '-ss', startTime.toString(), // Start time in seconds
                    '-t', duration.toString(),   // Duration in seconds
                    '-c:v', 'libx264',           // Video codec
                    '-c:a', 'aac',               // Audio codec
                    '-strict', 'experimental',   // Needed for AAC codec
                    'output.mp4'
                ]);
                console.log("Command executed.");

                console.log("Reading output file...");
                const outputData = await ffmpeg.readFile('output.mp4');
                console.log("Output file read.");

                // Create a blob URL for the output video
                const videoBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
                const url = URL.createObjectURL(videoBlob);

                // Set the video URL to state
                setVideoUrl(url);
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
                        onChange={handleFileChange}
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
                        />
                    </label>
                    <label>
                        Duration (seconds):
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            min="0"
                        />
                    </label>
                </div>
                <button
                    className="process-button"
                    onClick={processVideo}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Process Video'}
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

export default VideoTrimmer;
