"use client";

import { useEffect, useState } from 'react';
import EditNote from '@/components/EditNote'
import Summary from '@/components/Summary';
import Quiz from '@/components/Quiz';
import Navbar from '@/components/Navbar';
import { useExtendedState } from '@/utils/extendedState';
import { Sidebar, UnauthSidebar } from '@/components/SideBar';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { getNotes, getChatGPTNoteById } from '@/utils/notes';

const getQuery = () => {
  return new URLSearchParams(window.location.search);
}

const App = () => {

  const dummy = {
    'id': 'data-new-note',
    'title': '+ New Note'
  };

  const [notes, setNotes] = useState([dummy]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  const [selection, setSelection] = useState('Transcript');

  const refreshHandler = () => {
    setNeedsRefresh(true);
  }

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })

  useEffect(() => {
    async function fetchData() {
      const notes = await getNotes();
      if (notes === -1) {
        setLoggedIn(false);
      } else {
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
  const [lockNoteId, setLockNoteId, getLockNoteId] = useExtendedState(null);

  const handleItemSelected = async (note) => {

    if (await getLockNoteId() && await getLockNoteId() !== -1 && await getLockNoteId() !== note.id) {
      withReactContent(Swal).fire({
        icon: "error",
        title: "Please wait",
        text: "You are currently transcribing something in this note. Please wait for it to finish before switching."
      });
      return
    }

    setSelectedItem(note.id);

    if (note.id === 'data-new-note') {
      if (getQuery().get('gptNoteId')) {
        return;
      }
      setSavedLatex('');
      setSavedTitle('');
      return;
    }
    setSavedLatex(note.content);
    setSavedTitle(note.title);
    setSelection('Transcript');
  };

  useEffect(() => {
    async function fetchData() {
      const query = getQuery();
      const noteId = query.get('gptNoteId');
      if (noteId) {
        const gptNote = await getChatGPTNoteById(noteId);
        const newNotes = notes.map(n => {
          if (n.id === 'data-new-note') {
            return {
              id: n.id,
              title: gptNote.title,
              content: gptNote.content
            }
          }
          return n;
        });
        setNotes(newNotes);
        setSavedLatex(gptNote.content);
        setSavedTitle(gptNote.title);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-blue-800 dark:text-white py-6">
      <Navbar loggedIn={loggedIn} />
      <div className='flex'>
        {loggedIn ? <Sidebar notes={notes} onItemSelected={handleItemSelected} selectedItem={selectedItem} /> : <UnauthSidebar />}
        <div className="w-full flex flex-wrap items-center justify-between mx-auto">
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 bg-gray-50 md:flex-row rtl:space-x-reverse md:mt-0 md:border-0 bg-gray-200 dark:bg-gray-900 border-gray-700">
              <li>
                <button className={`block py-2 px-3 ${selection === 'Transcript' ? 'bg-gray-100 text-blue-700' : 'hover:text-blue-700 dark:hover:text-blue-700 text-blue-500 dark:text-blue-400 hover:bg-transparent'} border-0 p-0`}
                  onClick={() => setSelection('Transcript')}>Transcript</button>
              </li>
              <li>
                <button className={`block py-2 px-3 ${selection === 'Summary' ? 'bg-gray-100 text-blue-700' : 'hover:text-blue-700 dark:hover:text-blue-700 text-blue-500 dark:text-blue-400 hover:bg-transparent'} border-0 p-0`}
                  onClick={() => setSelection('Summary')}>Summary</button>
              </li>
              <li>
                <button className={`block py-2 px-3 ${selection === 'Quiz' ? 'bg-gray-100 text-blue-700' : 'hover:text-blue-700 dark:hover:text-blue-700 text-blue-500 dark:text-blue-400 hover:bg-transparent'} border-0 p-0`}
                  onClick={() => setSelection('Quiz')}>Quiz</button>
              </li>
            </ul>
          </div>
          {
            selection === 'Transcript' && <EditNote
              savedLatex={savedLatex}
              savedTitle={savedTitle}
              selectedNoteId={selectedItem}
              handleNoteIdChange={setSelectedItem}
              refreshHandler={refreshHandler}
              setLockNoteId={setLockNoteId}
            />
          }
          {
            selection === 'Summary' &&<Summary selectedNoteId={selectedItem} />
          }
          {
            selection === 'Quiz' && <Quiz selectedNoteId={selectedItem} />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
