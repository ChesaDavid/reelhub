import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { Search } from "lucide-react";
import { Link ,Navigate} from "react-router-dom";
import SearchItems from "./SearchItem";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../firebase";
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const searchInput = useRef(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const auth = getAuth(app);
  const [user,setUser] = useState(null);      
     
  useEffect(()=>{
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
  },[]);  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = () => {
    if (search.trim() === '') {
      setShowSearchResults(false);
      return;
    }

    switch(search.toLowerCase()) {
      case 'nimic':
        alert('Amazing, you found the easter egg! 🎉');
        break;
      case 'bacalaureat':
        window.open("https://hotnews.ro/wp-content/uploads/2024/08/Marcel-Ciolacu-la-Congresul-PSD-2024.jpg", '_blank');
        break;
      default:
        break;
    }

    localStorage.setItem('searched', JSON.stringify(search));
    setShowSearchResults(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      setUser(null);
      Navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="bg-gray-800 text-white flex items-center justify-between p-4 relative">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          {
            user ? (
              <Link to="/profile" className="flex items-center">
                <div className="ml-4 text-white font-semibold">
                  {user.displayName || user.email}
                </div>
              </Link>
            ) : (
              <div className="ml-4 text-white font-semibold">Un nimeni</div>
            )
          }
        </div>

        <div className="relative w-1/2 md:w-1/3">
          <input 
            type="text" 
            placeholder="Search for movies or tv series" 
            ref={searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 pl-10 bg-white text-black rounded-md focus:outline-none"
          />
          <button 
            onClick={handleSearch}
            className="absolute left-3 top-2 text-gray-400 hover:text-gray-600"
          >
            <Search size={20} />
          </button>
        </div>

        <div className="block md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        
        <ul className="hidden md:flex space-x-6 text-lg gap-3">
        <li>
            <Link
              to="/"
              className={
                `text-white p-3 hover:text-white hover:bg-black rounded`
              }
            >
              HOME
            </Link>
          </li>
          {
            user && (
              <li>
              <Link
                to="/favourites"
                className={
                  `text-white p-3 hover:text-white hover:bg-black rounded`
                }
              >
                FAVOITES
              </Link>
            </li>
            )
          }
         
          <li>
            <Link
              to="/movies"
              className="text-white p-3 hover:text-white hover:bg-black rounded"
            >
              MOVIES
            </Link>
          </li>
          <li>
            <Link
              to="/tv-series"
              className="text-white p-3 hover:text-white hover:bg-black rounded"
            >
              TV SERIES
            </Link>
          </li>
          <li>
            <Link
              to="/top-imdb"
              className="text-white p-3 hover:text-white hover:bg-black rounded"
            >
              TOP IMDB
            </Link>
          </li>
        </ul>
        {
          user ? (
           <button 
            onClick={handleLogOut}
            className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-black hover:text-white hover:bg-red-500 transition">
            LogOut
           </button>
          ):
          (
            <Link to="/login">
            <button className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-black hover:text-white transition">
              Login
            </button>
          </Link>
          )
        }
        

        <ul
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden absolute top-16 left-0 w-full bg-gray-800 text-white p-4 space-y-4 z-50`}
        >
          <li>
            <Link
              to="/"
              className="block text-white p-3 hover:text-white hover:bg-black rounded"
              onClick={toggleMenu}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              to="/movies"
              className="block text-white p-3 hover:text-white hover:bg-black rounded"
              onClick={toggleMenu}
            >
              MOVIES
            </Link>
            
          </li>
          <li>
            <Link
              to="/tv-series"
              className="block text-white p-3 hover:text-white hover:bg-black rounded"
              onClick={toggleMenu}
            >
              TV SERIES
            </Link>
          </li>
          <li>
            <Link
              to="/top-imdb"
              className="block text-white p-3 hover:text-white hover:bg-black rounded"
              onClick={toggleMenu}
            >
              TOP IMDB
            </Link>
          </li>
        </ul>
        {showSearchResults && (
        <SearchItems 
          searchQuery={search} 
          onClose={() => {
            setShowSearchResults(false);
            setSearch('');
            if (searchInput.current) {
              searchInput.current.focus();
            }
          }} 
        />
      )}
      </nav>
     
    </>
  );
}

export default Navbar;