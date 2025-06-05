// routes/favorites.js
const express = require('express');
const router = express.Router();
const { User, Recipe, UserFavoriteRecipe } = require('../models');

// ADD a recipe to user’s favorites
// POST /api/favorites
// Body: { userId, recipeId }
router.post('/', async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    // Verify both exist
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });

    const [link, created] = await UserFavoriteRecipe.findOrCreate({
      where: { user_id: userId, recipe_id: recipeId }
    });
    if (!created) return res.status(400).json({ error: 'Already in favorites.' });

    return res.status(201).json({ message: 'Recipe added to favorites.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// GET all favorites for a given user
// GET /api/favorites/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [
        {
          model: Recipe,
          as: 'favoriteRecipes',
          through: { attributes: [] }
        }
      ]
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json(user.favoriteRecipes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch favorites.' });
  }
});

// REMOVE a recipe from favorites
// DELETE /api/favorites
// Body: { userId, recipeId }
router.delete('/', async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const deletedCount = await UserFavoriteRecipe.destroy({
      where: { user_id: userId, recipe_id: recipeId }
    });
    if (deletedCount === 0)
      return res.status(404).json({ error: 'Favorite link not found.' });
    return res.json({ message: 'Recipe removed from favorites.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to remove favorite.' });
  }
});

module.exports = router;
