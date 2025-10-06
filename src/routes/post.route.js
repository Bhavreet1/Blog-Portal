const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/post.controller');

// Route to create a new post
router.post('/', createPost);

module.exports = router;