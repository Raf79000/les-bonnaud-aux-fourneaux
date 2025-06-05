// models/recipeBook.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const RecipeBook = sequelize.define(
  'recipe_book',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  },
  {
    tableName: 'recipe_book',
    timestamps: false
  }
);

module.exports = RecipeBook;
