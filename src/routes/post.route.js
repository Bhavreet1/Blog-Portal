const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { createPost, updatePost, likePost, unlikePost , deletePost } = require('../controllers/post.controller');

// Route to create a new post
router.post("/", auth, createPost);
router.put("/", auth, updatePost);
router.delete("/", auth, deletePost);

// like endpoint
router.post("/:id/like", auth, likePost);
router.post("/:id/unlike", auth, unlikePost);

module.exports = router;