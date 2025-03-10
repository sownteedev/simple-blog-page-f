import express from 'express';
import BlogPost from '../models/BlogPost';

const router = express.Router();

// Get all posts
router.get('/api/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 