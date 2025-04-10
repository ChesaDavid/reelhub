import { Link } from "react-router-dom";

export default function PreviewMovie({ Movie, onClose }) {
    if (!Movie) return null;

    const isTvShow = Movie.id.includes("TV");

    return (
        // scroll
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-gray-800 flex flex-row gap-8 p-6 rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] relative"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={Movie.thumbnail}
                    alt={Movie.title}
                    className="w-1/3 rounded-lg shadow-md object-cover h-fit"
                />

                <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">{Movie.title}</h2>
                        <p className="mt-3 text-gray-400">{Movie.description}</p>

                        <div className="mt-5 flex items-center gap-5 text-white">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">⭐ IMDb:</span>
                                <span
                                    className={`font-bold ${
                                        Movie.imdbRating >= 8
                                            ? 'text-green-400'
                                            : 'text-yellow-400'
                                    }`}
                                >
                                    {Movie.imdb_score}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">🎯 Metascore:</span>
                                <span className="font-bold">{Movie.metascore}</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-gray-400">Genres:</span>
                            <span className="font-bold text-white ml-2">
                                {Movie.genre.map((m)=>{
                                    return (
                                        <span key={m} className="mr-2 bg-gray-700 rounded px-2 py-1">
                                            {m}
                                        </span>
                                    );
                                })}
                            </span>
                        </div>
                        {isTvShow && (
                            <div className="mt-5 text-white">
                                <h3 className="text-gray-400 text-lg font-medium mb-2 text-center">
                                    Seasons
                                </h3>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {Object.entries(Movie.seasons).map(([seasonNumber, seasonData]) => (
                                        <Link
                                            key={seasonNumber}
                                            className="w-24 bg-gray-800/80 hover:bg-gray-700/90 transition-all rounded-lg p-3 shadow-md flex flex-col items-center"
                                        >
                                            <span className="font-semibold text-sm">
                                                Season {seasonNumber}
                                            </span>
                                            <div className="mt-1 flex items-center">
                                                <span className="text-yellow-400">★</span>
                                                <span className="text-sm ml-1">
                                                    {seasonData.avg_rating
                                                        ? seasonData.avg_rating.toFixed(1)
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400 mt-1">
                                                {seasonData.episodes} eps
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        className="mt-5 bg-green-500 text-center text-white py-2 px-4 rounded-lg w-full hover:bg-green-700 transition"
                        to={
                            Movie.id.includes("MOV")
                                ? `/movies/${Movie.id}`
                                : `/tv-series/${Movie.id}`
                        }
                    >
                        ▶
                    </Link>
                </div>

                <button
                    className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ✖️
                </button>
            </div>
        </div>
    );
}
