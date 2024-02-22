const request = require('supertest');
const app = require('../server'); 
const User = require('./../src/models/user.models'); 
const Blog = require('./../src/models/blog.models'); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

describe('GET /', () => {
  it('should return Working...', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Working...');
  });
});



describe('POST /sitblog/register', () => {

  afterAll(async () => {
    try {
      await User.deleteMany({});
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });
  it('should register a new user', async () => {
    const newUser = {
      name: 'Test User',
      username: 'testuser',
      password: 'password123'
    };

    const response = await request(app)
      .post('/sitblog/register')
      .send(newUser);

    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('username', 'testuser');
    expect(response.body).not.toHaveProperty('password');
  },10000);

  it('should validate the request body', async () => {
    const incompleteUser = {
      username: 'testuser2',
      password: 'password123'
    };

    const response = await request(app)
      .post('/sitblog/register')
      .send(incompleteUser);

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('All fields (name, username, password) are required.');
  });
});

describe('POST /sitblog/signin', () => {
  
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    await User.create({ name: 'Test User', username: 'testuserSignIn', password: hashedPassword });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it('should authenticate a user with correct credentials', async () => {
    const credentials = {
      username: 'testuserSignIn',
      password: 'testpassword'
    };

    const response = await request(app)
      .post('/sitblog/signin')
      .send(credentials);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuserSignIn');
    expect(response.body).toHaveProperty('_id');
  });

  it('should reject a user with incorrect credentials', async () => {
    const credentials = {
      username: 'testuserSignIn',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/sitblog/signin')
      .send(credentials);

    expect(response.statusCode).toBe(401);
    expect(response.text).toBe('Invalid username or password');
  });
});

describe('GET /sitblog/logout', () => {

  it('should successfully log out the user', async () => {
    const response = await request(app).get('/sitblog/logout');

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('You have been logged out');
    
  });
});

describe('POST /sitblog', () => {
  let user;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await User.create({ name: 'John Doe', username: 'johndoe', password: hashedPassword });
  });

  afterAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  it('should create a new blog post', async () => {

    const credentials = {
      username: 'johndoe',
      password: 'password123'
    };

    const res = await request(app)
      .post('/sitblog/signin')
      .send(credentials);

    const newPost = {
      blogTitle: 'Test Blog Title',
      blogBody: 'Test blog body content',
      userThatPosted: { _id: user._id, username: user.username }
    };

    const response = await request(app)
      .post('/sitblog')
      .send(newPost);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('blogTitle', 'Test Blog Title');
    
  });

  it('should validate the blog post data', async () => {
    const invalidPost = {
      blogBody: 'Test blog body content',
    };

    const response = await request(app)
      .post('/sitblog')
      .send(invalidPost);

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Missing required fields: blogTitle, blogBody, and userThatPosted with _id and username');
  });
});

describe('PATCH /sitblog/:id', () => {
  let user, blogPost, cookie;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await User.create({ name: 'John Doe', username: 'johndoe', password: hashedPassword });
    blogPost = await Blog.create({
      blogTitle: 'Original Title',
      blogBody: 'Original body content',
      userThatPosted: { _id: user._id, username: user.username }
    });
  });

  afterAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  it('should update a blog post', async () => {
   
    const loginResponse = await request(app)
      .post('/sitblog/signin')
      .send({ username: 'johndoe', password: 'password123' });

    if (loginResponse.headers['set-cookie']) {
      cookie = loginResponse.headers['set-cookie'][0];
    } else {
      throw new Error('No set-cookie header found in response');
    }

    
    const updatedData = {
      blogTitle: 'Updated Title',
      blogBody: 'Updated blog body content'
    };

    
    const response = await request(app)
      .patch(`/sitblog/${blogPost._id.toString()}`)
      .set('Cookie', cookie) 
      .send(updatedData);

    console.log('Patch Response:', response.statusCode);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('blogTitle', 'Updated Title');
  });
});


