const express = require('express');
const router = express.Router();
const { createUser, getAllUsers } = require('../controllers/user.controller');

// Routes
router.post('/', createUser);          // Create user
router.get("/", getAllUsers); // ✅
// router.get('/:id', getUserById);       // Get user by ID

module.exports = router;
