const Blog = require('../models/blog.models'); 

async function postBlog(req, res, next) {
    try {
        const { blogTitle, blogBody, userThatPosted } = req.body;


        const newBlog = new Blog({
            blogTitle,
            blogBody,
            userThatPosted
        });


        await newBlog.save();

        
        req.blogPost = newBlog;

        next(); 
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).send('Error creating blog post');
    }
}

module.exports = postBlog;
