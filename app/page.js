"use client";

import { useEffect, useState } from 'react';
import EditNote from '@/components/EditNote'
import Navbar from '@/components/Navbar';
import { Sidebar, UnauthSidebar} from '@/components/SideBar';

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
      }
      const selected = notes.find(note => note.id === selectedItem);
      if (selected) handleItemSelected(selected);
      setNeedsRefresh(false);
    }
    fetchData();
  }, [needsRefresh]);

  const [selectedItem, setSelectedItem] = useState(null);
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

  return (
    <div className="min-h-screen bg-gray-1000 p-6">
      <Navbar />
      <div className='flex'>
        {loggedIn ? <Sidebar notes={notes} onItemSelected={handleItemSelected} selectedItem={selectedItem} /> : <UnauthSidebar />}
        <EditNote savedLatex={savedLatex} savedTitle={savedTitle} currentNoteId={selectedItem} refreshHandler={refreshHandler} />
      </div>
    </div>
  );
}

export default App;
