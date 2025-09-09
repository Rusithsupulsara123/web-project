
const SearchBar = ({ query, setQuery }) => {
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search questions..."
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-200 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
    />
  );
};

export default SearchBar;