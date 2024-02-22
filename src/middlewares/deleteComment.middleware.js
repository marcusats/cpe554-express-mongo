const Blog = require('../models/blog.models'); 

async function deleteComment(req, res, next) {
    try {
        const { blogId, commentId } = req.params;


        if (!req.session.userId) {
            return res.status(401).send('User must be logged in to delete a comment');
        }


        const blogPost = await Blog.findById(blogId);
        if (!blogPost) {
            return res.status(404).send('Blog post not found');
        }


        const commentIndex = blogPost.comments.findIndex(c => c._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).send('Comment not found');
        }
        if (blogPost.comments[commentIndex].postedBy._id.toString() !== req.session.userId) {
            return res.status(403).send('Unauthorized to delete this comment');
        }

        blogPost.comments.splice(commentIndex, 1);
        await blogPost.save();

        req.updatedBlogPost = blogPost;
        next();
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send('Error deleting comment');
    }
}

module.exports = deleteComment;
