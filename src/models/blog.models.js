const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogTitle: {
    type: String,
    required: true
  },
  blogBody: {
    type: String,
    required: true
  },
  userThatPosted: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  comments: [{
    text: String,
    postedBy: {
      _id: mongoose.Schema.Types.ObjectId,
      username: String
    },
    postedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
