const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe("retriving posts", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  })
  
  test('there are seven blog posts', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(7)
})
})

describe("verifing the unique identifier property", () => {
  test("id exist", async () => {
	const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.id).toBeDefined())
})
})

afterAll(() => {
  mongoose.connection.close()
})