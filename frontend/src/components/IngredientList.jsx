// frontend/src/components/IngredientList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIngredients() {
      try {
        const res = await API.get('/ingredients');
        setIngredients(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load ingredients');
      } finally {
        setLoading(false);
      }
    }
    fetchIngredients();
  }, []);

  if (loading) return <p>Loading ingredients…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (ingredients.length === 0) return <p>No ingredients found.</p>;

  return (
    <div>
      <h2>All Ingredients</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {ingredients.map((ing) => (
          <li
            key={ing.id}
            style={{
              marginBottom: '0.75rem',
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{ing.name}</span>
            {/* Optional: link to edit/delete later */}
            <Link to={`/ingredients/${ing.id}`} style={{ fontSize: '0.9rem' }}>
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientList;
