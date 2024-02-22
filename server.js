const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();



const app = express();



const uri = "mongodb://localhost:27017/Salazar-Torres-CS554-Lab1"


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

const validateUser = require('./src/middlewares/validateUser.middleware'); 
const registerUser = require('./src/middlewares/registerUser.middleware'); 
const signIn = require('./src/middlewares/signIn.middleware'); 
const logOut = require('./src/middlewares/logOut.middleware'); 
const postBlog = require("./src/middlewares/postBlog.middleware");
const validateBlogPost = require('./src/middlewares/validateBlogPost.middleware');
const getBlogPost = require('./src/middlewares/getBlogPost.middleware');
const checkBlogPostOwner = require('./src/middlewares/checkBlogPostOwner.middleware');
const updateBlogPost = require('./src/middlewares/updateBlogPost.middleware');
const addCommentToBlogPost = require('./src/middlewares/addCommentToBlogPost.middleware'); 
const deleteComment = require('./src/middlewares/deleteComment.middleware');
const patchBlogPost = require('./src/middlewares/patchBlogPost.middleware');
const fetchBlogPosts = require('./src/middlewares/fetchBlogPosts.middleware');

app.use(session({
  secret:"sitblog-session", 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: uri }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Working...');
  res.status(200)
});

app.get('/sitblog', fetchBlogPosts, (req, res) => {
  res.status(200).json(req.blogPosts);
});

app.post('/sitblog/register', validateUser, registerUser);

app.post('/sitblog/signin', signIn)

app.get('/sitblog/logout', logOut, (req, res) => {
  res.status(200);
})

app.post('/sitblog', validateBlogPost, postBlog, (req, res) => {
  res.status(201).json(req.blogPost);
});

app.patch('/sitblog/:id', checkBlogPostOwner, patchBlogPost, (req, res) => {
  res.status(200).json(req.blogPost);
});

app.get('/sitblog/:id', getBlogPost, (req, res) => {
  res.status(200).json(req.blogPost);
});

app.put('/sitblog/:id', checkBlogPostOwner, updateBlogPost, (req, res) => {
  res.status(200).json(req.blogPost);
});

app.post('/sitblog/:id/comments', addCommentToBlogPost, (req, res) => {
  res.status(200).json(req.updatedBlogPost);
});

app.delete('/sitblog/:blogId/:commentId', deleteComment, (req, res) => {
  res.status(200).json(req.updatedBlogPost);
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}


module.exports = app;
