import React, { useState, useCallback } from 'react';
import { getTokenOrRefresh } from '@/utils/stt-token';
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
const speechsdk = require('microsoft-cognitiveservices-speech-sdk')


const sttFromFile = async (audioFile, currentNoteId, handleRecognizing, handleRecognized) => {
  const tokenObj = await getTokenOrRefresh();
  const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
  speechConfig.speechRecognitionLanguage = 'en-US';

  const audioConfig = speechsdk.AudioConfig.fromWavFileInput(audioFile);
  const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
  recognizer.startContinuousRecognitionAsync();

  recognizer.recognizing = (s, e) => {
    handleRecognizing(e);
  };

  recognizer.recognized = (s, e) => {
    if (e.result.reason == ResultReason.RecognizedSpeech) {
      handleRecognized(e);
    }
    else if (e.result.reason == ResultReason.NoMatch) {
      console.log("NOMATCH: Speech could not be recognized.");
    }
  };

  recognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);

    if (e.reason == sdk.CancellationReason.Error) {
      console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
      console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
      console.log("CANCELED: Did you set the speech resource key and region values?");
    }

    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.sessionStopped = (s, e) => {
    console.log("\n    Session stopped event.");
    recognizer.stopContinuousRecognitionAsync();
  };

}

const AudioDropZone = ({ currentNoteId, handleRecognizing, handleRecognized }) => {
  const [audioFile, setAudioFile] = useState(null);

  // Handle drag over event to prevent default behavior
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files)//.filter(file =>
    //   file.type.startsWith('audio/')
    // );
    const audioFile = files[0];
    setAudioFile(audioFile);
    sttFromFile(audioFile, currentNoteId, handleRecognizing, handleRecognized);
  }, []);

  if (audioFile) {
    return (
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center"
      >
        <p>Uploaded file: {audioFile.name}</p>
      </div>
    );
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p>You can also drag and drop audio files here.</p>
    </div>
  );
};

export default AudioDropZone;