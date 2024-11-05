import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../Components/SearchBar';
import PokemonCard from '../Components/PokemonCard';
import PokemonCarousel from '../Components/PokemonCarousel';
import Modal from '../Components/Modal';

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pokemonFormData, setPokemonFormData] = useState({
    name: '',
    imageUrl: '',
    attack: '',
  });
  const [refreshCarousel, setRefreshCarousel] = useState(false);

  const handleSearch = async (name) => {
    if (name.trim() === '') {
      setSearchResults([]);
      setError('');
      return;
    }

    try {
      const response = await axios.get(`/api/pokemon/${name}`);
      setSearchResults([response.data.pokemon]);
      setError('');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(`Pokémon ${name} não encontrado.`);
        setPokemonFormData({ ...pokemonFormData, name });
        setSearchResults([]);
      } else {
        setError('Erro ao buscar Pokémon.');
        setSearchResults([]);
      }
    }
  };

  const handleCreatePokemon = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/pokemon', pokemonFormData);
      alert(response.data.message);
      setSearchResults([response.data.pokemon]);
      setError('');
      setPokemonFormData({ name: '', imageUrl: '', attack: '' });
      setRefreshCarousel(true);
    } catch (error) {
      setError('Erro ao criar Pokémon.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPokemonFormData({ ...pokemonFormData, [name]: value });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setPokemonFormData({ name: '', imageUrl: '', attack: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600">NestDEX</h1>
        <button
          onClick={openModal}
          className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
        >
          Criar Pokémon
        </button>
      </header>

      <SearchBar onSearch={handleSearch} />

      {error && (
        <div className="text-center text-red-500 mt-4">
          {error}
        </div>
      )}

      <div className="mt-8">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {searchResults.map((pokemon, index) => (
              <PokemonCard key={index} pokemon={pokemon} />
            ))}
          </div>
        ) : (
          <PokemonCarousel
            refresh={refreshCarousel}
            onRefreshComplete={() => setRefreshCarousel(false)}
            errorMessage={error}
          />
        )}
      </div>

      {/* Modal com Formulário para Criar Pokémon */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Criar Novo Pokémon">
        <form onSubmit={handleCreatePokemon}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={pokemonFormData.name}
              onChange={handleInputChange}
              placeholder="Nome do Pokémon"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-gray-700 font-semibold mb-2">
              URL da Imagem
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={pokemonFormData.imageUrl}
              onChange={handleInputChange}
              placeholder="URL da Imagem do Pokémon"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="attack" className="block text-gray-700 font-semibold mb-2">
              Ataque
            </label>
            <input
              type="text"
              id="attack"
              name="attack"
              value={pokemonFormData.attack}
              onChange={handleInputChange}
              placeholder="Ataque do Pokémon"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-300"
            >
              Criar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
