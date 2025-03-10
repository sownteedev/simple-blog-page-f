import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  readTime: {
    type: String,
    required: true
  }
});

export default mongoose.model('BlogPost', blogPostSchema); 