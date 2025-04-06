import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Movies from "./MoviesAndSeriesList";
import Button from "../components/Button";export default function ChosenMovie() {
  const { id } = useParams();
  const playerRef = useRef(null);
  const movie = Movies.find((movie) => movie.id == id);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const adCounter = useRef(3);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [showAdButton, setShowAdButton] = useState(true);
  const [isTvShow, setIsTvShow] = useState(false);
  const [seasonsArray, setSeasonsArray] = useState([]);
  const [selectedSeason,setSelectedSeason] = useState(1);
  const handleSwitch = () => {
    if (movie.seasons) {
      setSeasonsArray(Object.entries(movie.seasons));
    }
  };

  useEffect(() => {
    if (movie?.id.toLowerCase().includes("tv")) {
      setIsTvShow(true);
      handleSwitch();
    }
  }, [movie]);

  const ads = [
    "https://dojo.mbd.one/app/coderdojo-@haufe.group/seria-3.2/activitate",
    "https://www.linkedin.com/in/david-chesa-824042296",
    "http://info.tm.edu.ro/"
  ];

  function getYouTubeVideoId(url) {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/|.*[?&]v=))([^&?]+)/
    );
    return match ? match[1] : null;
  }
  const currentSeason = seasonsArray.find(([seasonNumber]) => seasonNumber === selectedSeason);

  useEffect(() => {
    if (!window.YT && movie?.trailer_url) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("YouTube API Loaded");
        createPlayer();
      };
    } else if (movie?.trailer_url) {
      createPlayer();
    }
  }, [movie?.trailer_url, canPlayVideo]);

  const createPlayer = () => {
    if (!canPlayVideo) return;
    
    const videoId = getYouTubeVideoId(movie.trailer_url);
    if (!videoId) return;

    const initializePlayer = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        playerVars: { rel: 0, showinfo: 0 },
        events: {
          onReady: (event) => {
            console.log("YouTube Player Ready");
            playerRef.current = event.target;
            setIsPlayerReady(true);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer;
    }
  };

  const handleAdClick = () => {
    if (adCounter.current > 0) {
      const randomAd = ads[Math.floor(Math.random() * ads.length)];
      window.open(randomAd, "_blank");
      adCounter.current -= 1;
    } else {
      setCanPlayVideo(true);
      setShowAdButton(false);
    }
  };

  if (!movie) {
    return (
      <main className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <p>Movie not found.</p>
      </main>
    );
  }
  return (
    <main className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">{movie.title}</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={movie.thumbnail}
              alt={`${movie.title} poster`}
              className="w-64 h-96 object-cover rounded-lg shadow-lg"
            />
          <Button text={"Add to favorites"}></Button>
          </div>

          <div className="flex-grow space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">{movie.description}</p>
            {
              isTvShow &&
              (
                <p>Currently showing : {
                    
                  }</p>
              )
            }
            {movie.trailer_url ? (
                canPlayVideo ? (
                  <div
                    id="youtube-player"
                    className="relative w-full aspect-video rounded-lg overflow-hidden bg-black"
                  >
                    {!isPlayerReady && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                        <div className="w-12 h-12 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-300">Loading trailer...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-black flex flex-col items-center justify-center">
                    {showAdButton && (
                      <>
                        <button 
                          onClick={handleAdClick}
                          className="focus:outline-none transition-transform hover:scale-110 mb-4"
                        >
                          <svg 
                            width="80" 
                            height="80" 
                            viewBox="0 0 64 64" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="32" cy="32" r="30" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2"/>
                            <path d="M26 22L42 32L26 42V22Z" fill="white"/>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                )
              ) : (
              <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No trailer available</p>
              </div>
            )}
          </div>
        </div>

        {isTvShow && seasonsArray.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Seasons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {seasonsArray.map(([seasonNumber, seasonData], index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedSeason(seasonNumber)}
                  className={`p-4 text-center rounded-lg font-semibold transition-all ${
                    selectedSeason === seasonNumber 
                      ? "bg-yellow-500 text-black shadow-lg scale-105"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <p>Season {seasonNumber}</p>
                  <p className="text-sm text-gray-400">{seasonData.episodes} episodes</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {isTvShow && currentSeason && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Episodes</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4">
              {Array.from({ length: currentSeason[1].episodes }, (_, i) => (
                <button
                  key={i}
                  className="bg-gray-700 hover:bg-yellow-500 hover:text-black transition-all p-3 rounded-lg text-center font-medium shadow-md"
                >
                  Episode {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}