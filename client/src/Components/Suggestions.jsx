
import React from 'react';
import PokemonCard from './PokemonCard';

const Suggestions = ({ suggestions, onSuggestionClick }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-4">
      {suggestions.map((sugg, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(sugg.name)}
          className="focus:outline-none"
        >
          <PokemonCard pokemon={sugg} isSuggestion={true} />
        </button>
      ))}
    </div>
  );
};

export default Suggestions;
