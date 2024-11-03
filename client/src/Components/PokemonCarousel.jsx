// src/components/PokemonCarousel.js
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import PokemonCard from './PokemonCard';

const PokemonCarousel = () => {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('/api/pokemon?limit=20&offset=0');
        const data = await response.json();
        setPokemonList(data);
      } catch (error) {
        console.error('Error fetching Pokémon list:', error);
      }
    };

    fetchPokemonList();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pokémon Carousel</h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {pokemonList.map((pokemon) => (
          <SwiperSlide key={pokemon.id}>
            <PokemonCard pokemon={pokemon} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PokemonCarousel;
