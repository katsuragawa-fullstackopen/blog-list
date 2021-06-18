const blogsRoute = require("express").Router();
const Blog = require("../models/blog");
const { info } = require("../utils/logger");

// get all blogs
blogsRoute.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

// post a blog
blogsRoute.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRoute;
