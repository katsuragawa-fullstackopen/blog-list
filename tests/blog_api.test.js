const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const Blog = require("../models/blog");

const api = supertest(app);

const blogs = [
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

  for (let blog of blogs) {
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
  expect(blogsInDB_JSON).toHaveLength(3);

  const titles = blogsInDB_JSON.map((b) => b.title);
  expect(titles).toContain("Test blog to be added");

  const authors = blogsInDB_JSON.map((b) => b.author);
  expect(authors).toContain("Tester V1");
});

afterAll(() => {
  mongoose.connection.close();
});
