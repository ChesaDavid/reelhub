import Movies from "./MoviesAndSeriesList";
import PreviewMovie from "../components/Preview";
import { useState } from "react";

export default function Movie() {
  const [titleChoose, setTitleChoose] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [pressFilter, setPressFilter] = useState(false);

  const genre = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ];

  const includeLocation = window.location.pathname === "/movies" ? "MOV" : "TV";

  const handlePressFilter = () => {
    setPressFilter(!pressFilter);
    setSelectedGenre(null);
  };

  const filteredMovies = Movies.filter(
    (movie) =>
      movie.id.includes(includeLocation) &&
      (!selectedGenre || movie.genre?.includes(selectedGenre))
  );

  return (
    <main className="min-h-screen bg-gray-900 px-6 py-8">
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={handlePressFilter}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h18M3 12h18M3 20h18"
            />
          </svg>
          <span className="text-xl font-semibold">Filter by Genre</span>
        </button>

        {pressFilter && (
          <div className="mt-4 flex flex-wrap gap-3">
            {genre.map((gen) => (
              <button
                key={gen}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200
                  ${
                    selectedGenre === gen
                      ? "bg-yellow-500 text-gray-900 shadow-lg transform scale-105"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                onClick={() => {
                  setSelectedGenre((prev) => (prev === gen ? null : gen));
                  setPressFilter(false);
                }}
              >
                {gen}
              </button>
            ))}
          </div>
        )}
        {selectedGenre && (
          <div className="mt-4 flex items-center gap-2">
            {includeLocation === "MOV" ? (
              <h1 className="text-xl font-semibold text-white">
                {selectedGenre} Movies
              </h1>
            ) : (
              <h1 className="text-xl font-semibold text-white">
                {selectedGenre} TV Series
              </h1>
            )}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setTitleChoose(movie)}
              className="group cursor-pointer relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-white font-semibold text-center">
                    {movie.title}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white">{movie.imdb_score}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {titleChoose && (
        <PreviewMovie
          Movie={titleChoose}
          onClose={() => setTitleChoose(null)}
        />
      )}
    </main>
  );
}
