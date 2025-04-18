import { useState } from "react";
import Movies from "./MoviesAndSeriesList";
import PreviewMovie from "../components/Preview";

export default function TopIMBD() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const sortedMovies = [...Movies].sort((a, b) => b.imdb_score - a.imdb_score)
    .filter(movie => movie.imdb_score)
    .slice(0, 20);

  return (
    <main className="min-h-screen bg-gray-900 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="text-yellow-400 text-4xl">★</span>
          Top 20 by IMDb Rating
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {sortedMovies.map((movie, index) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className="group cursor-pointer relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 bg-gradient-to-b from-black/70 to-transparent p-2">
                <span className="text-2xl font-bold text-yellow-400">
                  #{index + 1}
                </span>
              </div>
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

        {selectedMovie && (
          <PreviewMovie
            Movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>
    </main>
  );
}