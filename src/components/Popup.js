import React, { useEffect, useRef, useState } from 'react';
import razvan from '../assets/razvan.jpg';
import soparla from '../assets/soparla.jpg';
import feciorDeMaritat from '../assets/feciorDeMaritat.jpg';
import baiatPericulos from '../assets/baiatPericulos.jpg';

export default function Popup() {
    const [currentPopup, setCurrentPopup] = useState(null);
    const timeoutRef = useRef(null);
    const POPUP_DELAY = 5000; 

    const popups = [
        { 
            content: "Razvan e la 3m de tine.", 
            img: razvan 
        },
        { 
            content: "Git push!", 
            img: soparla
        },
        {
            content: "Fecior de maritat",
            img: feciorDeMaritat
        },{
            content: "Baiat periculos",
            img: baiatPericulos
        }
    ];

    const showRandomPopup = () => {
        const randomIndex = Math.floor(Math.random() * popups.length);
        setCurrentPopup(popups[randomIndex]);
    };

    useEffect(() => {
        showRandomPopup();
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleClose = () => {
        setCurrentPopup(null);
        timeoutRef.current = setTimeout(() => {
            showRandomPopup();
        }, POPUP_DELAY);
    };

    if (!currentPopup) return null;

    return (
        (currentPopup &&
          (
            <div className="fixed top-20 right-20 z-50 w-40 h-40">
            <div 
                className="m-2 p-4 bg-gray-800 rounded-lg shadow-xl flex flex-col gap-4"
                style={{ minWidth: '200px', minHeight: '120px' }}
            >
                <p className="text-white">{currentPopup.content}</p>
                {currentPopup.img && (
                    <img 
                        src={currentPopup.img} 
                        alt="Popup content"
                        className="w-full h-auto rounded-lg" 
                        loading="lazy"
                    />
                )}
                <button 
                    onClick={handleClose}
                    className="mt-auto px-4 py-2 bg-red-500 text-white rounded-lg 
                             hover:bg-red-600 transition-colors duration-200"
                >
                    Close
                </button>
            </div>
        </div>
          )  
        )
        
    );
}