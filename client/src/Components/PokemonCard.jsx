import React from 'react';

const PokemonCard = ({ pokemon, isSuggestion }) => {
  return (
    <div className={`flex items-center p-2 border rounded ${isSuggestion ? 'w-40' : 'max-w-sm'} bg-white transform hover:scale-105 transition duration-300`}>
      <img
        className="w-12 h-12 object-contain mr-4"
        src={pokemon.imageUrl}
        alt={pokemon.name}
        loading="lazy"
      />
      <div className="text-gray-700 capitalize">
        {pokemon.name}
        {!isSuggestion && (
          <>
            <p><strong>Attack:</strong> {pokemon.attack}</p>
            <p><strong>Type:</strong> {pokemon.type}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
