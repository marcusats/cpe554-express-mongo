const Blog = require('../models/blog.models'); 

async function addCommentToBlogPost(req, res, next) {
    try {
        const { id } = req.params;
        const { commentText } = req.body;

        if (!req.session.userId) {
            return res.status(401).send('User must be logged in to post a comment');
        }

        const blogPost = await Blog.findById(id);
        if (!blogPost) {
            return res.status(404).send('Blog post not found');
        }

        const newComment = {
            text: commentText,
            postedBy: {
                _id: req.session.userId,
                username: req.session.username
            },
            postedAt: new Date()
        };
        blogPost.comments.push(newComment);

        await blogPost.save();

        req.updatedBlogPost = blogPost;
        next();
    } catch (error) {
        console.error('Error adding comment to blog post:', error);
        res.status(500).send('Error adding comment');
    }
}

module.exports = addCommentToBlogPost;
