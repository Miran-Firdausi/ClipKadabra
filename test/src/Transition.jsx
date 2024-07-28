import "./Merger.css"; // Reuse the same CSS file
import { useState, useRef } from "react";
import coreURL from "@ffmpeg/core?url";
import wasmURL from "@ffmpeg/core/wasm?url";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const Transition = () => {
  const [videoFile1, setVideoFile1] = useState(null);
  const [videoFile2, setVideoFile2] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ffmpeg = new FFmpeg({
    log: true,
    logger: ({ type, message }) => {
      if (type === "fferr") {
        console.error("FFmpeg error:", message);
      } else {
        console.log("FFmpeg log:", message);
      }
    },
  });

  const videoFile1InputRef = useRef(null);
  const videoFile2InputRef = useRef(null);

  const handleVideoFile1Change = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile1(file);
    }
  };

  const handleVideoFile2Change = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile2(file);
    }
  };

  const mergeVideosWithFade = async () => {
    if (videoFile1 && videoFile2) {
      setLoading(true);
      setError(null);
      try {
        console.log("Loading FFmpeg...");
        await ffmpeg.load({ coreURL, wasmURL });

        // Write input files to FFmpeg's virtual file system
        console.log("Writing video files...");
        const videoData1 = await fetchFile(videoFile1);
        const videoData2 = await fetchFile(videoFile2);
        await ffmpeg.writeFile("input1.mp4", videoData1);
        await ffmpeg.writeFile("input2.mp4", videoData2);
        console.log("Video files written.");

        // Merge videos with fade transition using FFmpeg
        console.log("Executing FFmpeg command...");
        await ffmpeg.exec([
            '-i', 'input1.mp4',
            '-i', 'input2.mp4',
            '-filter_complex', '[0:v][1:v]xfade=transition=fade:duration=1:offset=4[v];[0:a][1:a]acrossfade=d=1[a]',
            '-map', '[v]',
            '-map', '[a]',
            'output.mp4'
        ]);
        

        // Read the output file
        console.log("Reading output file...");
        const outputFile = await ffmpeg.readFile("output.mp4");
        console.log(`Output file size: ${outputFile.length} bytes`);

        if (outputFile.length === 0) {
          throw new Error("FFmpeg did not produce an output file.");
        }

        // Create a blob URL for the output video
        const videoBlob = new Blob([outputFile.buffer], { type: "video/mp4" });
        const url = URL.createObjectURL(videoBlob);

        // Log the blob URL
        console.log(`Generated Blob URL: ${url}`);

        // Set the video URL to state
        setVideoUrl(url);
      } catch (err) {
        console.error("Merging error:", err);
        setError(`An error occurred: ${err.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please select both video files.");
    }
  };

  return (
    <div className="video-processor">
      <h1>Video Transition Merger</h1>
      <div className="controls">
        <label className="input-label">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoFile1Change}
            ref={videoFile1InputRef}
          />
          <button
            className="select-button"
            onClick={() => videoFile1InputRef.current.click()}
          >
            Select First Video
          </button>
        </label>
        {videoFile1 && <p>First Video: {videoFile1.name}</p>}

        <label className="input-label">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoFile2Change}
            ref={videoFile2InputRef}
          />
          <button
            className="select-button"
            onClick={() => videoFile2InputRef.current.click()}
          >
            Select Second Video
          </button>
        </label>
        {videoFile2 && <p>Second Video: {videoFile2.name}</p>}

        <button className="process-button" onClick={mergeVideosWithFade}>
          {loading ? "Merging..." : "Merge Videos with Fade"}
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

export default Transition;
