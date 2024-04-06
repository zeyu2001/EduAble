import React, { useState, useCallback } from 'react';
import { getTokenOrRefresh } from '@/utils/stt-token';
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { TailSpin } from 'react-loader-spinner'
import { convertImage } from '@/utils/latex';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')


const sttFromFile = async (audioFile, currentNoteId, handleRecognizing, handleRecognized, handleStop) => {
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
    handleStop();
  };

}

const FileDropZone = ({ currentNoteId, handleRecognizing, handleRecognized, handleImageConverted }) => {
  const [file, setFile] = useState(null);
  const [done, setDone] = useState(true);

  // Handle drag over event to prevent default behavior
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files)
    const file = files[0];
    const fileType = file.type.split('/')[0];

    if (fileType === 'audio') {
      setFile(file);
      setDone(false);
      sttFromFile(file, currentNoteId, handleRecognizing, handleRecognized, () => setDone(true));
    }
    else if (fileType === 'image') {
      setFile(file);
      setDone(false);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target.result;
        const { latex } = await convertImage(imageUrl);
        handleImageConverted(latex);
        setDone(true);
      };
      reader.readAsDataURL(file);
    }
    else {
      withReactContent(Swal).fire({
        icon: "error",
        title: "Invalid file type",
        text: "Please upload an audio or image file",
      })
    }
  }, []);

  if (file) {
    return (
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {done ? <></> : <div className="flex justify-center items-center my-2">
          <TailSpin
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>}
        <p>Uploaded file: {file.name}</p>
      </div>
    );
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer text-center"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <p>You can also drag and drop audio or image files here.</p>
    </div>
  );
};

export default FileDropZone;