import React, { useState, useEffect } from 'react';

import { convertToLaTeX } from '@/utils/latex';
import { getTokenOrRefresh } from '@/utils/stt-token';

import 'katex/dist/katex.min.css';
import MarkdownLatexEditor from './MarkdownLatexEditor';
import TextWithLatex from './TextWithLatex';
import AudioDropZone from './AudioDropZone';
import { saveNote, updateNote, getNoteById } from '@/utils/notes';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';
const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

let recognizer;

const EditNote = ({ savedLatex, savedTitle, selectedNoteId, refreshHandler, handleNoteIdChange }) => {

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

  const [fullTranscript, setFullTranscript] = useState('');
  const [latex, setLatex] = useState('');
  const [title, setTitle] = useState('');
  const [currentNoteId, setCurrentNoteId] = useState(selectedNoteId);

  const handleListen = async () => {

    if (isListening) {
      const tokenObj = await getTokenOrRefresh();
      const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
      speechConfig.speechRecognitionLanguage = 'en-US';

      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizeOnceAsync(async (result) => {
        if (result.reason === ResultReason.RecognizedSpeech) {
          const transcript = result.text;
          const { latex, title } = await convertToLaTeX(fullTranscript + ' ' + transcript, macros);
          setFullTranscript(fullTranscript + ' ' + transcript);
          setLatex(latex);
          setTitle(title);
        } else {
          withReactContent(Swal).fire({
            icon: "error",
            title: "Error",
            text: 'Speech was cancelled or could not be recognized. Ensure your microphone is working properly.'
          })
        }
      });
    } else {
      recognizer?.close();
    }
  };

  useEffect(() => {
    localStorage.setItem('lock', 0);
    localStorage.removeItem('noteId');
  }, []);

  const handleRecognizing = (e) => {
    console.log('Recognizing:', e.result.text);
    setFullTranscript(e.result.text);
  }

  const handleRecognized = async (e) => {
    console.log('Recognized:', e.result.text);

    let currLatex;
    let currTitle;

    const lock = localStorage.getItem('lock');
    while (lock == 1) {
      console.log('waiting...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // TODO: use states instead of this hack
    localStorage.setItem('lock', 1);
    const noteId = localStorage.getItem('noteId');
    
    if (!noteId || noteId === 'data-new-note') {
      currLatex = ''
      currTitle = ''
    } else {
      const data = await getNoteById(noteId);
      currLatex = data.content
      currTitle = data.title
    }

    const result = await convertToLaTeX(e.result.text, macros);
    setLatex(currLatex + '\n' + result.latex);
    if (!currTitle) {
      setTitle(result.title); 
      currTitle = result.title;
    }

    const res = await saveNote(currTitle, currLatex + result.latex, noteId);
    if (res.id) {
      handleNoteIdChange(res.id);
      refreshHandler();
      localStorage.setItem('noteId', res.id);
    }
    localStorage.setItem('lock', 0);
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
        <AudioDropZone
          currentNoteId={currentNoteId}
          handleRecognizing={(e) => handleRecognizing(e)}
          handleRecognized={(e) => handleRecognized(e)}
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