import React, { useState, useEffect } from 'react';

import { convertToLaTeX } from '@/utils/latex';
import { getTokenOrRefresh } from '@/utils/stt-token';

import 'katex/dist/katex.min.css';
import MarkdownLatexEditor from './MarkdownLatexEditor';
import TextWithLatex from './TextWithLatex';
import FileDropZone from './FileDropZone';
import { saveNote, updateNote, getNoteById } from '@/utils/notes';
import { useExtendedState } from '@/utils/extendedState';
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

let recognizer;

const EditNote = ({ savedLatex, savedTitle, selectedNoteId, refreshHandler, handleNoteIdChange, setLockNoteId }) => {

  const [isListening, setIsListening] = useState(false);

  const [showMacros, setShowMacros] = useState(false);
  const [macros, setMacros] = useState({
    "quadratic formula": "$\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$",
    "for all": "$\\forall$",
    "there exists": "$\\exists$",
    "such that": "$\\text{ s.t. }$",
  });
  const [newMacroName, setNewMacroName] = useState('');
  const [newMacroLatex, setNewMacroLatex] = useState('');

  const handleAddMacro = () => {
    if (newMacroName && newMacroLatex) {
      setMacros({ ...macros, [newMacroName]: newMacroLatex });
      setNewMacroName('');
      setNewMacroLatex('');
    }
  };

  useEffect(() => {
    handleListen();
  }, [isListening]);

  useEffect(() => {
    setLatex(savedLatex);
    setTitle(savedTitle);
  }, [savedLatex, savedTitle]);

  useEffect(() => {
    setCurrentNoteId(selectedNoteId);
  }, [selectedNoteId]);

  const [fullTranscript, setFullTranscript, getFullTranscript] = useExtendedState('');
  const [latex, setLatex, getLatex] = useExtendedState('');
  const [title, setTitle, getTitle] = useExtendedState('');
  const [currentNoteId, setCurrentNoteId, getCurrentNoteId] = useExtendedState(selectedNoteId);

  const [lock, setLock, getLock] = useExtendedState(0);

  const handleListen = async () => {

    if (isListening) {
      const tokenObj = await getTokenOrRefresh();
      const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
      speechConfig.speechRecognitionLanguage = 'en-US';

      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.startContinuousRecognitionAsync();

      recognizer.recognizing = (s, e) => {
        console.log('Recognizing:', e.result.text);
        handleRecognizing(e);
      };

      recognizer.recognized = async (s, e) => {
        if (e.result.reason == ResultReason.RecognizedSpeech) {
          console.log('Recognized:', e.result.text);
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
        setLockNoteId(null);
      };
    } else {
      recognizer?.close();
    }
  };

  const handleRecognizing = (e) => {
    console.log('Recognizing:', e.result.text);
    setFullTranscript(e.result.text);
  }

  const handleRecognized = async (e) => {
    console.log('Recognized:', e.result.text);

    while (await getLock() == 1) {
      console.log('waiting...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await setLock(1);
    const noteId = await getCurrentNoteId();
    await setLockNoteId(noteId);
    const result = await convertToLaTeX(e.result.text, macros);

    const currLatex = await getLatex();
    const currTitle = await getTitle();
    await setLatex(currLatex + '\n\n' + result.latex); // append to existing LaTeX
    await setTitle(currTitle || result.title); // only set title if it's not already set

    const res = await saveNote(await getTitle(), await getLatex(), noteId);
    if (res.id) {
      handleNoteIdChange(res.id);
      refreshHandler();
    }
    await setLock(0);
  }

  const handleSaveNote = () => {
    setFullTranscript('');
    saveNote(title, latex, currentNoteId);
    refreshHandler();
  };

  return (
    <div className="w-full mx-auto bg-gray-800 shadow-md p-6">
      <div className='text-center'>
        <button
          onClick={() => setShowMacros(!showMacros)}
          className="px-4 py-2 mb-5 rounded-lg font-medium bg-blue-500 hover:bg-blue-700"
        >
          {showMacros ? 'Hide Macros' : 'Show Macros'}
        </button>
        {showMacros && (
          <div className="space-y-4">
            <div>
              <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4" action="javascript:void(0)">
                <input
                  type="text"
                  placeholder="Macro name"
                  value={newMacroName}
                  onChange={(e) => setNewMacroName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                />
                <input
                  type="text"
                  placeholder="LaTeX code"
                  value={newMacroLatex}
                  onChange={(e) => setNewMacroLatex(e.target.value)}
                  className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outlinel"
                />
                <button onClick={handleAddMacro} className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-700">Add Macro</button>
              </form>
              {Object.entries(macros).map(([name, latex], index) => (
                <div key={index} className="p-4 my-4 text-black bg-gray-50 rounded-lg flex">
                  <div className="p-2 w-full"><p className="font-semibold">{name}</p></div>
                  <div className="p-2 w-full"><TextWithLatex text={latex} /></div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mb-4">
          <button
            onClick={() => setIsListening(prevState => !prevState)}
            className={`px-4 py-2 rounded-lg font-medium ${isListening ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'} text-white`}
          >
            {isListening ? 'Stop' : 'Start'} Listening
          </button>
          <button
            onClick={handleSaveNote}
            disabled={!latex}
            className="ml-2 px-4 py-2 bg-green-500 hover:bg-green-700 rounded-lg font-medium text-white disabled:opacity-50"
          >
            Save Note
          </button>
        </div>
      </div>
      <div className="mb-4">
        <FileDropZone
          currentNoteId={currentNoteId}
          handleRecognizing={(e) => handleRecognizing(e)}
          handleRecognized={(e) => handleRecognized(e)}
          handleImageConverted={(imgLatex => setLatex(currLatex => currLatex + '\n\n' + imgLatex))}
        />
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Transcript</h2>
        <div className="p-4 text-black bg-gray-50 rounded-lg">{fullTranscript}</div>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Your Note</h2>
        <div className="p-4 text-black bg-gray-50 rounded-lg">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 font-bold text-3xl mb-3 leading-tight focus:outline-none focus:shadow-outline" />
          <MarkdownLatexEditor markdown={latex} setLatex={setLatex} />
        </div>
      </div>
    </div>
  )
}

export default EditNote;