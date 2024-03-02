"use client";

import EditNote from '../components/EditNote'
import Navbar from '../components/Navbar';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-1000 p-6">
      <Navbar />
      <EditNote />
    </div>
  );
}

export default App;
