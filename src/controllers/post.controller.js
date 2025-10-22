const Post = require("../models/post.models");
const User = require("../models/user.model");
// Create a new post
const createPost = async (req, res) => {
    try {
        // Ensure author is taken from authenticated user if available
        const postData = { ...req.body };
        if (req.user && req.user._id) postData.author = req.user._id;

        const newPost = new Post(postData);
        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    } catch (error) {
        // Duplicate key (slug) or other unique index violation
        if (error && error.code === 11000) {
            return res.status(409).json({ message: "A post with this slug/title already exists. Please choose a different title." });
        }
        return res.status(400).json({ message: error.message });
    }
};
// read posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("author");
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Get a single post by id
const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Post ID is required." });

        const post = await Post.findById(id).populate("author", "username fullname");
        if (!post) return res.status(404).json({ message: "Post not found." });

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Update an existing post
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Post ID is required for update." });
        }
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPost) return res.status(404).json({ message: "Post not found." });
        return res.status(200).json(updatedPost);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
// Delete a post
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Post ID is required for deletion." });

        const deleted = await Post.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Post not found." });

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

// Toggle like status
const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // First, check if user has already liked the post
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likers.includes(userId);

        // Use atomic operation to toggle like status
        const updatedPost = await Post.findOneAndUpdate(
            { _id: id },
            isLiked
                ? { $pull: { likers: userId } }    // Unlike if already liked
                : { $addToSet: { likers: userId } },// Like if not already liked
            { new: true }
        );

        // Update user's liked_posts array
        await User.findByIdAndUpdate(
            userId,
            isLiked
                ? { $pull: { liked_posts: id } }
                : { $addToSet: { liked_posts: id } }
        );

        return res.status(200).json({
            success: true,
            likes: updatedPost.likers.length,
            isLiked: !isLiked
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while toggling like status.",
            error: error.message
        });
    }
};

module.exports = { createPost, getPosts, getPost, updatePost, likePost , deletePost};