const Sidebar = ({ items }) => {
  return (
    <div className="h-full w-64 bg-gray-800 text-white">
      <div className="p-5">My Items</div>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="p-2 hover:bg-gray-700 cursor-pointer">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;