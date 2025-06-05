// routes/ingredients.js
const express = require('express');
const router = express.Router();
const { Ingredient } = require('../models');

// CREATE an ingredient
// POST /api/ingredients
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newIngredient = await Ingredient.create({ name });
    return res.status(201).json(newIngredient);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

// READ all ingredients
// GET /api/ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll({ order: [['name', 'ASC']] });
    return res.json(ingredients);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch ingredients.' });
  }
});

// READ one ingredient
// GET /api/ingredients/:id
router.get('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) return res.status(404).json({ error: 'Ingredient not found.' });
    return res.json(ingredient);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch ingredient.' });
  }
});

// UPDATE an ingredient
// PUT /api/ingredients/:id
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const [updatedCount] = await Ingredient.update({ name }, { where: { id: req.params.id } });
    if (updatedCount === 0)
      return res.status(404).json({ error: 'Ingredient not found or nothing changed.' });
    const updatedIngredient = await Ingredient.findByPk(req.params.id);
    return res.json(updatedIngredient);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

// DELETE an ingredient
// DELETE /api/ingredients/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Ingredient.destroy({ where: { id: req.params.id } });
    if (deletedCount === 0) return res.status(404).json({ error: 'Ingredient not found.' });
    return res.json({ message: 'Ingredient deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete ingredient.' });
  }
});

module.exports = router;
