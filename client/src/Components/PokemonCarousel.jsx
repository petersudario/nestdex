import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import PokemonCard from './PokemonCard';
import axios from 'axios';

const PokemonCarousel = ({ refresh, onRefreshComplete, errorMessage }) => {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('/api/pokemon');
        setPokemonList(response.data);
      } catch (error) {
        console.error('Erro ao carregar a lista de Pokémons:', error);
      }
    };

    fetchPokemonList();
  }, []);

  useEffect(() => {
    if (refresh) {
      const fetchUpdatedPokemonList = async () => {
        try {
          const response = await axios.get('/api/pokemon');
          setPokemonList(response.data);
          onRefreshComplete(); 
        } catch (error) {
          console.error('Erro ao recarregar a lista de Pokémons:', error);
        }
      };

      fetchUpdatedPokemonList();
    }
  }, [refresh, onRefreshComplete]);

  if (errorMessage) {
    return <div className="text-center text-red-500">{errorMessage}</div>;
  }

  return (
    <div>
      <Swiper spaceBetween={20} slidesPerView={6} loop={true}>
        {pokemonList.map((pokemon, index) => (
          <SwiperSlide key={index}>
            <PokemonCard pokemon={pokemon} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PokemonCarousel;
