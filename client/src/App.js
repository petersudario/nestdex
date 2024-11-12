// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import PokemonView from './Pages/PokemonView';
import Register from './Pages/Register';
import Login from './Pages/Login';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/pokemon/:id" element={<PokemonView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

const NotFound = () => (
  <div className="text-center mt-10">
    <h1 className="text-4xl font-bold">Página Não Encontrada</h1>
    <p className="mt-4">Desculpe, a página que você está procurando não existe.</p>
  </div>
);

export default App;
