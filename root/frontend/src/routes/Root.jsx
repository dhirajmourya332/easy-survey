import { useState, useEffect } from "react";
import Header from "../components/Root/Header";

export default function Root() {
  const [animeTextOpacity, setAnimeTextOpacity] = useState(100);
  const [animTextValue, setAnimTextValue] = useState("Create");
  useEffect(() => {
    const texts = ["Create", "Distribute", "Analyse"];
    let currentTextIndex = 0;
    setInterval(() => {
      setAnimeTextOpacity(0);
      setTimeout(() => {
        currentTextIndex++;
        setAnimTextValue(texts[currentTextIndex % 3]);
        setAnimeTextOpacity(100);
      }, 600);
    }, 3000);
  }, []);
  return (
    <div className="flex flex-col gap-3 h-screen">
      <Header />
      <div className="flex flex-col w-full items-center justify-center h-full gap-3 md:gap-5">
        <div className="flex w-full items-center justify-center flex-col gap-3 md:flex-row">
          <p
            className={`ml4 font-bold text-3xl md:text-5xl text-teal-800 transition duration-500`}
            style={{ opacity: animeTextOpacity }}
          >
            {animTextValue}
          </p>
          <p className="font-bold text-3xl md:text-4xl">Survey forms</p>
        </div>
        <div className="flex w-full justify-center">
          <p className="font-bold text-3xl md:text-4xl text-red-800">
            At one place
          </p>
        </div>
      </div>
    </div>
  );
}
