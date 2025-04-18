import { Link } from "react-router-dom";

const PreviewMovie = ({ Movie, onClose }) => {
    if (!Movie) return null;

    const isTvShow = Movie.type === "tv_show";
    const numberOfSeasons = isTvShow ? Object.keys(Movie.seasons).length : 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={onClose}>
            <div className="bg-gray-800 flex flex-row gap-8 p-6 rounded-2xl shadow-lg w-full max-w-3xl max-h-[90vh] relative"
                onClick={(e) => e.stopPropagation()}>
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
                                <span className={`font-bold ${
                                    Movie.imdb_score >= 8 ? 'text-green-400' : 'text-yellow-400'
                                }`}>
                                    {Movie.imdb_score || 'N/A'}
                                </span>
                            </div>

                            {Movie.metascore && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">🎯 Metascore:</span>
                                    <span className="font-bold">{Movie.metascore}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <div className="flex flex-wrap gap-2">
                                {Movie.genre?.map((genre) => (
                                    <span key={genre} 
                                        className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {isTvShow && numberOfSeasons > 0 && (
                            <div className="mt-5">
                                <h3 className="text-gray-400 font-medium mb-2">
                                    {numberOfSeasons} Seasons
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {Object.entries(Movie.seasons).slice(0, 6).map(([season, data]) => (
                                        <div key={season} 
                                            className="bg-gray-700 p-2 rounded text-center">
                                            <div className="text-sm text-white">Season {season}</div>
                                            <div className="text-xs text-gray-400">
                                                {data.episodes} episodes
                                            </div>
                                            {data.avg_rating && (
                                                <div className="text-yellow-400 text-xs">
                                                    ★ {data.avg_rating}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        className="mt-5 bg-blue-600 text-center text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        to={Movie.type === "movie" ? `/movies/${Movie.id}` : `/tv-series/${Movie.id}`}
                    >
                        View Details
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
};

export default PreviewMovie;
