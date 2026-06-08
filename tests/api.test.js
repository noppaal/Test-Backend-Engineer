process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const { sequelize, User, Post } = require('../models');

beforeAll(async () => {
  // Sync the database (creates tables in SQLite in-memory db)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection after all tests run
  await sequelize.close();
});

describe('REST API Tests', () => {
  let user1Token;
  let user2Token;
  let user1Id;
  let user2Id;
  let post1Id;

  const testUser1 = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123'
  };

  const testUser2 = {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password456'
  };

  describe('User Authentication Endpoints', () => {
    test('1. POST /api/users/register - Should register user successfully', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send(testUser1);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.name).toBe(testUser1.name);
      expect(response.body.user.email).toBe(testUser1.email);
      expect(response.body.user).not.toHaveProperty('password');

      user1Id = response.body.user.id;
    });

    test('2. POST /api/users/register - Should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send(testUser1);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('already registered');
    });

    test('3. POST /api/users/login - Should login user successfully and return JWT', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser1.email,
          password: testUser1.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser1.email);

      user1Token = response.body.token;
    });

    test('4. POST /api/users/login - Should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser1.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Post Endpoints', () => {
    // Register and login second user to test cross-user authorization
    beforeAll(async () => {
      const regRes = await request(app)
        .post('/api/users/register')
        .send(testUser2);
      user2Id = regRes.body.user.id;

      const loginRes = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser2.email,
          password: testUser2.password
        });
      user2Token = loginRes.body.token;
    });

    test('1. POST /api/posts - Should reject post creation without auth token', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({ content: 'Hello World!' });

      expect(response.status).toBe(401);
    });

    test('2. POST /api/posts - Should create post successfully with valid auth token', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ content: 'My first blog post!' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('post');
      expect(response.body.post).toHaveProperty('id');
      expect(response.body.post.content).toBe('My first blog post!');
      expect(response.body.post.authorId).toBe(user1Id);

      post1Id = response.body.post.id;
    });

    test('3. GET /api/posts - Should fetch all posts', async () => {
      const response = await request(app).get('/api/posts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('content');
      expect(response.body[0]).toHaveProperty('author');
      expect(response.body[0].author.name).toBe(testUser1.name);
    });

    test('4. GET /api/posts/:id - Should fetch single post by id', async () => {
      const response = await request(app).get(`/api/posts/${post1Id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(post1Id);
      expect(response.body.content).toBe('My first blog post!');
      expect(response.body.author.id).toBe(user1Id);
    });

    test('5. GET /api/posts/:id - Should return 404 for non-existent post', async () => {
      const response = await request(app).get('/api/posts/9999');

      expect(response.status).toBe(404);
    });

    test('6. PUT /api/posts/:id - Should reject updates from non-owner user', async () => {
      const response = await request(app)
        .put(`/api/posts/${post1Id}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ content: 'Hacked post content!' });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Unauthorized');
    });

    test('7. PUT /api/posts/:id - Should update post successfully with owner token', async () => {
      const response = await request(app)
        .put(`/api/posts/${post1Id}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ content: 'Updated blog post content.' });

      expect(response.status).toBe(200);
      expect(response.body.post.content).toBe('Updated blog post content.');
    });

    test('8. DELETE /api/posts/:id - Should reject deletion from non-owner user', async () => {
      const response = await request(app)
        .delete(`/api/posts/${post1Id}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(response.status).toBe(403);
    });

    test('9. DELETE /api/posts/:id - Should delete post successfully with owner token', async () => {
      const response = await request(app)
        .delete(`/api/posts/${post1Id}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted successfully');

      // Verify it is deleted
      const checkRes = await request(app).get(`/api/posts/${post1Id}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
