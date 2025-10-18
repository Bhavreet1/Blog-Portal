const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    fullname: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    isAuthor: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    liked_posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    bio: { type: String },
    profilePicture: { type: String },
    socialLinks: {
        website: { type: String },
        linkedin: { type: String },
        github: { type: String },
    },
}, {
    timestamps: true
}
)
module.exports = mongoose.model("User", userSchema);