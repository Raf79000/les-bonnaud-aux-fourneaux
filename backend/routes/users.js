// routes/users.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');

// CREATE a new user
// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;
    const newUser = await User.create({ username, email });
    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

// READ all users
// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ order: [['id', 'ASC']] });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// READ one user by ID
// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

// UPDATE a user
// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { username, email } = req.body;
    const [updatedCount] = await User.update(
      { username, email },
      { where: { id: req.params.id } }
    );
    if (updatedCount === 0)
      return res.status(404).json({ error: 'User not found or nothing to update.' });
    const updatedUser = await User.findByPk(req.params.id);
    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

// DELETE a user
// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await User.destroy({ where: { id: req.params.id } });
    if (deletedCount === 0) return res.status(404).json({ error: 'User not found.' });
    return res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
});

module.exports = router;
