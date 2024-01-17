const express = require("express");
const router = express.Router();

const Blog = require("../model/blogSchema.js");
const auth = require("../middleware/auth.js");

const dateFunction = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const options = { timeZone: "Asia/Kolkata" };
  const hours = currentDate.toLocaleString("en-US", {
    ...options,
    hour: "numeric",
    hour12: false,
  });
  const minutes = currentDate.toLocaleString("en-US", {
    ...options,
    minute: "numeric",
  });
  const seconds = currentDate.toLocaleString("en-US", {
    ...options,
    second: "numeric",
  });
  const readableFormat = `${day < 10 ? "0" + day : day}-${
    month < 10 ? "0" + month : month
  }-${year} ,${hours}:${minutes}:${seconds} IST`;

  return readableFormat;
};

router.post("/blog/create", auth, async (req, res) => {
  const { userId, userName, title, category, description, thumbnail } =
    req.body;

  // Replace the matched content with an empty string

  const date = dateFunction();
  if (
    !userId ||
    !userName ||
    !title ||
    !category ||
    !description ||
    !thumbnail
  ) {
    return res
      .status(422)
      .json({ error: "plz fill the fields properly in blog" });
  }

  try {
    const blog = new Blog({
      userId,
      userName,
      title,
      category,
      description,
      thumbnail,
      date,
    });
    await blog.save();
    res.status(201).json({ message: "blog created successully", blog });
  } catch (error) {
    res.send(error);
  }
});

router.put("/blog/update/:id", auth, async (req, res) => {
  try {
    let blogUserId = await Blog.findOne({ _id: req.params.id });
    if (!blogUserId) {
      res.status(400).json({
        success: false,
        message: "Blogs not Found",
      });
    }
    userBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "blog updated successfully",
      userBlog,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/blog/delete/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(400).json({
        success: false,
        message: "Employee not Found",
      });
    }
    const delBlog = await Blog.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "blog deleted Successfully",
      delBlog,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/blog/userBlogs/:id", auth, async (req, res) => {
  const userIdFromParams = req.params.id;

  try {
    const blogs = await Blog.find({ userId: userIdFromParams });
    if (!blogs || blogs.length === 0) {
      return res.send({
        success: false,
        message: "No blogs found for the specified user ID",
        blogs: [],
      });
    }
    res.status(200).send({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/blog/allBlogs", auth, async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.status(200).send({ success: true, blogs });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.get("/blog/:id", auth, async (req, res) => {
  try {
    const userIdFromParams = req.params.id;
    const blogs = await Blog.find({ _id: userIdFromParams });

    res.status(200).send({ success: true, blogs });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
