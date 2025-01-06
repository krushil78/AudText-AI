import axios from "axios";
import { useState } from "react";

const AiUploader = () => {
  const [hindiMessage, setHindiMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert("Please upload an audio file.");
      return;
    }

    if (!file.type.startsWith("audio/")) {
      alert("The file must be an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      setLoading(true);
      setProgress(0);
      setHindiMessage("");

      const response = await axios.post("https://audtextbackend.onrender.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      if (response.status === 200) {
        const { transcription } = response.data;
        setHindiMessage(transcription || "No Hindi transcription available.");
      } else {
        throw new Error("Failed to upload and transcribe the audio file.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSRT = (text) => {
    const lines = text.split("\n");
    let srtContent = "";
    let startTime = 0;

    lines.forEach((line, index) => {
      const endTime = startTime + 3; // 3 seconds per line
      srtContent += `${index + 1}\n`;
      srtContent += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
      srtContent += `${line}\n\n`;
      startTime = endTime;
    });

    return srtContent;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${secs},000`;
  };

  const handleDownloadSRT = (text, filename) => {
    if (!text) {
      alert("No transcription available to download.");
      return;
    }

    const srtContent = generateSRT(text);
    const blob = new Blob([srtContent], { type: "text/srt" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyToClipboard = (text) => {
    if (!text) {
      alert("No transcription available to copy.");
      return;
    }

    navigator.clipboard.writeText(text).then(
  
      (err) => console.error("Error copying to clipboard:", err)
    );
  };

  return (
    <div className="flex flex-col items-center p-6  text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Audio to Text Transcription</h1>

      <label className="relative mb-6">
        <span className="text-white bg-blue-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-500 focus:outline-none">
          Choose File
        </span>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      {loading ? (
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="absolute inset-0 flex items-center justify-center font-bold text-lg">
              {progress}%
            </p>
          </div>
          <p className="mt-4 text-lg">Processing...</p>
        </div>
      ) : (
        hindiMessage && (
          <div className="bg-gray-800 p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-end space-x-4 mb-4">
              <button
                onClick={() => handleDownloadSRT(hindiMessage, "hindi_transcription.srt")}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
              >
                Download SRT
              </button>
              <button
                onClick={() => handleCopyToClipboard(hindiMessage)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
              >
                Copy 
              </button>
            </div>
            <p className="text-lg font-semibold mb-4">Hindi Transcription:</p>
            <div className="space-y-2">
              {hindiMessage
                .split("\n")
                .map((line, index) => (
                  <p key={index} className="text-sm text-gray-300">
                    {line}
                  </p>
                ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AiUploader;
