import React from "react";

const HeroText = () => {
  return (
    <div className="w-full text-center pt-24 px-4">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white font-[cursive] drop-shadow-md italic">
        Explore the World with  
        <span className="text-pink-400 ml-2">MakeMyPlane</span>
      </h1>
      <p className="mt-4 text-lg sm:text-xl text-white/80 italic">
        Book Hotels, Flights, Trains, and Cabs—all in one place.
      </p>
    </div>
  );
};

export default HeroText;
