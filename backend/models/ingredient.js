// models/ingredient.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ingredient = sequelize.define(
  'ingredient',
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
    }
  },
  {
    tableName: 'ingredient'
  }
);

module.exports = Ingredient;
