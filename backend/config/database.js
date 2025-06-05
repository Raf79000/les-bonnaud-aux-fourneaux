// config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // set to console.log if you want to see SQL queries
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: false
    }
  }
);

module.exports = sequelize;