describe('GET /sitblog/:id', () => {
  let user, blogPost, cookie;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await User.create({ name: 'John Doe', username: 'johndoe', password: hashedPassword });
    blogPost = await Blog.create({
      blogTitle: 'Original Title',
      blogBody: 'Original body content',
      userThatPosted: { _id: user._id, username: user.username }
    });
  });

  afterAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  it('should get a blog post', async () => {
   
    const loginResponse = await request(app)
      .post('/sitblog/signin')
      .send({ username: 'johndoe', password: 'password123' });

    if (loginResponse.headers['set-cookie']) {
      cookie = loginResponse.headers['set-cookie'][0];
    } else {
      throw new Error('No set-cookie header found in response');
    }

    
    const response = await request(app)
      .get(`/sitblog/${blogPost._id.toString()}`)
      .set('Cookie', cookie)

    expect(response.statusCode).toBe(200);
    expect(response.body.blogTitle).toBe(blogPost.blogTitle);
    expect(response.body.blogBody).toBe(blogPost.blogBody);
  });
});

describe('PUT /sitblog/:id', () => {
  let user, blogPost, cookie;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await User.create({ name: 'John Doe', username: 'johndoe', password: hashedPassword });
    blogPost = await Blog.create({
      blogTitle: 'Original Title',
      blogBody: 'Original body content',
      userThatPosted: { _id: user._id, username: user.username }
    });
  });

  afterAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  it('should update a blog post', async () => {
   
    const loginResponse = await request(app)
      .post('/sitblog/signin')
      .send({ username: 'johndoe', password: 'password123' });

    if (loginResponse.headers['set-cookie']) {
      cookie = loginResponse.headers['set-cookie'][0];
    } else {
      throw new Error('No set-cookie header found in response');
    }

    
    const updatedData = {
      blogTitle: 'Updated Title',
      blogBody: 'Updated blog body content'
    };

    
    const response = await request(app)
      .put(`/sitblog/${blogPost._id.toString()}`)
      .set('Cookie', cookie) 
      .send(updatedData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('blogTitle', 'Updated Title');
    expect(response.body).toHaveProperty('blogBody', 'Updated blog body content');
  });
});




describe('POST /sitblog/:id/comments', () => {
  let user, blogPost, cookie;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await User.create({ name: 'John Doe', username: 'johndoe', password: hashedPassword });
    blogPost = await Blog.create({
      blogTitle: 'Original Title',
      blogBody: 'Original body content',
      userThatPosted: { _id: user._id, username: user.username }
    });
  });

  afterAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  it('should comment the post', async () => {
   
    const loginResponse = await request(app)
      .post('/sitblog/signin')
      .send({ username: 'johndoe', password: 'password123' });

    if (loginResponse.headers['set-cookie']) {
      cookie = loginResponse.headers['set-cookie'][0];
    } else {
      throw new Error('No set-cookie header found in response');
    }

    const comment = {
      commentText: "test comment"
    };

    const response = await request(app)
      .post(`/sitblog/${blogPost._id.toString()}/comments`)
      .set('Cookie', cookie) 
      .send(comment);
    
    expect(response.body.comments[0]).toHaveProperty('text', 'test comment');
    
    
  });
});





describe('DELETE /sitblog/:blogId/:commentId', () => {
  let user, blogPost, cookie;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    user = await User.create({ name: 'John Doe', username: 'johndoe', password: hashedPassword });
    blogPost = await Blog.create({
      blogTitle: 'Original Title',
      blogBody: 'Original body content',
      userThatPosted: { _id: user._id, username: user.username }
    });
  });

  afterAll(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  it('should delete comment', async () => {
   
    const loginResponse = await request(app)
    .post('/sitblog/signin')
    .send({ username: 'johndoe', password: 'password123' });

    if (loginResponse.headers['set-cookie']) {
      cookie = loginResponse.headers['set-cookie'][0];
    } else {
      throw new Error('No set-cookie header found in response');
    }

    const comment = {
      commentText: "test comment"
    };

    const commentResponse = await request(app)
      .post(`/sitblog/${blogPost._id.toString()}/comments`)
      .set('Cookie', cookie) 
      .send(comment);
    
      const response = await request(app)
      .post(`/sitblog/${blogPost._id.toString()}/${commentResponse.body.comments[0]._id}`)
      .set('Cookie', cookie) 
      .send(comment);

      expect(response.body.comments).toEqual(undefined);
  });
});

