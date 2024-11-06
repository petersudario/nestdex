import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PokemonView = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Função para buscar os detalhes do Pokémon pelo ID
    const fetchPokemonDetail = async () => {
      try {
        const response = await axios.get(`/api/pokemon/${id}`);
        setPokemon(response.data);
      } catch (error) {
        setError('Erro ao buscar os detalhes do Pokémon.');
      }
    };

    fetchPokemonDetail();
  }, [id]);

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  if (!pokemon) {
    return <div className="text-center text-gray-500 mt-4">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white border rounded-lg shadow-lg p-6 max-w-md mx-auto">
        {pokemon.imageUrl && (
          <img
            className="w-full h-60 object-contain mb-4"
            src={pokemon.imageUrl}
            alt={pokemon.name || 'Pokémon'}
            loading="lazy"
          />
        )}
        <div className="text-gray-700 capitalize">
          {pokemon.name && <h2 className="text-2xl font-bold mb-2">{pokemon.name}</h2>}
          {pokemon.attack && <p><strong>Ataque:</strong> {pokemon.attack}</p>}
          {/* Adicione mais detalhes do Pokémon, se houver */}
        </div>
      </div>
    </div>
  );
};

export default PokemonView;
