import React, { useState } from 'react';
import Hero from './Components/Hero';
import SearchBar from './Components/SearchBar';
import PokemonCard from './Components/PokemonCard';
import PokemonCarousel from './Components/PokemonCarousel';


function App() {
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = async (name) => {
    try {
      const response = await fetch(`/api/pokemon/${name}`);
      if (!response.ok) {
        throw new Error('Pokémon not found');
      }
      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      alert(error.message);
      setSearchResult(null);
    }
  };

  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        {searchResult && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Search Result</h2>
            <PokemonCard pokemon={searchResult} />
          </div>
        )}
        <PokemonCarousel />
      </div>
    </div>
  );
}

export default App;
