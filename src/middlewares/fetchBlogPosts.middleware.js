const Blog = require('../models/blog.models'); 

async function fetchBlogPosts(req, res, next) {
    try {
        const limit = Math.min(req.query.limit ? parseInt(req.query.limit) : 20, 100);
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;

        if (isNaN(limit) || isNaN(skip)) {
            return res.status(400).send('Invalid skip or limit value');
        }

        if (limit > 100) {
            limit = 100;
        }

        const blogPosts = await Blog.find().skip(skip).limit(limit);
        req.blogPosts = blogPosts;

        next();
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).send('Error fetching blog posts');
    }
}

module.exports = fetchBlogPosts;
