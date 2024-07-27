import './VideoTextAdder.css'; // Ensure to create or adjust the styles
import { useState } from "react";
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const VideoTextAdder = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ffmpeg] = useState(() => new FFmpeg());
    const [inputFile, setInputFile] = useState(null);
    const [text, setText] = useState('Sample Text');
    const [fontSize, setFontSize] = useState(24);
    const [position, setPosition] = useState('10:10'); // Position (x:y)

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
                // Command to add text to video
                await ffmpeg.exec([
                    '-i', inputFile.name,
                    '-vf', `drawtext=text='${text}':x=${position.split(':')[0]}:y=${position.split(':')[1]}:fontsize=${fontSize}:fontcolor=white`,
                    '-c:v', 'libx264',          // Video codec
                    '-c:a', 'aac',              // Audio codec
                    '-strict', 'experimental',  // Needed for AAC codec
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
            <h1>FFmpeg WebAssembly Video Text Adder</h1>
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
                <div className="text-controls">
                    <label>
                        Text:
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </label>
                    <label>
                        Font Size:
                        <input
                            type="number"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            min="10"
                        />
                    </label>
                    <label>
                        Position (x:y):
                        <input
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </label>
                </div>
                <button
                    className="process-button"
                    onClick={processVideo}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Add Text to Video'}
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

export default VideoTextAdder;
