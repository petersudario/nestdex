import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

const SearchBar = ({ onSearch }) => {
  const [pokemonName, setPokemonName] = useState('');

  // Função de debounce que aguarda 2 segundos antes de executar a busca
  const debouncedSearch = useCallback(
    debounce((name) => {
      onSearch(name);
    }, 2000),
    [onSearch]
  );

  const handleChange = (e) => {
    const name = e.target.value;
    setPokemonName(name);
    debouncedSearch(name); // Chama a função de debounce
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(pokemonName); // Realiza a busca imediatamente ao pressionar "Enter"
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center mb-8">
      <input
        type="text"
        value={pokemonName}
        onChange={handleChange}
        placeholder="Search for a Pokémon..."
        className="w-1/2 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
