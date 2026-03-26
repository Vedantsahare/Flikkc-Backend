import Blog from "../models/Blog.js";

/* =========================
   CREATE BLOG (ADMIN)
========================= */
export const createBlog = async (req, res) => {
  try {
    const { title, slug, description, content, coverImage } = req.body;

    if (!title || !slug || !description || !content) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        message: "Slug already exists",
      });
    }

    const blog = await Blog.create({
      title,
      slug,
      description,
      content,
      coverImage,
    });

    res.json(blog);

  } catch (err) {
    console.error("Create blog error:", err);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

/* =========================
   GET ALL BLOGS
========================= */
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .select("-content"); // ✅ lighter response

    res.json(blogs);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

/* =========================
   GET BLOG BY SLUG
========================= */
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      published: true,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

/* =========================
   DELETE BLOG (ADMIN)
========================= */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: "Failed to delete blog" });
  }
};