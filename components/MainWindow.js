import React, { useState } from 'react';

const MainWindow = () => {
  // State to keep track of the current selection
  const [selection, setSelection] = useState('Transcript');

  return (
    <div className="w-full bg-gray-100 p-4 flex justify-between items-center">
      {/* Buttons to switch between Transcript and Summary */}
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded-lg ${selection === 'Transcript' ? 'bg-blue-500 text-white' : 'bg-gray-800'}`}
          onClick={() => setSelection('Transcript')}
        >
          Transcript
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${selection === 'Summary' ? 'bg-blue-500 text-white' : 'bg-gray-800'}`}
          onClick={() => setSelection('Summary')}
        >
          Summary
        </button>
      </div>
    </div>
  );
};

export default MainWindow;