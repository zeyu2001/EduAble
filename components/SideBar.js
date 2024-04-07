const Sidebar = ({ notes, onItemSelected, selectedItem }) => {
  return (
    <div className="h-vh w-64 bg-gray-300 dark:bg-gray-900 text-blue-700 dark:text-white">
      <div className="p-5">My Notes</div>
      <ul>
        {notes.map((note, index) => (
          <li key={index} 
            className={`px-5 py-2 ${selectedItem && note.id === selectedItem ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"} cursor-pointer`} 
            onClick={() => onItemSelected(note)}>
              {note.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const UnauthSidebar = () => {
  return (
    <div className="h-vh w-64 bg-gray-300 dark:bg-gray-900 text-blue-700 dark:text-white">
      <div className="p-5">My Notes</div>
      <ul>
        <li className="px-5 py-2 cursor-pointer">
          You are not logged in. Log in to save notes and access them from anywhere.
        </li>
      </ul>
    </div>
  );
}

export { Sidebar, UnauthSidebar }