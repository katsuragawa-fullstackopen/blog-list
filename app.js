// import packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("express-async-errors");

// import modules
const { MONGODB_URI } = require("./utils/config");
const blogsRoute = require("./controllers/blog");
const { unknownEndpoint, errorHandler } = require("./utils/middleware");

// init express app
const app = express();

// connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// setup for middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/blogs", blogsRoute);

// unknown endpoint
app.use(unknownEndpoint);

// error handlers
app.use(errorHandler);

module.exports = app;
