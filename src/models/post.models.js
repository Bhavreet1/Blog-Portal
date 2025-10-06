const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  slug: { type: String, unique: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sections: [sectionSchema],  
  tags: [String],
  coverImage: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true },
});
module.exports = mongoose.model("Post", postSchema);
