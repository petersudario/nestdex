import React from 'react';
import { useNavigate } from 'react-router-dom';

const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate();

  if (!pokemon || (!pokemon.name && !pokemon.imageUrl && !pokemon.attack)) {
    return (
      <div className="text-center text-red-500">
        Pokémon não encontrado.
      </div>
    );
  }

  const handleViewClick = () => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  return (
    <div className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform hover:scale-105">
      {pokemon.imageUrl && (
        <img
          className="w-full h-40 object-contain mb-4"
          src={pokemon.imageUrl}
          alt={pokemon.name || 'Pokémon'}
          loading="lazy"
        />
      )}
      <div className="text-gray-700 capitalize">
        {pokemon.name && <h2 className="text-lg font-bold">{pokemon.name}</h2>}
        {pokemon.attack && <p><strong>Ataque:</strong> {pokemon.attack}</p>}
      </div>
      <button
        onClick={handleViewClick}
        className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-300"
      >
        View
      </button>
    </div>
  );
};

export default PokemonCard;
