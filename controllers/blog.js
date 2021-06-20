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

// update a Blog
blogsRoute.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

// delete a blog
blogsRoute.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogsRoute;
