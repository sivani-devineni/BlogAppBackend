const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  thumbnail: {
    type: String,
    require: true,
  },

  date: {
    type: String,
    require: true,
  },
});

const Blog = new mongoose.model("BLOG", blogSchema);

module.exports = Blog;