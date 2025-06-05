// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// allow React app to access the API
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost'], // Adjust as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE',  'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type'] // Allowed headers
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routers (we’ll create these next)
const userRoutes       = require('./routes/users');
const ingredientRoutes = require('./routes/ingredients');
const recipeRoutes     = require('./routes/recipes');
const recipeBookRoutes = require('./routes/recipeBooks');
const favoriteRoutes   = require('./routes/favorites');

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/recipe-books', recipeBookRoutes);
app.use('/api/favorites', favoriteRoutes);

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Recipe App API!' });
});

// Sync database & start server
sequelize
  .authenticate()
  .then(() => {
    console.log('→ Database connection established.');
    return sequelize.sync({ alter: true }); 
    /**
     * In development, you can use `sync({ force: true })` to drop & recreate tables.
     * Here, `alter: true` will attempt to “alter” existing tables to match models.
     * For production, consider proper migrations instead.
     */
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`→ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('⛔ Unable to connect to the database:', err);
  });
