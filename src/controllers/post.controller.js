const Post = require("../models/post.models");
const User = require("../models/user.model");
// Create a new post
const createPost = async (req, res) => {
    try {
        const newPost = new Post(req.body);
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
// Update an existing post
const updatePost = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Post ID is required for update." });
        }
        const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updatedPost);
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

// like a post
const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id; // Get from auth middleware instead of body

        // Use findOneAndUpdate for atomic operation
        const post = await Post.findOneAndUpdate(
            { _id: id },
            {
                $addToSet: { likers: userId }, // Add userId if not exists
            },
            { new: true } // Return updated document
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Update user's liked posts atomically
        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: { liked_posts: id }
            }
        );

        return res.status(200).json({
            success: true,
            likes: post.likers.length,
            isLiked: true
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "An error occurred while liking the post.",
            error: error.message 
        });
    }
};

const unlikePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Use findOneAndUpdate for atomic operation
        const post = await Post.findOneAndUpdate(
            { _id: id },
            {
                $pull: { likers: userId } // Remove userId from likers
            },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Remove post from user's liked posts
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: { liked_posts: id }
            }
        );

        return res.status(200).json({
            success: true,
            likes: post.likers.length,
            isLiked: false
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "An error occurred while unliking the post.",
            error: error.message 
        });
    }
};

module.exports = { createPost, updatePost, deletePost, likePost, unlikePost };