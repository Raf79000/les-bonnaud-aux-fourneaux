// models/recipe.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define(
  'recipe',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    preparation_time: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'minutes'
    },
    difficulty: {
      type: DataTypes.ENUM('EASY', 'MEDIUM', 'HARD'),
      allowNull: false,
      defaultValue: 'MEDIUM'
    },
    category: {
      type: DataTypes.ENUM('STARTER', 'MAIN_COURSE', 'DESSERT', 'ALL'),
      allowNull: false,
      defaultValue: 'ALL'
    }
  },
  {
    tableName: 'recipe'
  }
);

module.exports = Recipe;
