# SitBlog

SitBlog is a comprehensive blogging platform designed for the CPE554 class at Stevens Institute of Technology, enabling users to register, sign in, create blog posts, comment on posts, and engage in various other activities. Developed using Node.js, Express, MongoDB, and Mongoose, it provides a RESTful API for efficient management of blog content and user accounts.

## Features

- User registration and authentication
- Session management with express-session and connect-mongo
- CRUD operations for blog posts
- Commenting on blog posts
- Middleware for validation and authorization

## Installation

To get started with SitBlog, follow these steps:

1. Clone the repository:
```bash
    git clone https://github.com/marcusats/cpe554-express-mongo.git
```

2. Navigate to the project directory:
```bash
    cd cpe554-express-mongo
```

3. Install dependencies:
```bash
    npm install
```

4. Start the server:
```bash
    npm start
```

## Usage

With the server running, you can interact with the API endpoints using tools like Postman or through your application's frontend.

- **Register a User**: [POST /sitblog/register](https://github.com/marcusats/cpe554-express-mongo/blob/main/test/server.test.js#L18)
- **Sign In**: [POST /sitblog/signin](https://github.com/marcusats/cpe554-express-mongo/blob/main/test/server.test.js#L60)
- **Create a Blog Post**: [POST /sitblog](https://github.com/marcusats/cpe554-express-mongo/blob/main/test/server.test.js#L18)
- **Get Blog Posts**: [GET /sitblog](https://github.com/marcusats/cpe554-express-mongo/blob/main/test/server.test.js#L101)
- **Add a Comment**: [POST /sitblog/:id/comments](https://github.com/marcusats/cpe554-express-mongo/blob/main/test/server.test.js#L305)
- **Update a Blog Post**: [PATCH /sitblog/:id](https://github.com/marcusats/cpe554-express-mongo/blob/main/test/server.test.js#L165)
- **Delete a Comment**: [DELETE /sitblog/:blogId/:commentId](https://github.com/marcusats/cpe554-express-mongo/blob/main/test/server.test.js#L354)

## Testing

To run the tests, use the following command:

```bash 
    npm test
```