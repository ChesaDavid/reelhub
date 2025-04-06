import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import video from "../assets/coderLive.mp4";
import thumnail from "../assets/coder.jpg";

export default function Video() {
  const numarApasari = useRef(2);
  const videoclip = useRef();
  const [afisareVideo, setAfisareVideo] = useState(false);
  const ultimulClick = useRef(null);

  const reclame = [
    "https://ro.betano.com/",
    "https://superbet.ro/",
    "http://info.tm.edu.ro/",
  ];

  const randomNumber = Math.floor(Math.random() * reclame.length);

  function clickButtonPlay() {
    if (numarApasari.current > 0) {
      window.open(reclame[randomNumber], "_blank");
      numarApasari.current--;
    } else {
      setAfisareVideo(true);
      ultimulClick.current = Date.now();
    }
  }

  function deschideReclama() {
    if (Date.now() - ultimulClick.current > 10) {
      window.open(reclame[randomNumber], "_blank");
      videoclip.current.pause(); 
    }else{
        ultimulClick.current = Date.now();
    }
  }

  return (
    <div className="min-h-screen bg-gray-700">
      {afisareVideo ? (
        <div onClick={deschideReclama}>
          <video
            src={video}
            ref={videoclip}
            controls
          />
        </div>
      ) : (
        <div onClick={clickButtonPlay}>
          <img src={thumnail} alt="Thumbnail" className="w-15" />
        </div>
      )}
    </div>
  );
}
