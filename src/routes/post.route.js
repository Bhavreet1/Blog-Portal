const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { createPost, getPosts, getPost, updatePost, likePost, deletePost } = require('../controllers/post.controller');

// RESTful routes
router.post("/", auth, createPost);        // CREATE new post
router.get("/", auth, getPosts);           // GET all posts
router.get("/:id", auth, getPost);         // GET single post
router.put("/:id", auth, updatePost);      // UPDATE post
router.delete("/:id", auth, deletePost);   // DELETE post

// Special route for liking
router.post("/:id/like", auth, likePost);  // Changed to POST as it modifies state

module.exports = router;