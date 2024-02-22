

async function updateBlogPost(req, res, next) {
    try {
        const { blogTitle, blogBody } = req.body;


        req.blogPost.blogTitle = blogTitle;
        req.blogPost.blogBody = blogBody;

        await req.blogPost.save();

        next();
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).send('Error updating blog post');
    }
}

module.exports = updateBlogPost;
