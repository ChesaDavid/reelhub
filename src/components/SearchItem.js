import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Movies from "../pages/MoviesAndSeriesList";

export default function SearchItems({ searchQuery, onClose }) {
  const [moviesFound, setMoviesFound] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const results = Movies.filter((mov) =>
        mov.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mov.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMoviesFound(results);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md rounded-md z-50 p-4">
        <p className="text-center text-gray-500 dark:text-gray-400">Searching...</p>
      </div>
    );
  }

  if (!moviesFound.length) {
    return (
      <div className="absolute top-full left-0 w-full bg-gray-900 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md rounded-md z-50 p-4">
        <p className="text-center text-gray-500 dark:text-gray-400">
          No results found for "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div 
      className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-md overflow-hidden z-50 max-h-96 overflow-y-auto"
    >
      {moviesFound.map((movie) => (
        <Link
          key={movie.id}
          to={movie.id.includes("TV") ? `/tv-series/${movie.id}` : `/movies/${movie.id}`}
          className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition border-b border-gray-100 dark:border-gray-700 last:border-b-0"
          onClick={onClose}
        >
          <div className="flex items-center">
            {movie.poster && (
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-10 h-14 object-cover rounded mr-3" 
                loading="lazy"
              />
            )}
            <div>
              <h3 className="text-md font-bold text-gray-800 dark:text-gray-200">
                {movie.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {movie.year} • {movie.id.includes("TV") ? "TV Series" : "Movie"}
                {movie.rating && ` • ${movie.rating}`}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}