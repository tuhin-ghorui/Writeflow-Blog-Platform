const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const slugify = require('../utils/slugify');

// Helper to generate unique slug
const generateUniqueSlug = async (title) => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let exists = await Blog.findOne({ slug });
  let count = 1;

  while (exists) {
    slug = `${baseSlug}-${count}`;
    exists = await Blog.findOne({ slug });
    count++;
  }

  return slug;
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    const { title, summary, content, coverImage, category, tags } = req.body;

    if (!title || !summary || !content || !category) {
      return res.status(400).json({ message: 'Title, summary, content, and category are required' });
    }

    const slug = await generateUniqueSlug(title);
    const blogTags = Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [];

    const blog = await Blog.create({
      title,
      slug,
      summary,
      content,
      coverImage: coverImage || '',
      author: req.user._id,
      category,
      tags: blogTags,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating blog post' });
  }
};

// @desc    Get all blogs with filtering, searching, and pagination
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. Filter by category
    if (req.query.category) {
      query.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
    }

    // 2. Filter by tag
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // 3. Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }

    // 4. Search term (in title, summary, or content)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { summary: searchRegex },
        { content: searchRegex }
      ];
    }

    // Determine Sorting
    let sortField = { createdAt: -1 }; // default: latest
    if (req.query.sort === 'most-viewed') {
      sortField = { views: -1 };
    } else if (req.query.sort === 'popular') {
      // Sort by likes array size in MongoDB using aggregation, 
      // or we can handle it using standard query if we sort on views, or likes size.
      // For simple sorting in Mongoose, we can sort by views or likes count. Since we have views,
      // let's sort popular as most viewed or we can sort by views. 
      // To sort by likes length, we'd use aggregate. Let's write an aggregate check if we want,
      // but standard query sorting by views is an excellent alternative, or we can use aggregate.
      // Let's implement aggregate if sort is popular, or simply sort by views.
      // Let's implement simple mongoose query and sort popular by likes length using aggregation.
      // Actually, let's keep it simple: if sort is 'popular', let's use aggregate.
    }

    let blogs;
    let totalBlogs;

    if (req.query.sort === 'popular') {
      // Find blogs aggregated and sorted by likes length
      const aggregateQuery = [
        { $match: query },
        { $addFields: { likesCount: { $size: '$likes' } } },
        { $sort: { likesCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'authorInfo'
          }
        },
        { $unwind: '$authorInfo' },
        {
          $project: {
            title: 1,
            slug: 1,
            summary: 1,
            coverImage: 1,
            category: 1,
            tags: 1,
            views: 1,
            likes: 1,
            createdAt: 1,
            updatedAt: 1,
            'authorInfo._id': 1,
            'authorInfo.fullName': 1,
            'authorInfo.username': 1,
            'authorInfo.avatar': 1,
          }
        }
      ];

      blogs = await Blog.aggregate(aggregateQuery);
      // Format response to match find() populating output format
      blogs = blogs.map(b => {
        b.author = b.authorInfo;
        delete b.authorInfo;
        return b;
      });

      const countResult = await Blog.aggregate([
        { $match: query },
        { $count: 'total' }
      ]);
      totalBlogs = countResult.length > 0 ? countResult[0].total : 0;

    } else {
      totalBlogs = await Blog.countDocuments(query);
      blogs = await Blog.find(query)
        .populate('author', 'fullName username avatar')
        .sort(sortField)
        .skip(skip)
        .limit(limit);
    }

    const totalPages = Math.ceil(totalBlogs / limit);

    res.json({
      blogs,
      pagination: {
        totalBlogs,
        totalPages,
        currentPage: page,
        limit,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving blogs' });
  }
};

// @desc    Get a single blog post by slug or ID
// @route   GET /api/blogs/:slugOrId
// @access  Public
const getBlogBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;

    // Check if it is a valid MongoDB ID, else find by slug
    let blog;
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(slugOrId).populate('author', 'fullName username avatar');
    } else {
      blog = await Blog.findOne({ slug: slugOrId }).populate('author', 'fullName username avatar');
    }

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment view counter
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving blog detail' });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
  try {
    const { title, summary, content, coverImage, category, tags } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check ownership: author must be logged in user, or user must be admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    // If title changes, update slug
    if (title && title !== blog.title) {
      blog.title = title;
      blog.slug = await generateUniqueSlug(title);
    }

    if (summary) blog.summary = summary;
    if (content) blog.content = content;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (category) blog.category = category;
    if (tags) {
      blog.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating blog post' });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check ownership: author must be logged in user, or user must be admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete associated comments
    await Comment.deleteMany({ blog: blog._id });

    // Use deleteOne or remove
    await Blog.deleteOne({ _id: blog._id });

    res.json({ message: 'Blog post and its comments deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting blog post' });
  }
};

// @desc    Like / unlike a blog post
// @route   POST /api/blogs/:id/like
// @access  Private
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if blog is already liked by this user
    const likeIndex = blog.likes.indexOf(req.user._id);

    let liked = false;
    if (likeIndex > -1) {
      // Already liked, so unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like
      blog.likes.push(req.user._id);
      liked = true;
    }

    await blog.save();

    res.json({
      liked,
      likesCount: blog.likes.length,
      likes: blog.likes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error liking blog post' });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogBySlugOrId,
  updateBlog,
  deleteBlog,
  likeBlog,
};
