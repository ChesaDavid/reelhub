import React, { useState, useEffect } from "react";
import realhublog from "../assets/logo.png";
import { Link } from "react-router-dom";
function HomePage() {
    const welcome = [
        "Hello World!",
        "Welcome to ReelHub!",
        "Have fun!",
        "Be chill!",
        "Stay real!",
        "Keep it up!",
        "Let's make it real!",
        "Let's reel it!",
        "Let's go real!",
    ];

    const [currentMessage, setCurrentMessage] = useState(welcome[0]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % welcome.length);
            setCurrentMessage(welcome[(index + 1) % welcome.length]);
        }, 3000);

        return () => clearInterval(interval);
    }, [index]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8">
            <div className="min-h-screen justify-center flex flex-col items-center gap-12">
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
                    <img
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-indigo-500 shadow-lg"
                        src={realhublog}
                        alt="ReelHub Logo"
                    />
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white text-center sm:text-left mb-4">
                        {currentMessage}
                    </h1>
                </div>
            </div>
            <div className="flex flex-row justify-between gap-12 p-4 bg-gray-900 rounded-lg shadow-lg">

            <div className="flex flex-col items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 ease-in-out">
              <Link to="/movies" className="text-2xl font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300">MOVIES</Link>
              <p className="text-gray-500 text-center">Explore the latest and most popular movies across genres.</p>
            </div>


            <div className="flex flex-col items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 ease-in-out">
              <Link to="/tv-series" className="text-2xl font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300">TV SERIES</Link>
              <p className="text-gray-500 text-center">Discover trending TV series and the best shows to binge-watch.</p>
            </div>
          </div>
        </div>
    );
}

export default HomePage;
