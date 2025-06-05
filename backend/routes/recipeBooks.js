// routes/recipeBooks.js
const express = require('express');
const router = express.Router();
const {
  RecipeBook,
  Recipe,
  RecipeBookRecipe,
  User
} = require('../models');

// CREATE a new recipe book
// POST /api/recipe-books
// Body: { title, userId }
router.post('/', async (req, res) => {
  try {
    const { title, userId } = req.body;
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const newBook = await RecipeBook.create({ title, user_id: userId });
    return res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

// READ all recipe books (optionally filter by userId via query param)
// GET /api/recipe-books?userId=1
router.get('/', async (req, res) => {
  try {
    const whereClause = {};
    if (req.query.userId) {
      whereClause.user_id = req.query.userId;
    }
    const books = await RecipeBook.findAll({
      where: whereClause,
      include: [
        {
          model: Recipe,
          as: 'recipes',
          through: { attributes: [] }
        }
      ],
      order: [['id', 'ASC']]
    });
    return res.json(books);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch recipe books.' });
  }
});

// ADD a recipe to a book
// POST /api/recipe-books/:bookId/recipes
// Body: { recipeId }
router.post('/:bookId/recipes', async (req, res) => {
  try {
    const { recipeId } = req.body;
    const bookId = parseInt(req.params.bookId, 10);

    // Verify existence
    const book = await RecipeBook.findByPk(bookId);
    if (!book) return res.status(404).json({ error: 'RecipeBook not found.' });

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });

    // Create join entry (if not already present)
    const [link, created] = await RecipeBookRecipe.findOrCreate({
      where: { recipe_book_id: bookId, recipe_id: recipeId }
    });
    if (!created) return res.status(400).json({ error: 'Already in book.' });

    return res.status(201).json({ message: 'Recipe added to book.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// GET contents of a recipe book (all recipes within it)
// GET /api/recipe-books/:bookId
router.get('/:bookId', async (req, res) => {
  try {
    const book = await RecipeBook.findByPk(req.params.bookId, {
      include: [
        {
          model: Recipe,
          as: 'recipes',
          through: { attributes: [] }
        }
      ]
    });
    if (!book) return res.status(404).json({ error: 'RecipeBook not found.' });
    return res.json(book);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch recipe book.' });
  }
});

// REMOVE a recipe from a book
// DELETE /api/recipe-books/:bookId/recipes/:recipeId
router.delete('/:bookId/recipes/:recipeId', async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId, 10);
    const recipeId = parseInt(req.params.recipeId, 10);

    const deletedCount = await RecipeBookRecipe.destroy({
      where: { recipe_book_id: bookId, recipe_id: recipeId }
    });
    if (deletedCount === 0)
      return res.status(404).json({ error: 'Link not found (maybe it wasn’t in the book).' });
    return res.json({ message: 'Recipe removed from book.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to remove recipe from book.' });
  }
});

// DELETE a recipe book itself
// DELETE /api/recipe-books/:bookId
router.delete('/:bookId', async (req, res) => {
  try {
    const deletedCount = await RecipeBook.destroy({ where: { id: req.params.bookId } });
    if (deletedCount === 0) return res.status(404).json({ error: 'RecipeBook not found.' });
    return res.json({ message: 'RecipeBook deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete recipe book.' });
  }
});

module.exports = router;
