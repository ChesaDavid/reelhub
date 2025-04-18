import { getDoc, doc ,setDoc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { app, db } from "../firebase";
import { getAuth } from "firebase/auth";
import Movies from "./MoviesAndSeriesList";
import { Link } from "react-router-dom";
export default function Favorites() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritesList, setFavoritesList] = useState([]);
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "favorites", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const favoritesIds = docSnap.data().items || [];
          const favoriteMovies = Movies.filter((movie) =>
            favoritesIds.includes(movie.id)
          );
          setFavoritesList(favoriteMovies);
        } else {
          setFavoritesList([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Error loading favorites");
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleDelete = async (movieId) => {
    if(!user) return;
    try{
        const docRef = doc(db, "favorites", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const favoritesIds = docSnap.data().items || [];
            const updatedFavorites = favoritesIds.filter((id) => id !== movieId);
            await setDoc(docRef, { items: updatedFavorites });
            setFavoritesList((prev) => prev.filter((movie) => movie.id !== movieId));
            console.log("Favorite deleted successfully!");
        }else{
          console.error("No favorites found for this user.");
        }
    }catch (error) {
        console.error("Error deleting favorite:", error);
        setError("Error deleting favorite");
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex text-white text-2xl justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex text-white text-2xl justify-center items-center">
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Favorites</h1>
        {!user ? (
          <div className="text-white text-xl text-center">
            Please login to see your favorites
          </div>
        ) : favoritesList.length === 0 ? (
          <div className="text-white text-xl text-center">
            No favorites added yet
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favoritesList.map((movie) => (
              
                <div
                  key={movie.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:translate transition-shadow"
                >
                  <Link
                    to={
                      movie?.id.toLowerCase().includes("tv")
                        ? `/tv-series/${movie.id}`
                        : `/movies/${movie.id}`
                    }
                    key={movie.id}
                  >
                    <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  </Link>
                  <div className="p-4">
                    <h2 className="text-white font-semibold truncate">
                      {movie.title}
                    </h2>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <span className="text-yellow-400">★</span>
                        <span className="text-white ml-1">
                          {movie.imdb_score}
                        </span>
                      </div>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={()=> handleDelete(movie.id)}
                        >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
