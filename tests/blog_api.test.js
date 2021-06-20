const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("When there's blogs saved", () => {
  test("return GET request as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("return correct amount of blogs", async () => {
    const blogs = await api.get("/api/blogs");
    expect(blogs.body).toHaveLength(2);
  });

  test("return id property instead of _id", async () => {
    const blogs = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    for (blog of blogs.body) {
      expect(blog.id).toBeDefined();
    }
  });
});

describe("Adding a blog to database", () => {
  test("succeeds to add a valid blog", async () => {
    const blogToAdd = {
      title: "Test blog to be added",
      author: "Tester V1",
      url: "tester.com",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .send(blogToAdd)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogs.map((b) => b.title);
    expect(titles).toContain("Test blog to be added");

    const authors = blogs.map((b) => b.author);
    expect(authors).toContain("Tester V1");
  });

  test("without 'likes' property will default to 0", async () => {
    const blogToAdd = {
      title: "Test blog to be added",
      author: "Tester V1",
      url: "tester.com",
    };

    await api
      .post("/api/blogs")
      .send(blogToAdd)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(3);

    const likes = blogs.map((b) => b.likes);
    expect(likes).toContain(0);
  });

  test("without 'title' or 'url' returns 400", async () => {
    const blogToAdd_withoutTitle = {
      author: "Tester V1",
      url: "tester.com",
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
});

describe("Deleting a blog", () => {
  test("succeeds with status 204 if ID is valid", async () => {
    const blogs = await helper.blogsInDb();
    const blogToDelete = blogs[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAfter = await helper.blogsInDb();
    expect(blogsAfter).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAfter.map((b) => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("Updating a blog", () => {
  test("succeeds with valid ID and request body", async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[0];

    blogToUpdate.likes = 10;

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(updatedBlog.body.likes).toEqual(10);
  });

  test("fails with status 400 if ID is invalid", async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[0];

    blogToUpdate.likes = 10;

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}invalid`)
      .send(blogToUpdate)
      .expect(400)
  })
});

afterAll(() => {
  mongoose.connection.close();
});
