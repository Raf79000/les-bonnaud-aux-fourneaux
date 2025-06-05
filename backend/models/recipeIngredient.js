// models/recipeIngredient.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Recipe = require('./recipe');
const Ingredient = require('./ingredient');

const RecipeIngredient = sequelize.define(
  'recipe_ingredient',
  {
    recipe_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: Recipe,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    ingredient_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      references: {
        model: Ingredient,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    weight: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      comment: 'grams, optional'
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: 'number of items, optional'
    }
  },
  {
    tableName: 'recipe_ingredient',
    timestamps: false
  }
);

module.exports = RecipeIngredient;
