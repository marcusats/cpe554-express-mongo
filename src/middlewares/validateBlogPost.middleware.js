function validateBlogPost(req, res, next) {
    const { blogTitle, blogBody, userThatPosted } = req.body;

    if (!blogTitle || !blogBody || !userThatPosted || !userThatPosted._id || !userThatPosted.username) {
        return res.status(400).send('Missing required fields: blogTitle, blogBody, and userThatPosted with _id and username');
    }



    next();
}

module.exports = validateBlogPost;
