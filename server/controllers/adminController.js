const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalComments = await Comment.countDocuments();

    // Aggregate total views
    const viewsAggregation = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);
    const totalViews = viewsAggregation.length > 0 ? viewsAggregation[0].totalViews : 0;

    // Get latest 5 blogs
    const recentBlogs = await Blog.find()
      .populate('author', 'fullName username')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get latest 5 users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalBlogs,
      totalComments,
      totalViews,
      recentBlogs,
      recentUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving admin statistics' });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
};

// @desc    Delete a user and cleanup their blogs and comments
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteAdminUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (userToDelete._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    // 1. Delete all comments by this user
    await Comment.deleteMany({ user: userToDelete._id });

    // 2. Find all blogs by this user
    const userBlogs = await Blog.find({ author: userToDelete._id });
    const blogIds = userBlogs.map(b => b._id);

    // 3. Delete comments on all blogs by this user
    await Comment.deleteMany({ blog: { $in: blogIds } });

    // 4. Delete all blogs by this user
    await Blog.deleteMany({ author: userToDelete._id });

    // 5. Delete user
    await User.deleteOne({ _id: userToDelete._id });

    res.json({ message: 'User and all associated blogs/comments deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

module.exports = {
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
};
