const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "The Story Of React Has Just Gone Viral!",
    author: "Brett C. Richardson",
    url: "http://account.example.com/",
    likes: 21,
  },
  {
    title: "The Ten Common Stereotypes When It Comes To Node.",
    author: "Wyatt L. Goers",
    url: "http://www.example.com/bridge.aspx",
    likes: 83,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("API return GET request as JSON", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("API return correct amount of blogs", async () => {
  const blogs = await api.get("/api/blogs");
  expect(blogs.body).toHaveLength(2);
});

test("API add a valid blog to database", async () => {
  const blogToAdd = {
    title: "Test blog to be added",
    author: "Tester V1",
    url: "testurl.com",
    likes: 1,
  };

  await api
    .post("/api/blogs")
    .send(blogToAdd)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsInDB = await Blog.find({});
  const blogsInDB_JSON = blogsInDB.map((blog) => blog.toJSON());
  expect(blogsInDB_JSON).toHaveLength(initialBlogs.length + 1);

  const titles = blogsInDB_JSON.map((b) => b.title);
  expect(titles).toContain("Test blog to be added");

  const authors = blogsInDB_JSON.map((b) => b.author);
  expect(authors).toContain("Tester V1");
});

test("API return id property", async () => {
  const blogs = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  for (blog of blogs.body) {
    expect(blog.id).toBeDefined();
  }
});

test("POST request without 'likes' property will default to 0", async () => {
  const blogToAdd = {
    title: "Test blog to be added",
    author: "Tester V1",
    url: "testurl.com",
  };

  await api
    .post("/api/blogs")
    .send(blogToAdd)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsInDB = await Blog.find({});
  const blogsInDB_JSON = blogsInDB.map((b) => b.toJSON());
  expect(blogsInDB_JSON).toHaveLength(3);

  const likes = blogsInDB_JSON.map((b) => b.likes);
  expect(likes).toContain(0);
});

test.only("POST request without 'title' or 'url' returns 400", async () => {
  const blogToAdd_withoutTitle = {
    author: "Tester V1",
    url: "testurl.com",
    likes: 22,
  };
  await api.post("/api/blogs").send(blogToAdd_withoutTitle).expect(400);

  const blogToAdd_withoutUrl = {
    title: "Test blog to be added",
    author: "Tester V1",
    likes: 1,
  };
  await api.post("/api/blogs").send(blogToAdd_withoutUrl).expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
