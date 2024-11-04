// client/src/App.js

import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import Hero from './Components/Hero';
import PokemonCarousel from './Components/PokemonCarousel';
import SearchBar from './Components/SearchBar';
import PokemonCard from './Components/PokemonCard';
import LoadingSpinner from './Components/LoadingSpinner';
import DarkModeToggle from './Components/DarkModeToggle';
import Suggestions from './Components/Suggestions';
import api from './api';

function App() {
  const [searchResult, setSearchResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (name) => {
      if (name.length < 2) { 
        setSuggestions([]);
        setError(null);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(`/api/pokemon/search/${name}`);
        if (response.status === 404) {
          setError('Nenhum Pokémon encontrado.');
          setSuggestions([]);
        } else if (response.status === 200) {
          const data = response.data;
          if (data.pokemon) {
            setSearchResult(data.pokemon);
            setSuggestions([]);
            setError(null);
          } else if (data.suggestions && data.suggestions.length > 0) {
            setSearchResult(null);
            setSuggestions(data.suggestions);
            setError(null); // Remova a mensagem de erro para não conflitar com os cartões
          } else {
            setSearchResult(null);
            setSuggestions([]);
            setError('Nenhum Pokémon encontrado e nenhuma sugestão disponível.');
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Nenhum Pokémon encontrado.');
          setSuggestions([]);
        } else {
          setError('Ocorreu um erro ao buscar os dados.');
          setSuggestions([]);
        }
        setSearchResult(null);
      } finally {
        setLoading(false);
      }
    }, 500), // 500ms debounce
    []
  );

  const handleSearch = async (name) => {
    if (name.trim() === '') {
      setSearchResult(null);
      setSuggestions([]);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/api/pokemon/search/${name}`);
      if (response.status === 404) {
        setError('Pokémon não encontrado.');
        setSuggestions([]);
      } else if (response.status === 200) {
        const data = response.data;
        if (data.pokemon) {
          setSearchResult(data.pokemon);
          setSuggestions([]);
          setError(null);
        } else if (data.suggestions && data.suggestions.length > 0) {
          setSearchResult(null);
          setSuggestions(data.suggestions);
          setError(null);
        } else {
          setSearchResult(null);
          setSuggestions([]);
          setError('Pokémon não encontrado e nenhuma sugestão disponível.');
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Pokémon não encontrado.');
      } else {
        setError('Ocorreu um erro ao buscar os dados.');
      }
      setSearchResult(null);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (name) => {
    setSearchResult(null);
    setSuggestions([]);
    setError(null);
    setLoading(true);
    handleSearch(name);
  };

  return (
    <div>
      <DarkModeToggle />
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <SearchBar onSearch={debouncedSearch} />
        {loading && <LoadingSpinner />}
        {suggestions.length > 0 && (
          <Suggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
        )}
        {error && suggestions.length === 0 && (
          <div className="text-center text-red-500 mb-4">
            {error}
          </div>
        )}
        {searchResult && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 capitalize">{searchResult.name}</h2>
            <PokemonCard pokemon={searchResult} />
          </div>
        )}
        <PokemonCarousel />
      </div>
    </div>
  );
}

export default App;
