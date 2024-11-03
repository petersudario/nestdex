// src/components/Hero.js
import React from 'react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to NestDEX</h1>
        <p className="text-xl mb-6">
          Your ultimate Pokémon database powered by NestJS and React
        </p>
        <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default Hero;
