const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  }
)

describe('when there is initially some blog post saved', () => {
  test('blog posts are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('all blog posts are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
  
  test('a specific blog post is within the returned list', async () => {
	const response = await api.get('/api/blogs')
	const titles = response.body.map(r => r.title)
	expect(titles).toContain('HTML is easy')
  })
})

describe('addition of a new blog post', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Css is Tricky',
	  author: 'HK',
      url: 'http://localhost:3003/api/blogs/9',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
	
	const blogsAtEnd = await helper.blogsInDb()
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain('Css is Tricky')
  })
  
  test('a specific blog post can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    expect(resultBlog.body).toEqual(processedBlogToView)
  })
  
  test('verifing the unique identifier property', async () => {
	const response = await api.get('/api/blogs')
    response.body.forEach(blog => expect(blog.id).toBeDefined())
})

  test('blog without likes is added', async () => {
    const newBlog = {
      title: 'Gniezdne wojny',
	  author: 'HK',
      url: 'http://localhost:3003/api/blogs/10'
    }
    await api
	  .post('/api/blogs')
	  .send(newBlog)
	  .expect(200)
	  .expect('Content-Type', /application\/json/)
    
	const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd[blogsAtEnd.length-1].likes).toBe(0) 
  })

  test('blog post without title or URL is not added', async () => {
    const newBlog = {
      author: 'HW',
	  likes: 9
	} 
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
    
	const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

 describe('deletion of a blog post', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)
      const title = blogsAtEnd.map(r => r.title)
      expect(title).not.toContain(blogToDelete.title)
    })
  })

afterAll(() => {
  mongoose.connection.close()
})