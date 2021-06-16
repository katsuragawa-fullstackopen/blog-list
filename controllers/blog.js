const blogsRoute = require("express").Router();
const Blog = require("../models/blog");
const { info } = require("../utils/logger");

// get all blogs
blogsRoute.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    info("Found the blogs:", blogs);
    response.json(blogs);
  });
});

// post a blog
blogsRoute.post("/", (request, response) => {
  const blog = new Blog(request.body);

  info("Adding the blog:", blog);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = blogsRoute;
