const mongoose = require('mongoose');
const Blog = require('../models/blog.models'); 

async function checkBlogPostOwner(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).send('Blog post not found');
        }

        const blogPost = await Blog.findById(id);
        if (!blogPost) {
            return res.status(404).send('Blog post not found');
        }

        if (!req.session.userId || blogPost.userThatPosted._id.toString() !== req.session.userId) {
            return res.status(403).send('Unauthorized to update this blog post');
        }

        req.blogPost = blogPost;
        next();
    } catch (error) {
        console.error('Error verifying blog post owner:', error);
        res.status(500).send('Error processing request');
    }
}

module.exports = checkBlogPostOwner;
