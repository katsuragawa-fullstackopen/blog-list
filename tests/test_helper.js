const Blog = require("../models/blog");
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

// return an id that for sure won't exist
const nonExistingId = async () => {
  const blog = new Blog({
    title: "aaa",
    author: "aaa",
    url: "asdhkdajhd",
    likes: 1231,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

// return all notes in DB as an array with json's
const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = { initialBlogs, nonExistingId, blogsInDb };
