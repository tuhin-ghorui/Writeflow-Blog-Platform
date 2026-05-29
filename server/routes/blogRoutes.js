const express = require('express');
const router = express.Router();
const {
  createBlog,
  getBlogs,
  getBlogBySlugOrId,
  updateBlog,
  deleteBlog,
  likeBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router.route('/:slugOrId')
  .get(getBlogBySlugOrId);

router.route('/:id')
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.route('/:id/like')
  .post(protect, likeBlog);

module.exports = router;
