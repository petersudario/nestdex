import React from 'react';

const PokemonCard = ({ pokemon }) => {
  // Verifica se o objeto `pokemon` existe e se pelo menos uma das propriedades é válida
  if (!pokemon || (!pokemon.name && !pokemon.imageUrl && !pokemon.attack)) {
    return (
      <div className="text-center text-red-500">
        Pokémon não encontrado.
      </div>
    );
  }

  return (
    <div className="flex items-center p-4 border rounded bg-white shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
      {pokemon.imageUrl && (
        <img
          className="w-24 h-24 object-contain mr-4"
          src={pokemon.imageUrl}
          alt={pokemon.name || 'Pokémon'}
          loading="lazy"
        />
      )}
      <div className="text-gray-700 capitalize">
        {pokemon.name ? <h2 className="text-lg font-bold">{pokemon.name}</h2> : null}
        {pokemon.attack ? <p><strong>Ataque:</strong> {pokemon.attack}</p> : null}
        {/* Adicione outros dados conforme necessário */}
      </div>
    </div>
  );
};

export default PokemonCard;
