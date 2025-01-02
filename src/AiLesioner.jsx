import { useState } from "react";

const AiLesioner = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false); // Track the recording state
  const [isPaused, setIsPaused] = useState(false); // Track the pause state
  const [fileReady, setFileReady] = useState(false); // Track if the file is ready to be downloaded
  const [recognition, setRecognition] = useState(null); // Store the recognition instance

  const handleSpeechToText = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    const newRecognition = new window.webkitSpeechRecognition();
    newRecognition.lang = "en-IN"; // Set to Indian English for Hinglish support
    newRecognition.interimResults = true; // Capture interim results for longer audio
    newRecognition.continuous = true; // Allow continuous listening for longer audio

    let fullTranscript = "";

    newRecognition.onstart = () => {
      setIsRecording(true);
      setIsPaused(false);
      console.log("Speech recognition started. Speak into the microphone...");
    };

    newRecognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          fullTranscript += event.results[i][0].transcript + " ";
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setMessage(fullTranscript + interimTranscript);
    };

    newRecognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Error occurred during speech recognition. Please try again.");
    };

    newRecognition.onend = () => {
      setIsRecording(false);
      setFileReady(true); // Set the file as ready to download
      console.log("Speech recognition ended.");
    };

    newRecognition.start();
    setRecognition(newRecognition);

    setTimeout(() => {
      newRecognition.stop();
      console.log("Stopped listening automatically after 1.5 minutes.");
    }, 90000); // Stop after 1.5 minutes (90,000 milliseconds)
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      console.log("Recording stopped.");
      setIsRecording(false);
    }
  };


  const saveToTextFile = (text) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recognized_speech.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg max-w-2xl my-10 p-6 w-full text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-4 text-center">Speech to Text</h1>

      {/* Start Recording Button */}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={handleSpeechToText}
          className="py-3 px-6 bg-purple-500 hover:bg-purple-400 rounded-lg text-white transition-all duration-200"
        >
          🎤 {isRecording ? "Listening..." : "Start Listening"}
        </button>

       
       
        {/* Stop Button */}
        <button
          onClick={stopRecording}
          className="py-3 px-6 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-all duration-200"
          disabled={!isRecording}
        >
          Stop
        </button>
      </div>

      {/* Display Recognized Text */}
      <p className="text-lg mb-4">
        <strong>Recognized Speech:</strong>
        <div className="container">{message}</div>
      </p>

      {/* Download Button (only shows when the file is ready) */}
      {fileReady && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => saveToTextFile(message)}
            className="py-3 px-6 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-all duration-200"
          >
            Download Text File
          </button>
        </div>
      )}
    </div>
  );
};

export default AiLesioner;
