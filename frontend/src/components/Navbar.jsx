// src/components/Navbar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkStyle = ({ isActive }) => ({
    margin: '0 1rem',
    textDecoration: 'none',
    color: isActive ? '#1976d2' : '#555',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <nav
      style={{
        borderBottom: '1px solid #ccc',
        padding: '1rem',
        backgroundColor: '#f8f8f8',
      }}
    >
      <NavLink to="/recipes" style={linkStyle}>
        All Recipes
      </NavLink>
      <NavLink to="/recipes/new" style={linkStyle}>
        + New Recipe
      </NavLink>
      <NavLink to="/ingredients" style={linkStyle}>
        Ingredients
      </NavLink>
      <NavLink to="/ingredients/new" style={linkStyle}>
        + New Ingredient
      </NavLink>
    </nav>
  );
};

export default Navbar;
