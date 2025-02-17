import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState("");
  const [caste, setCaste] = useState("");
  const [religion, setReligion] = useState("");
  const [collegeType, setCollegeType] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/scholarships/search`, {
        query,
        caste,
        religion,
        collegeType,
      });
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-white transition-colors duration-200 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto p-2.5 sm:p-4">
        <div className="flex items-center justify-between mb-4 max-sm:gap-4">
          <h1 className="text-2xl font-bold text-nowrap text-[#589987] dark:text-[#7AB5A4]">
            <a href="/">Scholarship Hub</a>
          </h1>
          <div className="flex items-center gap-1 sm:gap-4">
            <span className="max-sm:text-sm text-gray-700 dark:text-gray-300">
              Found {results.length}{" "}
              {results.length > 1 ? "scholarships" : "scholarship"}
            </span>
            <button
              onClick={toggleTheme}
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search scholarships..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full p-2 border-[1.5px] rounded mb-4 outline-none focus:border-[#589987] bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-[#7AB5A4]"
        />

        <div className="flex gap-2 sm:gap-4 mb-4 max-sm:text-sm">
          <select
            className="p-2 border rounded w-1/3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={caste}
            onChange={(e) => setCaste(e.target.value)}
          >
            <option value="">-Caste</option>
            <option value="General">General</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
          </select>

          <select
            className="p-2 border rounded w-1/3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={religion}
            onChange={(e) => setReligion(e.target.value)}
          >
            <option value="">-Religion</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Christian">Christian</option>
          </select>

          <select
            className="p-2 border rounded w-[45%] sm:w-1/3 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={collegeType}
            onChange={(e) => setCollegeType(e.target.value)}
          >
            <option value="">-College Type</option>
            <option value="Government">Government</option>
            <option value="Local">Local</option>
            <option value="State">State</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="bg-[#264E43] text-white p-2 rounded w-full relative hover:bg-[#1c3931] transition-colors dark:bg-[#589987] dark:hover:bg-[#488b79]"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">Searching...</div>
          ) : (
            "Search"
          )}
        </button>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#264E43] dark:border-[#589987]"></div>
            </div>
          ) : results.length > 0 ? (
            results.map((scholarship, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg mb-4 shadow-sm cursor-pointer hover:scale-[1.01] transition-all bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-700/50"
              >
                <h2 className="text-[1.35rem] font-semibold text-gray-900 dark:text-white">
                  {scholarship.title}
                </h2>

                <ReactMarkdown className="text-gray-600 dark:text-gray-300 my-2">
                  {scholarship.description}
                </ReactMarkdown>

                <span className="text-sm text-gray-700 dark:text-gray-400">
                  <strong>Caste:</strong> {scholarship.caste} |{" "}
                  <strong>Religion:</strong> {scholarship.religion} |{" "}
                  <strong>College Type:</strong> {scholarship.collegeType}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No scholarships found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
