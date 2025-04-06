import Movies from "./MoviesAndSeriesList";
import PreviewMovie from "../components/Preview";
import { useState } from "react";

export default function Movie() {
    const [titleChoose, setTitleChoose] = useState(null | []);
    const includeLocation = window.location.pathname === "/movies" ? "MOV" : "TV";
    console.log(titleChoose);
    return (
        <main className="bg-gray-900">
            <div className="flex flex-wrap gap-2">
                {Movies.map((movie) =>
                    movie.id.includes(includeLocation) && (
                        <div
                            onClick={() => setTitleChoose(movie)}
                            key={movie.id}
                            className="bg-gray-800 rounded-xl shadow-md overflow-hidden w-40 h-60 transform transition-all hover:scale-105 hover:shadow-lg"
                        >
                            <img
                                src={movie.thumbnail}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                <h2 className="text-sm font-semibold text-white text-center truncate hover:bg-blur">
                                    {movie.title}
                                </h2>
                            </div>
                        </div>
                    )
                )}
            </div>

            {titleChoose && (
                <PreviewMovie
                    Movie={titleChoose}
                    onClose={() => setTitleChoose(null)}
                />
            )}
        </main>
    );
}
