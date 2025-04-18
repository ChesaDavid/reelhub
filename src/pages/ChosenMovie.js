import { useParams, Link } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import Movies from "./MoviesAndSeriesList";
import { app, db } from "../firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function ChosenMovie() {
  const { id } = useParams();
  const playerRef = useRef(null);
  const movie = Movies.find((movie) => movie.id === id);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const adCounter = useRef(2);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [showAdButton, setShowAdButton] = useState(true);
  const [isTvShow, setIsTvShow] = useState(false);
  const [seasonsArray, setSeasonsArray] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const ultimulClick = useRef(null);
  const [selevtedEpisode, setSelectedEpisode] = useState(null);
  const [genre, setGenre] = useState([]);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [documentContent, setDocumentContent] = useState(null);
  const [currentEpisodeTitle, setCurrentEpisodeTitle] = useState("");
  const [isLoadingEpisode, setIsLoadingEpisode] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [currentSeason, setCurrentSeason] = useState(null);
  const auth = getAuth(app);
  useEffect(() => {
    if (!user) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
          const docRef = doc(db, "favorites", user.uid);
          const docSnap = getDoc(docRef).then((doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              console.log("User data:", userData);
              setDocumentContent(userData);
            }
          });
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (documentContent && documentContent.items) {
      const isFav = documentContent.items.some((item) => item === movie.id);
      setIsFavorite(isFav);
      console.log("Is favorite:", isFav);
    }
  }, [movie, documentContent]);

  useEffect(() => {
    if (movie?.id.toLowerCase().includes("tv")) {
      setIsTvShow(true);
      handleSwitch();
    } else {
      setIsTvShow(false);
    }
  }, [movie]);

  useEffect(() => {
    if (selectedSeason && seasonsArray.length > 0) {
      const season = seasonsArray.find(
        ([number]) => parseInt(number) === parseInt(selectedSeason)
      );
      if (season) {
        setCurrentSeason(season);
        setSelectedEpisode(null);
        setCurrentEpisodeTitle("");
      }
    }
  }, [selectedSeason, seasonsArray]);

  const ads = [
    "https://dojo.mbd.one/app/coderdojo-@haufe.group/seria-3.2/activitate",
    "https://www.linkedin.com/in/david-chesa-824042296",
    "http://info.tm.edu.ro/",
  ];

  function getYouTubeVideoId(url) {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/|.*[?&]v=))([^&?]+)/
    );
    return match ? match[1] : null;
  }

  const handleSwitch = useCallback(() => {
    if (movie?.seasons) {
      const seasonsData = Object.entries(movie.seasons).sort(
        (a, b) => parseInt(a[0]) - parseInt(b[0])
      );
      setSeasonsArray(seasonsData);
      if (!selectedSeason && seasonsData.length > 0) {
        const firstSeason = parseInt(seasonsData[0][0]);
        setSelectedSeason(firstSeason);
        setCurrentSeason(seasonsData[0]);
      }
    }
  }, [movie?.seasons]);

  useEffect(() => {
    if (movie?.id?.toLowerCase().includes("tv")) {
      setIsTvShow(true);
      handleSwitch();
    } else {
      setIsTvShow(false);
    }
  }, [movie, handleSwitch]);

  useEffect(() => {
    let cleanup = false;

    const initYouTube = () => {
      if (!window.YT) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);

        return new Promise((resolve) => {
          window.onYouTubeIframeAPIReady = () => resolve();
        });
      }
      return Promise.resolve();
    };

    const setupPlayer = async () => {
      if (!canPlayVideo || cleanup) return;

      await initYouTube();

      let videoId;
      if (selevtedEpisode && currentSeason?.[1]?.episode_clips) {
        const clipUrl = currentSeason[1].episode_clips[selevtedEpisode - 1];
        videoId = getYouTubeVideoId(clipUrl);
      } else if (movie?.trailer_url) {
        videoId = getYouTubeVideoId(movie.trailer_url);
      }

      if (!videoId || !window.YT?.Player || cleanup) return;

      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        playerVars: {
          rel: 0,
          showinfo: 0,
          controls: 1,
          autoplay: 1,
        },
        events: {
          onReady: (event) => {
            if (!cleanup) {
              playerRef.current = event.target;
              setIsPlayerReady(true);
            }
          },
          onError: (error) => {
            if (!cleanup) {
              console.error("YouTube Player Error:", error);
              setIsPlayerReady(false);
            }
          },
        },
      });
    };

    setupPlayer();

    return () => {
      cleanup = true;
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [canPlayVideo, selevtedEpisode, currentSeason, movie?.trailer_url]);

  const handleAdClick = () => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - (ultimulClick.current || 0);

    if (adCounter.current > 0) {
      const randomAd = ads[Math.floor(Math.random() * ads.length)];
      window.open(randomAd, "_blank");
      adCounter.current -= 1;
    } else if (timeSinceLastClick >= 5000) {
      const randomAd = ads[Math.floor(Math.random() * ads.length)];
      window.open(randomAd, "_blank");
      ultimulClick.current = currentTime;
    } else {
      ultimulClick.current = currentTime;
      setCanPlayVideo(true);
      setShowAdButton(false);
    }
  };

  useEffect(() => {
    if (movie?.genre) {
      setGenre(movie.genre);
    }
  }, [movie]);

  const renderRecomandation = (currentGenre) => {
    const recommendations = Movies.filter(
      (m) =>
        m.id !== movie.id &&
        m.genre?.some((g) => g.toLowerCase() === currentGenre.toLowerCase())
    ).slice(0, 4);

    if (recommendations.length === 0) {
      return null;
    }

    const recommendationComponent = (
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">More {currentGenre} titles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendations.map((rec) => (
            <Link
              to={
                rec.id.includes("MOV")
                  ? `/movies/${rec.id}`
                  : `/tv-series/${rec.id}`
              }
              key={rec.id}
            >
              <div
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-all"
                role="button"
                tabIndex={0}
              >
                <img
                  src={rec.thumbnail}
                  alt={`${rec.title} thumbnail`}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <h3 className="text-xl font-semibold truncate">{rec.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400">★</span>
                  <span>{rec.imdb_score}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );

    return recommendationComponent;
  };

  const handleAddToFavorites = async (e) => {
    if (!user) return;

    try {
      const UserFavRef = doc(db, "favorites", user.uid);
      const docSnap = await getDoc(UserFavRef);
      if (docSnap.exists()) {
        if (!isFavorite) {
          const currentFavorites = docSnap.data().items || [];
          if (!currentFavorites.some((item) => item.id === movie.id)) {
            await updateDoc(UserFavRef, {
              items: [...currentFavorites, movie.id],
            });
            setIsFavorite(true);
          }
        } else {
          const currentFavorites = docSnap.data().items || [];
          const updatedFavorites = currentFavorites.filter(
            (item) => item !== movie.id
          );
          await updateDoc(UserFavRef, {
            items: updatedFavorites,
          });
          setIsFavorite(false);
        }
      } else {
        await setDoc(UserFavRef, {
          items: [movie.id],
        });
      }
      console.log("Succesfuly uodate the favorites");
    } catch {
      console.log("Error with the db");
    }
  };

  const handleEpisodeSelect = useCallback(
    async (episodeNumber, episodeTitle) => {
      setIsLoadingEpisode(true);
      setVideoError(null);

      try {
        setSelectedEpisode(episodeNumber);
        setCurrentEpisodeTitle(episodeTitle || "");

        if (currentSeason?.[1]?.episode_clips) {
          const videoUrl = currentSeason[1].episode_clips[episodeNumber - 1];
          if (videoUrl && playerRef.current?.loadVideoById) {
            const videoId = getYouTubeVideoId(videoUrl);
            if (videoId) {
              await playerRef.current.loadVideoById(videoId);
              setIsPlayerReady(true);
            }
          }
        }
      } catch (error) {
        setVideoError("Failed to load episode");
        console.error("Episode loading error:", error);
      } finally {
        setIsLoadingEpisode(false);
      }
    },
    [currentSeason]
  );

  const handleVideoSourceChange = (videoId) => {
    if (playerRef.current && videoId) {
      playerRef.current.loadVideoById(videoId);
    }
  };

  const handleSeasonSelect = (seasonNumber) => {
    setSelectedSeason(parseInt(seasonNumber));
    setSelectedEpisode(null);
    setCurrentEpisodeTitle("");
    setIsPlayerReady(false);
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
            {genre && (
              <div>
                <h2 className="text-lg font-semibold">Genres:</h2>
                {genre.map((element) => {
                  return (
                    <span
                      key={element}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full mr-2"
                    >
                      {element}
                    </span>
                  );
                })}
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <div>
                <span className="text-yellow-400">★</span>
                <span>{movie.imdb_score}</span>
              </div>
              {user && (
                <svg
                  className="w-6 h-6 text-red-500 transition-transform duration-200 hover:scale-110 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onClick={handleAddToFavorites}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              )}
            </div>
          </div>

          <div className="flex-grow space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              {movie.description}
            </p>
            {isTvShow && (
              <p className="text-gray-400">
                Currently showing:{" "}
                {currentSeason > 0
                  ? `Season ${selectedSeason}, Episode ${selevtedEpisode}${
                      currentEpisodeTitle ? ` - ${currentEpisodeTitle}` : ""
                    }`
                  : "Trailer"}
              </p>
            )}
            {movie.trailer_url ||
            (currentSeason && currentSeason[1].episode_clips) ? (
              canPlayVideo ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
                  <div id="youtube-player" className="relative w-full h-full">
                    {!isPlayerReady && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                        <div className="w-12 h-12 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-300">
                          {selevtedEpisode
                            ? "Loading episode..."
                            : "Loading trailer..."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-black flex flex-col items-center justify-center">
                  <p className="text-gray-300 mb-4">
                    {selevtedEpisode ? "Watch Episode" : "Watch Trailer"}
                  </p>
                  {showAdButton && (
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
                        <circle
                          cx="32"
                          cy="32"
                          r="30"
                          fill="#3B82F6"
                          stroke="#1D4ED8"
                          strokeWidth="2"
                        />
                        <path d="M26 22L42 32L26 42V22Z" fill="white" />
                      </svg>
                    </button>
                  )}
                </div>
              )
            ) : (
              <div className="w-full aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No video available</p>
              </div>
            )}
          </div>
        </div>

        {isTvShow && seasonsArray.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Seasons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {seasonsArray.map(([seasonNumber, seasonData]) => (
                <button
                  key={seasonNumber}
                  onClick={() => handleSeasonSelect(seasonNumber)}
                  className={`p-4 text-center rounded-lg font-semibold transition-all ${
                    parseInt(selectedSeason) === parseInt(seasonNumber)
                      ? "bg-yellow-500 text-black shadow-lg scale-105"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <p>Season {seasonNumber}</p>
                  <p className="text-sm text-gray-400">
                    {seasonData.episodes} episodes
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {isTvShow && currentSeason && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Episodes</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4">
              {Array.from({ length: parseInt(currentSeason[1].episodes) }, (_, i) => {
                const episodeNumber = i + 1;
                const episodeTitle = currentSeason[1].episode_titles?.[i];
                const hasClip = Boolean(currentSeason[1].episode_clips?.[i]);

                return (
                  <button
                    key={`episode-${episodeNumber}`}
                    onClick={() => handleEpisodeSelect(episodeNumber, episodeTitle)}
                    className={`p-4 text-center rounded-lg font-semibold transition-all ${
                      selevtedEpisode === episodeNumber
                        ? "bg-yellow-500 text-black shadow-lg scale-105"
                        : "bg-gray-800 hover:bg-gray-700"
                    } ${!hasClip ? "opacity-70" : ""}`}
                  >
                    <div className="font-medium">Episode {episodeNumber}</div>
                    {episodeTitle && (
                      <div className="text-sm text-gray-400 mt-1 truncate">
                        {episodeTitle}
                      </div>
                    )}
                    {!hasClip && (
                      <div className="text-xs text-yellow-400 mt-1">
                        Trailer only
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {genre && (
          <div className="space-y-8">
            {genre.map((element) => (
              <div key={element}>{renderRecomandation(element)}</div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
