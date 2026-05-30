import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import { Calendar, Eye, Heart, BookOpen, Share2, ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Convert markdown to basic HTML
const renderMarkdown = (content) => {
  if (!content) return '';
  let html = content;
  // Escaping dangerous scripts (handled in middleware too)
  html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '');

  // Paragraph breaks
  html = html.split('\n\n').map(p => {
    if (p.startsWith('#') || p.startsWith('`') || p.startsWith('-') || p.startsWith('>')) return p;
    return `<p>${p.replace(/\n/g, '<br />')}</p>`;
  }).join('\n\n');

  // Simple Markdown translation
  html = html
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/# (.*)/g, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^\s*-\s*(.*)/gm, '<li>$1</li>')
    .replace(/<li>(.*)<\/li>/g, '<ul><li>$1</li></ul>') // Wrap in ul loosely
    .replace(/<\/ul>\n<ul>/g, '') // Flatten lists
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/^\s*>\s*(.*)/gm, '<blockquote>$1</blockquote>');

  return html;
};

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        // Fetch blog by slug or ID
        const data = await api.get(`/blogs/${slug}`);
        setBlog(data);
        setLikesCount(data.likes ? data.likes.length : 0);

        // Check if current user has liked the blog
        if (user && data.likes) {
          setLiked(data.likes.includes(user._id));
        }

        // Fetch related posts (same category, limit 4)
        if (data.category) {
          const related = await api.get(`/blogs?category=${encodeURIComponent(data.category)}&limit=4`);
          // Filter out current post
          const filteredRelated = (related.blogs || []).filter(item => item._id !== data._id);
          setRelatedPosts(filteredRelated.slice(0, 3));
        }

        // Fetch popular posts (most viewed, limit 3)
        const popular = await api.get('/blogs?sort=most-viewed&limit=3');
        // Filter out current post
        const filteredPopular = (popular.blogs || []).filter(item => item._id !== data._id);
        setPopularPosts(filteredPopular.slice(0, 3));

      } catch (error) {
        console.error('Error fetching blog detail:', error);
        toast.error('Blog post not found');
        navigate('/blogs');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogDetail();
    }
  }, [slug, user, navigate]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error('Please log in to like this post');
      navigate('/login');
      return;
    }

    try {
      const data = await api.post(`/blogs/${blog._id}/like`);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
      if (data.liked) {
        toast.success('Liked post');
      } else {
        toast.success('Unliked post');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to toggle like');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleBlogDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post? This will delete all comments associated with it.')) return;

    try {
      await api.delete(`/blogs/${blog._id}`);
      toast.success('Blog deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(error.message || 'Failed to delete blog post');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 py-12 max-w-4xl mx-auto animate-pulse">
        <div className="bg-slate-200 dark:bg-slate-800 h-96 w-full rounded-3xl"></div>
        <div className="space-y-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 w-3/4 rounded-lg"></div>
          <div className="flex space-x-3 items-center">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/4 rounded"></div>
              <div className="h-3.5 bg-slate-200 dark:bg-slate-800 w-1/6 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  const readTime = Math.max(1, Math.ceil(blog.content.split(' ').length / 200));

  return (
    <div className="space-y-12">
      {/* Back CTA Button */}
      <div>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>

      {/* Main Post Section Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Blog Post Content (2/3 columns) */}
        <article className="lg:col-span-2 space-y-8">
          {/* Header Metadata */}
          <div className="space-y-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40 text-primary-600 dark:text-primary-400 tracking-wide uppercase inline-block">
              {blog.category}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {blog.title}
            </h1>
            
            {/* Meta details */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 pb-6 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center space-x-3.5">
                <img
                  src={blog.author?.avatar}
                  alt={blog.author?.fullName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/10"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{blog.author?.fullName}</p>
                  <p className="text-xs text-slate-400">@{blog.author?.username}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> {readTime} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> {blog.views || 0} views
                </span>
              </div>
            </div>
          </div>

          {/* Large Banner Image */}
          {blog.coverImage && (
            <div className="h-[350px] sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-md">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Actions Bar (Like, Share, and Edit/Delete for Author/Admin) */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-4.5 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                  liked
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200/50 dark:border-red-900/50 text-red-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                <Heart className={`w-4.5 h-4.5 ${liked ? 'fill-red-500' : ''}`} />
                {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all"
              >
                <Share2 className="w-4.5 h-4.5" />
                Share
              </button>
            </div>

            {/* Author/Admin edit controls */}
            {user && (user._id === blog.author?._id || user.role === 'admin') && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/edit-blog/${blog._id}`}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all"
                  title="Edit Blog"
                >
                  <Edit3 className="w-4.5 h-4.5" />
                </Link>
                <button
                  onClick={handleBlogDelete}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                  title="Delete Blog"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            )}
          </div>

          {/* HTML rendered Content */}
          <div
            className="blog-content leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }}
          ></div>

          {/* Tags list */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
              {blog.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blogs?tag=${tag}`}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Comments Widget */}
          <CommentSection blogId={blog._id} />

        </article>

        {/* Sidebar (1/3 column) */}
        <aside className="space-y-8">
          {/* Related Articles Widget */}
          {relatedPosts.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800/60">
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedPosts.map(post => (
                  <div key={post._id} className="flex gap-3 group">
                    {post.coverImage && (
                      <Link to={`/blog/${post.slug}`} className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-primary-655 dark:hover:text-primary-400 transition-colors line-clamp-2 leading-snug"
                      >
                        {post.title}
                      </Link>
                      <p className="text-[11px] text-slate-400 mt-1">
                        By {post.author?.fullName.split(' ')[0]} • {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Posts Widget */}
          {popularPosts.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800/60">
                Popular Articles
              </h3>
              <div className="space-y-4">
                {popularPosts.map(post => (
                  <div key={post._id} className="flex gap-3 group">
                    {post.coverImage && (
                      <Link to={`/blog/${post.slug}`} className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-primary-655 dark:hover:text-primary-400 transition-colors line-clamp-2 leading-snug"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {post.views || 0}</span>
                        <span className="flex items-center gap-0.5"><Heart className="w-3 h-3 text-red-500" /> {post.likes?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
};

export default BlogDetails;
