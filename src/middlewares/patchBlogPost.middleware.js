async function patchBlogPost(req, res, next) {
    try {
        const { blogTitle, blogBody } = req.body;


        if (blogTitle !== undefined) {
            req.blogPost.blogTitle = blogTitle;
        }
        if (blogBody !== undefined) {
            req.blogPost.blogBody = blogBody;
        }

        await req.blogPost.save();

        next();
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).send('Error updating blog post');
    }
}

module.exports = patchBlogPost;