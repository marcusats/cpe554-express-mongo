const Blog = require('../models/blog.models'); 

async function getBlogPost(req, res, next) {
    try {
        const { id } = req.params;

        const blogPost = await Blog.findById(id);
        if (!blogPost) {
            return res.status(404).send('Blog post not found');
        }

    
        req.blogPost = blogPost;

        next(); 
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).send('Error fetching blog post');
    }
}

module.exports = getBlogPost;
