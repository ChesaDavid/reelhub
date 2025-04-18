import logo from './logo.svg';
import './App.css';
import { BrowserRouter , Route, Routes,  } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar  from './components/Navbar';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUsPage';
import Contact from './pages/ContactUs';
import VideoRevlame from './pages/reclameVideo';
import Login from './pages/Login';
import Movies from './pages/Movies';
import Error from './pages/404';
import ChosenMovie from './pages/ChosenMovie';
import Register from './pages/Register';
import TopIMBD from './pages/TopIMBD';
import Favorites from './pages/Favorites';
import Popup from "./components/Popup";
import Special from './pages/Special';
function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Popup/>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
        <Route path='/tv-series' element={<Movies/>}></Route>
        <Route path='/movies/:id' element={<ChosenMovie/>}></Route>
        <Route path='/tv-series/:id' element={<ChosenMovie/>}></Route>
        <Route path='/movies' element={<Movies/>}></Route>
        <Route path='/about' element={<AboutUs/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/top-imdb' element={<TopIMBD/>}></Route>
        <Route path='/favourites' element={<Favorites/>}></Route>
        <Route path='/movies/MOV036' element={<Special/>}></Route>
        <Route path='/tv-series/MOV036' element={<Special/>}></Route>
        <Route path='*' element={<Error/>}></Route>
        {/* temporary */}
        <Route path='/1220' element={<VideoRevlame/>}></Route>
      </Routes>
    <Footer/> 
    </BrowserRouter>
  );
}

export default App;
