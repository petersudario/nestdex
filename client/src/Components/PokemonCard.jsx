import React from 'react';

const PokemonCard = ({ pokemon }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img
        className="w-full h-48 object-contain bg-gray-100"
        src={pokemon.imageUrl}
        alt={pokemon.name}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 capitalize">{pokemon.name}</div>
        <p className="text-gray-700 text-base">
          Attack: {pokemon.attack}
        </p>
      </div>
    </div>
  );
};

export default PokemonCard;
