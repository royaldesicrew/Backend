import Blog from '../models/Blog.js';

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, author, image, published } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author required' });
    }

    const blog = new Blog({
      title,
      content,
      author,
      image,
      published: published || false
    });

    await blog.save();
    res.status(201).json({ blog, message: 'Blog created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, image, published } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { title, content, author, image, published, updatedAt: new Date() },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog, message: 'Blog updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlogStats = async (req, res) => {
  try {
    const stats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalBlogs: { $sum: 1 },
          publishedBlogs: {
            $sum: { $cond: ['$published', 1, 0] }
          },
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    res.json(stats[0] || { totalBlogs: 0, publishedBlogs: 0, totalViews: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
