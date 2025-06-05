// src/components/RecipeList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await API.get('/recipes');
        setRecipes(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (recipes.length === 0) return <p>No recipes found.</p>;

  return (
    <div>
      {console.log('⧡翠 baseURL is:', API.defaults.baseURL)}
      <h2>All Recipes</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {recipes.map((r) => (
          <li
            key={r.id}
            style={{
              marginBottom: '1.5rem',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <h3>
              <Link to={`/recipes/${r.id}`}>{r.name}</Link>
            </h3>
            {r.image_url && (
              <img
                src={r.image_url}
                alt={r.name}
                style={{ maxWidth: '200px', display: 'block', margin: '0.5rem 0' }}
              />
            )}
            <p>
              <strong>Prep Time:</strong> {r.preparation_time} min &nbsp;|&nbsp;
              <strong>Difficulty:</strong> {r.difficulty}
            </p>
            <p>
              <strong>Category:</strong> {r.category}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
