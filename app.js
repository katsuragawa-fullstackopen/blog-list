// import packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// import modules
const { MONGODB_URI } = require("./utils/config");
const blogsRoute = require("./controllers/blog");

// init express app
const app = express();

// connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// setup for middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/blogs", blogsRoute);

module.exports = app;
