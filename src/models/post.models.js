const mongoose = require("mongoose");
const { Schema } = mongoose;
const slugify = require("slugify");

const sectionSchema = new Schema({
    alignment: {
        type: String,
        enum: ["left", "center", "right"],
        default: "left"
    },
    subheading: { type: String },
    content: { type: String, required: true },
});

const postSchema = new Schema({
    title: { type: String, required: true },
    // https://yourwebsite.com/posts/learn-mern-stack-in-2025  slug means short url
  slug: { type: String, unique: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sections: [sectionSchema], 
  likers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  tags: [String],
  coverImage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true },
});

// Middleware to generate slug before saving a post
postSchema.pre("save", function(next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
