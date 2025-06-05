// frontend/src/components/NewIngredientForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const NewIngredientForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await API.post('/ingredients', { name: name.trim() });
      // After successful creation, go back to the ingredient list:
      navigate('/ingredients');
    } catch (err) {
      console.error(err);
      // If server returns a validation error (e.g. duplicate name), show it
      setError(err.response?.data?.error || 'Failed to create ingredient');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Create New Ingredient</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Name:{' '}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </label>
        </div>

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
          {submitting ? 'Creating…' : 'Create Ingredient'}
        </button>
      </form>
    </div>
  );
};

export default NewIngredientForm;
