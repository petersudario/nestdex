import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    axios.get('/api/pokemon')
      .then(response => setPokemon(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Pokemon List</h1>
      <ul>
        {pokemon.map(p => (
          <div>
            <li key={p.id}>{p.name}</li>
            <div>
              <img alt='' src={p.imageUrl}></img>
            </div>
          </div>

        ))}
      </ul>
    </div>
  );
}

export default App;
