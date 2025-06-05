// models/index.js
const sequelize = require('../config/database');

const User = require('./user');
const Ingredient = require('./ingredient');
const Recipe = require('./recipe');
const RecipeIngredient = require('./recipeIngredient');
const RecipeBook = require('./recipeBook');
const RecipeBookRecipe = require('./recipeBookRecipe');
const UserFavoriteRecipe = require('./userFavoriteRecipe');

// 1) USER ↔ RECIPE_BOOK (1:M)
User.hasMany(RecipeBook, {
  foreignKey: 'user_id',
  as: 'recipeBooks'
});
RecipeBook.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'owner'
});

// 2) RECIPE_BOOK ↔ RECIPE (M:N) via RecipeBookRecipe
RecipeBook.belongsToMany(Recipe, {
  through: RecipeBookRecipe,
  foreignKey: 'recipe_book_id',
  otherKey: 'recipe_id',
  as: 'recipes'
});
Recipe.belongsToMany(RecipeBook, {
  through: RecipeBookRecipe,
  foreignKey: 'recipe_id',
  otherKey: 'recipe_book_id',
  as: 'inRecipeBooks'
});

// 3) RECIPE ↔ INGREDIENT (M:N) via RecipeIngredient
Recipe.belongsToMany(Ingredient, {
  through: RecipeIngredient,
  foreignKey: 'recipe_id',
  otherKey: 'ingredient_id',
  as: 'ingredients'
});
Ingredient.belongsToMany(Recipe, {
  through: RecipeIngredient,
  foreignKey: 'ingredient_id',
  otherKey: 'recipe_id',
  as: 'usedInRecipes'
});

// 4) USER ↔ RECIPE (M:N) via UserFavoriteRecipe  (favorites)
User.belongsToMany(Recipe, {
  through: UserFavoriteRecipe,
  foreignKey: 'user_id',
  otherKey: 'recipe_id',
  as: 'favoriteRecipes'
});
Recipe.belongsToMany(User, {
  through: UserFavoriteRecipe,
  foreignKey: 'recipe_id',
  otherKey: 'user_id',
  as: 'favoredBy'
});

// 5) (Optionally) Expose the join‐tables for direct usage (e.g. to query weight/quantity)
Recipe.hasMany(RecipeIngredient, {
  foreignKey: 'recipe_id',
  as: 'recipeIngredients'
});
RecipeIngredient.belongsTo(Recipe, {
  foreignKey: 'recipe_id',
  as: 'recipe'
});
Ingredient.hasMany(RecipeIngredient, {
  foreignKey: 'ingredient_id',
  as: 'recipeIngredients'
});
RecipeIngredient.belongsTo(Ingredient, {
  foreignKey: 'ingredient_id',
  as: 'ingredient'
});

module.exports = {
  sequelize,
  User,
  Ingredient,
  Recipe,
  RecipeIngredient,
  RecipeBook,
  RecipeBookRecipe,
  UserFavoriteRecipe
};
