import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },

    description: { type: String, required: true },

    content: { type: String, required: true },

    coverImage: String,

    author: {
      type: String,
      default: "Flikkc Team",
    },

    tags: [String],

    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);