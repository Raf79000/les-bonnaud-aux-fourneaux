// src/components/NewRecipeForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const NewRecipeForm = () => {
  const navigate = useNavigate();

  // form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [category, setCategory] = useState('ALL');

  // ingredients list (for dropdowns)
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([
    // initially one row
    { ingredientId: '', weight: '', quantity: '' },
  ]);

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all ingredients so we can show them in a <select>
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const res = await API.get('/ingredients');
        setAllIngredients(res.data);
      } catch (err) {
        console.error(err);
        setError('Unable to load ingredients');
      }
    }
    fetchIngredients();
  }, []);

  // Handler to add a new “row” of (ingredient + weight/quantity)
  const addIngredientRow = () => {
    setSelectedIngredients((prev) => [
      ...prev,
      { ingredientId: '', weight: '', quantity: '' },
    ]);
  };

  // Handler to remove a row
  const removeIngredientRow = (idx) => {
    setSelectedIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update a single row’s fields
  const updateIngredientRow = (idx, field, value) => {
    const copy = [...selectedIngredients];
    copy[idx][field] = value;
    setSelectedIngredients(copy);
  };

  // On form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Build the “ingredients” payload by filtering out any empty rows
    const payloadIngredients = selectedIngredients
      .filter((row) => row.ingredientId) // only keep rows where ingredientId !== ''
      .map((row) => ({
        ingredientId: parseInt(row.ingredientId, 10),
        weight: row.weight ? parseFloat(row.weight) : null,
        quantity: row.quantity ? parseInt(row.quantity, 10) : null,
      }));

    const payload = {
      name,
      description,
      image_url: imageUrl,
      preparation_time: parseInt(prepTime, 10),
      difficulty,
      category,
      ingredients: payloadIngredients,
    };

    try {
      await API.post('/recipes', payload);
      // after creation, redirect back to /recipes
      navigate('/recipes');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 'Failed to create recipe. Check console.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Create New Recipe</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Recipe Name */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label>
            Name:{' '}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '300px' }}
            />
          </label>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label>
            Description:{' '}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '300px', height: '80px' }}
            />
          </label>
        </div>

        {/* Image URL */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label>
            Image URL:{' '}
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="http://example.com/recipe.jpg"
              style={{ width: '300px' }}
            />
          </label>
        </div>

        {/* Preparation Time */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label>
            Preparation Time (minutes):{' '}
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              required
              min="1"
              style={{ width: '80px' }}
            />
          </label>
        </div>

        {/* Difficulty */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label>
            Difficulty:{' '}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="EASY">EASY</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HARD">HARD</option>
            </select>
          </label>
        </div>

        {/* Category */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label>
            Category:{' '}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="STARTER">STARTER</option>
              <option value="MAIN_COURSE">MAIN COURSE</option>
              <option value="DESSERT">DESSERT</option>
              <option value="ALL">ALL</option>
            </select>
          </label>
        </div>

        {/* Ingredients Section */}
        <hr />
        <h3>Ingredients</h3>
        {selectedIngredients.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            {/* Ingredient Select */}
            <select
              value={row.ingredientId}
              onChange={(e) =>
                updateIngredientRow(idx, 'ingredientId', e.target.value)
              }
              required
            >
              <option value="">-- Select ingredient --</option>
              {allIngredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name}
                </option>
              ))}
            </select>

            {/* Weight */}
            <input
              type="number"
              placeholder="Weight (g)"
              value={row.weight}
              onChange={(e) =>
                updateIngredientRow(idx, 'weight', e.target.value)
              }
              style={{ width: '100px', marginLeft: '0.5rem' }}
            />

            {/* Quantity */}
            <input
              type="number"
              placeholder="Qty"
              value={row.quantity}
              onChange={(e) =>
                updateIngredientRow(idx, 'quantity', e.target.value)
              }
              style={{ width: '80px', marginLeft: '0.5rem' }}
            />

            {/* Remove Row Button */}
            <button
              type="button"
              onClick={() => removeIngredientRow(idx)}
              style={{
                marginLeft: '0.5rem',
                backgroundColor: '#e53935',
                color: 'white',
                border: 'none',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addIngredientRow}
          style={{
            marginBottom: '1rem',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          + Add Ingredient
        </button>

        <hr />
        <button
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: '#388e3c',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Creating…' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
};

export default NewRecipeForm;
