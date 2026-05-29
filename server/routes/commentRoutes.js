const express = require('express');
const router = express.Router();
const { addComment, getCommentsByBlog, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addComment);

router.route('/:blogId')
  .get(getCommentsByBlog);

router.route('/:id')
  .delete(protect, deleteComment);

module.exports = router;
