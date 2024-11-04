// client/src/components/SearchBar.js

import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [pokemonName, setPokemonName] = useState('');

  const handleChange = (e) => {
    const name = e.target.value;
    setPokemonName(name);
    onSearch(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        onClick={() => onSearch(pokemonName)}
        className="px-4 py-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
