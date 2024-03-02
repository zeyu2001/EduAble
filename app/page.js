"use client";

import { useEffect, useState } from 'react';
import EditNote from '../components/EditNote'
import Navbar from '../components/Navbar';
import { Sidebar, UnauthSidebar} from '@/components/SideBar';

import { getNotes } from '@/utils/notes';

const App = () => {

  const [notes, setNotes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const notes = await getNotes();
      if (notes === -1) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
        console.log(notes);
        setNotes(notes);
      }
    }
    fetchData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-1000 p-6">
      <Navbar />
      <div className='flex'>
        {loggedIn ? <Sidebar notes={notes} /> : <UnauthSidebar />}
        <EditNote />
      </div>
    </div>
  );
}

export default App;
