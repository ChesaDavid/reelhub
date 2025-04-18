import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Movies from './MoviesAndSeriesList';
import { app, db } from "../firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function Special() {
  const id = 'MOV036';
  const videoRef = useRef(null);
  const movie = Movies.find((movie) => movie.id === id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [documentContent, setDocumentContent] = useState(null);
  const [adTimer, setAdTimer] = useState(null);
  const adIntervalRef = useRef(null);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const [showAdButton, setShowAdButton] = useState(true);
  const adCounter = useRef(2);
  const ultimulClick = useRef(null);

  const ads = [
    "https://dojo.mbd.one/app/coderdojo-@haufe.group/seria-3.2/activitate",
    "https://www.linkedin.com/in/david-chesa-824042296",
    "http://info.tm.edu.ro/",
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const timeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };

    const loadedMetadata = () => {
      setDuration(video.duration);
      video.volume = volume;
    };

    video.addEventListener('timeupdate', timeUpdate);
    video.addEventListener('loadedmetadata', loadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', timeUpdate);
      video.removeEventListener('loadedmetadata', loadedMetadata);
    };
  }, [movie, volume]);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      if (adIntervalRef.current) {
        clearInterval(adIntervalRef.current);
      }

      adIntervalRef.current = setInterval(() => {
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        window.open(randomAd, "_blank");
      }, 10000);

      setAdTimer(adIntervalRef.current);
    }

    return () => {
      if (adIntervalRef.current) {
        clearInterval(adIntervalRef.current);
        adIntervalRef.current = null;
      }
    };
  }, [isPlaying, ads]);

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
    const auth = getAuth(app);
    if (!user) {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
          const docRef = doc(db, "favorites", user.uid);
          getDoc(docRef).then((doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              setDocumentContent(userData);
              const isFav = userData.items?.some((item) => item === id);
              setIsFavorite(isFav);
            }
          });
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, [user, id]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleProgress = (e) => {
    const time = (e.target.value / 100) * duration;
    videoRef.current.currentTime = time;
    setProgress(e.target.value);
  };

  const handleVolume = (e) => {
    const value = e.target.value;
    videoRef.current.volume = value;
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      videoRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const skipTime = (seconds) => {
    videoRef.current.currentTime += seconds;
  };

  const handleAddToFavorites = async () => {
    if (!user) return;

    try {
      const userFavRef = doc(db, "favorites", user.uid);
      const docSnap = await getDoc(userFavRef);

      if (docSnap.exists()) {
        if (!isFavorite) {
          const currentFavorites = docSnap.data().items || [];
          if (!currentFavorites.includes(id)) {
            await updateDoc(userFavRef, {
              items: [...currentFavorites, id],
            });
            setIsFavorite(true);
          }
        } else {
          const currentFavorites = docSnap.data().items || [];
          const updatedFavorites = currentFavorites.filter(
            (item) => item !== id
          );
          await updateDoc(userFavRef, {
            items: updatedFavorites,
          });
          setIsFavorite(false);
        }
      } else {
        await setDoc(userFavRef, {
          items: [id],
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (!movie) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <p>Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">{movie.title}</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={movie.thumbnail}
              alt={`${movie.title} poster`}
              className="w-64 h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="flex items-center gap-2 mt-2">
              <div>
                <span className="text-yellow-400">★</span>
                <span>{movie.imdb_score}</span>
              </div>
              {user && (
                <button
                  onClick={handleAddToFavorites}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="red"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex-grow space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              {movie.description}
            </p>

            <div 
              ref={containerRef}
              className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
            >
              {canPlayVideo ? (
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  onClick={togglePlay}
                  poster={movie.thumbnail}
                  src={movie.trailer_url}
                />
              ) : (
                <div 
                  className="w-full aspect-video flex flex-col items-center justify-center relative"
                  style={{
                    backgroundImage: `url(${movie.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <p className="text-gray-300 mb-4">Watch Video</p>
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
                </div>
              )}

              {canPlayVideo && (
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="relative">
                    <input
                      type="range"
                      className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleProgress}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4">
                      <button onClick={togglePlay} className="text-white hover:text-yellow-400">
                        {isPlaying ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </button>

                      <button onClick={() => skipTime(-10)} className="text-white hover:text-yellow-400">
                        -10s
                      </button>
                      <button onClick={() => skipTime(10)} className="text-white hover:text-yellow-400">
                        +10s
                      </button>

                      <div className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button onClick={toggleMute} className="text-white hover:text-yellow-400">
                          {isMuted || volume === 0 ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H3v6h4l5 5v-6.59l4.18 4.18c-.65.49-1.38.88-2.18 1.11v2.06a8.986 8.986 0 003.76-1.85l1.89 1.89a.996.996 0 101.41-1.41L5.05 3.63a.996.996 0 00-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zm-7-8l-1.88 1.88L12 7.76zm4.5 8c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z"/>
                            </svg>
                          ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4-.91 7-4.49 7-8.77 0-4.28-3-7.86-7-8.77z"/>
                            </svg>
                          )}
                        </button>
                        <input
                          type="range"
                          className="w-20 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolume}
                        />
                      </div>

                      <button onClick={toggleFullscreen} className="text-white hover:text-yellow-400">
                        {isFullscreen ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}