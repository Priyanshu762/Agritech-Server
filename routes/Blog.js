const express = require("express");

const router = express.Router();
const { auth } = require("../middlewares/auth");
const { createBlog, updateBlog, getaBlog, getAllBlogs, deleteBlog } = require("../controllers/Blog");

router.post("/add-blog",createBlog)
router.put("/updateBlog",updateBlog)
router.post("/getFullBlogDetails",getaBlog)
router.get("/allBlogs",getAllBlogs)
router.delete("/deleteBlog",deleteBlog)


module.exports = router;