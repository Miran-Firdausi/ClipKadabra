    import './VideoProcessor.css';
    import { useState } from "react";
    import coreURL from '@ffmpeg/core?url';
    import wasmURL from '@ffmpeg/core/wasm?url';
    import { FFmpeg } from '@ffmpeg/ffmpeg';
    import { fetchFile } from '@ffmpeg/util';

    const VideoProcessor = () => {
        const [videoUrl, setVideoUrl] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const [ffmpeg] = useState(() => new FFmpeg());
        const [inputFile, setInputFile] = useState(null);

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
                    
                    await ffmpeg.load({ coreURL, wasmURL  });

                    const data = await fetchFile(inputFile);

                    console.log(inputFile.name)
                    console.log("Writing file to FFmpeg...");
                    await ffmpeg.writeFile(inputFile.name, await fetchFile(inputFile));
                    console.log("File written.");

                    console.log("Executing FFmpeg command...");
                    await ffmpeg.exec(['-i', inputFile.name, 'output.mp4']);
                    console.log("Command executed.");

                    console.log("Reading output file...");
                    const outputData = await ffmpeg.readFile('output.mp4');
                    console.log("output" + outputData.toString)
                    console.log("Output file read.");

                    // Create a blob URL for the output video
                    const videoBlob = new Blob([outputData.buffer], { type: 'video/mp4' });
                    console.log("blob" + videoBlob)

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
                <h1>FFmpeg WebAssembly Demo</h1>
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
                    <button
                        className="process-button"
                        onClick={processVideo}
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

    export default VideoProcessor;
