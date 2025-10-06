const Post = require("../models/post.models");

// Create a new post
const createPost = async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createPost
};