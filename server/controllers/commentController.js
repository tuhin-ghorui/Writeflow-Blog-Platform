const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

// @desc    Add a comment to a blog post
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { blogId, text } = req.body;

    if (!blogId || !text) {
      return res.status(400).json({ message: 'Blog ID and comment text are required' });
    }

    // Verify blog post exists
    const blogExists = await Blog.findById(blogId);
    if (!blogExists) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const comment = await Comment.create({
      blog: blogId,
      user: req.user._id,
      text,
    });

    // Populate user info for the newly created comment
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'fullName username avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};

// @desc    Get comments for a specific blog
// @route   GET /api/comments/:blogId
// @access  Public
const getCommentsByBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blog: blogId })
      .populate('user', 'fullName username avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving comments' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Auth check: comment creator or admin can delete
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.deleteOne({ _id: comment._id });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
};

module.exports = {
  addComment,
  getCommentsByBlog,
  deleteComment,
};
