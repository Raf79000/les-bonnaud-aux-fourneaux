// src/components/RecipeDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await API.get(`/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div>
      <h2>{recipe.name}</h2>
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.name}
          style={{ maxWidth: '300px', marginBottom: '1rem' }}
        />
      )}
      <p>
        <strong>Description:</strong> {recipe.description}
      </p>
      <p>
        <strong>Preparation Time:</strong> {recipe.preparation_time} minutes
      </p>
      <p>
        <strong>Difficulty:</strong> {recipe.difficulty}
      </p>
      <p>
        <strong>Category:</strong> {recipe.category}
      </p>

      <h3>Ingredients</h3>
      {recipe.ingredients && recipe.ingredients.length > 0 ? (
        <ul>
          {recipe.ingredients.map((ing) => {
            const pivot = ing.recipe_ingredient; // because `through: { attributes: […] }`
            return (
              <li key={ing.id}>
                {ing.name} –{' '}
                {pivot.weight
                  ? `${pivot.weight} g`
                  : pivot.quantity
                  ? `${pivot.quantity} pcs`
                  : '—'}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No ingredients listed.</p>
      )}

      <p>
        <Link to="/recipes" style={{ textDecoration: 'none', color: '#1976d2' }}>
          ← Back to All Recipes
        </Link>
      </p>
    </div>
  );
};

export default RecipeDetail;
