// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import NewRecipeForm from './components/NewRecipeForm';
import IngredientList from './components/IngredientList';
import NewIngredientForm from './components/NewIngredientForm';

function App() {
  return (
    <div>
      <Navbar />

      <main style={{ padding: '1rem' }}>
        <Routes>
          {/* Redirect “/” to /recipes */}
          <Route path="/" element={<Navigate to="/recipes" />} />

          {/* List all recipes */}
          <Route path="/recipes" element={<RecipeList />} />

          {/* New recipe form */}
          <Route path="/recipes/new" element={<NewRecipeForm />} />

          {/* Recipe detail page */}
          <Route path="/recipes/:id" element={<RecipeDetail />} />

          {/* Fallback for unknown URLs */}
          <Route path="*" element={<h2>404 – Not Found</h2>} />
          
          {/* List all ingredients */}
          <Route path="/ingredients" element={<IngredientList />} />

          {/* New ingredient form */}
          <Route path="/ingredients/new" element={<NewIngredientForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
