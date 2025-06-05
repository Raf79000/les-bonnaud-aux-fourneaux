// models/recipeBookRecipe.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RecipeBook = require('./recipeBook');
const Recipe = require('./recipe');

const RecipeBookRecipe = sequelize.define(
  'recipe_book_recipe',
  {
    recipe_book_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: RecipeBook,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    recipe_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: Recipe,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  },
  {
    tableName: 'recipe_book_recipe',
    timestamps: false
  }
);

module.exports = RecipeBookRecipe;
