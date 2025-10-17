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
// Update an existing post
const updatePost = async (req, res) => {
    try {
        const { id } = req.body;
        const updatePost = await Post.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updatePost);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
// Delete a post
const deletePost = async (req, res) => {
    try {
        const { id } = req.body;
        await Post.findByIdAndDelete(id);
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = {
    createPost,
    updatePost,
    deletePost
};