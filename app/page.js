"use client";

import { useEffect, useState } from 'react';
import EditNote from '@/components/EditNote'
import Summary from '@/components/Summary';
import Navbar from '@/components/Navbar';
import { Sidebar, UnauthSidebar } from '@/components/SideBar';

import { getNotes } from '@/utils/notes';

const App = () => {

  const dummy = {
    'id': 'data-new-note',
    'title': '+ New Note'
  };

  const [notes, setNotes] = useState([dummy]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const refreshHandler = () => {
    setNeedsRefresh(true);
  }

  useEffect(() => {
    async function fetchData() {
      const notes = await getNotes();
      if (notes === -1) {
        setLoggedIn(false);
      } else {
        notes.reverse()
        notes.unshift(dummy)
        setLoggedIn(true);
        setNotes(notes);

        const selected = notes.find(note => note.id === selectedItem);
        if (selected) handleItemSelected(selected);
      }
      setNeedsRefresh(false);
    }
    fetchData();
  }, [needsRefresh]);

  const [selectedItem, setSelectedItem] = useState('data-new-note'); // 'data-new-note' is the id of the button '+ New Note'
  const [savedLatex, setSavedLatex] = useState('');
  const [savedTitle, setSavedTitle] = useState('');

  const handleItemSelected = (note) => {

    setSelectedItem(note.id);
    console.log(note);

    if (note.id === 'data-new-note') {
      setSavedLatex('');
      setSavedTitle('');
      return;
    }
    setSavedLatex(note.content);
    setSavedTitle(note.title);
  };

  const [selection, setSelection] = useState('Transcript');

  return (
    <div className="min-h-screen bg-gray-1000 py-6">
      <Navbar />
      <div className='flex'>
        {loggedIn ? <Sidebar notes={notes} onItemSelected={handleItemSelected} selectedItem={selectedItem} /> : <UnauthSidebar />}
        <div className="w-full flex flex-wrap items-center justify-between mx-auto">
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 bg-gray-50 md:flex-row rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <button className={`block py-2 px-3 ${selection === 'Transcript' ? 'bg-gray-100 text-blue-700' : 'hover:bg-gray-100 hover:text-blue-700 text-blue-400'} hover:bg-transparent border-0 p-0`}
                  onClick={() => setSelection('Transcript')}>Transcript</button>
              </li>
              <li>
                <button className={`block py-2 px-3 ${selection === 'Summary' ? 'bg-gray-100 text-blue-700' : 'hover:bg-gray-100 hover:text-blue-700 text-blue-400'} hover:bg-transparent border-0 p-0`}
                  onClick={() => setSelection('Summary')}>Summary</button>
              </li>
            </ul>
          </div>
          {
            selection === 'Transcript' ? <EditNote
              savedLatex={savedLatex}
              savedTitle={savedTitle}
              selectedNoteId={selectedItem}
              handleNoteIdChange={setSelectedItem}
              refreshHandler={refreshHandler}
            /> : <Summary selectedNoteId={selectedItem} />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
