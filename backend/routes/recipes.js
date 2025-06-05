// routes/recipes.js
const express = require('express');
const router = express.Router();
const {
  Recipe,
  Ingredient,
  RecipeIngredient
} = require('../models');

// Helper: parse ingredient input array [{ ingredientId, weight, quantity }, ...]
function parseIngredientsArray(bodyArray) {
  return bodyArray.map((item) => ({
    ingredient_id: item.ingredientId,
    weight: item.weight || null,
    quantity: item.quantity || null
  }));
}

// CREATE a new recipe (with optional ingredients array)
// POST /api/recipes
// Body example:
// {
//   name: 'Spaghetti Bolognese',
//   description: 'A classic Italian dish...',
//   image_url: 'http://...',
//   preparation_time: 45,
//   difficulty: 'MEDIUM',
//   category: 'MAIN_COURSE',
//   ingredients: [
//     { ingredientId: 1, weight: 200, quantity: null },
//     { ingredientId: 5, weight: null, quantity: 2 }
//   ]
// }
router.post('/', async (req, res) => {
  const t = await Recipe.sequelize.transaction();
  try {
    const {
      name,
      description,
      image_url,
      preparation_time,
      difficulty,
      category,
      ingredients
    } = req.body;

    // 1) Create recipe
    const newRecipe = await Recipe.create(
      {
        name,
        description,
        image_url,
        preparation_time,
        difficulty,
        category
      },
      { transaction: t }
    );

    // 2) If there are ingredients provided, bulk‐create entries in recipe_ingredient
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      const toCreate = parseIngredientsArray(ingredients).map((ri) => ({
        recipe_id: newRecipe.id,
        ingredient_id: ri.ingredient_id,
        weight: ri.weight,
        quantity: ri.quantity
      }));
      await RecipeIngredient.bulkCreate(toCreate, { transaction: t });
    }

    await t.commit();
    // Return the newly created recipe (optionally, fetch with included ingredients):
    const createdWithIngredients = await Recipe.findByPk(newRecipe.id, {
      include: [
        {
          model: Ingredient,
          as: 'ingredients',
          through: { attributes: ['weight', 'quantity'] }
        }
      ]
    });
    return res.status(201).json(createdWithIngredients);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

// READ all recipes (with optional pagination)
// GET /api/recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        {
          model: Ingredient,
          as: 'ingredients',
          through: { attributes: ['weight', 'quantity'] }
        }
      ],
      order: [['id', 'ASC']]
    });
    return res.json(recipes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
});

// READ one recipe by ID (include ingredients)
// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: Ingredient,
          as: 'ingredients',
          through: { attributes: ['weight', 'quantity'] }
        }
      ]
    });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });
    return res.json(recipe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch recipe.' });
  }
});

// UPDATE a recipe (and optionally its ingredients)
// PUT /api/recipes/:id
// Body can include recipe fields and/or an `ingredients` array
router.put('/:id', async (req, res) => {
  const t = await Recipe.sequelize.transaction();
  try {
    const {
      name,
      description,
      image_url,
      preparation_time,
      difficulty,
      category,
      ingredients
    } = req.body;

    // 1) Update main recipe fields
    const [updatedCount] = await Recipe.update(
      { name, description, image_url, preparation_time, difficulty, category },
      { where: { id: req.params.id }, transaction: t }
    );
    if (updatedCount === 0) {
      await t.rollback();
      return res.status(404).json({ error: 'Recipe not found or no changes.' });
    }

    // 2) If client sent a new `ingredients` array, remove old links & insert new ones
    if (Array.isArray(ingredients)) {
      // a) Delete existing entries for this recipe
      await RecipeIngredient.destroy({
        where: { recipe_id: req.params.id },
        transaction: t
      });

      // b) Bulk create the new ones
      const toCreate = parseIngredientsArray(ingredients).map((ri) => ({
        recipe_id: parseInt(req.params.id, 10),
        ingredient_id: ri.ingredient_id,
        weight: ri.weight,
        quantity: ri.quantity
      }));
      if (toCreate.length > 0) {
        await RecipeIngredient.bulkCreate(toCreate, { transaction: t });
      }
    }

    await t.commit();
    // Return updated recipe with ingredients
    const updatedRecipe = await Recipe.findByPk(req.params.id, {
      include: [
        {
          model: Ingredient,
          as: 'ingredients',
          through: { attributes: ['weight', 'quantity'] }
        }
      ]
    });
    return res.json(updatedRecipe);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

// DELETE a recipe (cascade will remove recipe_ingredient entries)
// DELETE /api/recipes/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Recipe.destroy({ where: { id: req.params.id } });
    if (deletedCount === 0) return res.status(404).json({ error: 'Recipe not found.' });
    return res.json({ message: 'Recipe deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete recipe.' });
  }
});

module.exports = router;
