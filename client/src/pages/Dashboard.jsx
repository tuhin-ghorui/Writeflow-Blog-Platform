import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LayoutDashboard, FileText, Eye, Heart, Plus, Edit2, Trash2, BookOpen, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch user profile statistics
      const profileData = await api.get('/users/profile');
      setStats(profileData.stats);

      // Fetch user's blogs
      const blogsData = await api.get(`/blogs?author=${user._id}&limit=100`);
      setBlogs(blogsData.blogs || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) return;

    try {
      await api.delete(`/blogs/${blogId}`);
      toast.success('Blog deleted successfully');
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(error.message || 'Failed to delete blog');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse py-8">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 w-1/4 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, idx) => (
            <div key={idx} className="bg-slate-200 dark:bg-slate-800 h-28 rounded-2xl"></div>
          ))}
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-96 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-primary-500" />
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your articles, analyze reading stats, and write new stories.
          </p>
        </div>
        <Link
          to="/create-blog"
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/35 transition-all flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Create Blog Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Blogs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Your Blogs</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{stats.totalBlogs}</h3>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Views</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{stats.totalViews}</h3>
          </div>
        </div>

        {/* Total Likes */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-655 dark:text-red-400 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Likes</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{stats.totalLikes}</h3>
          </div>
        </div>
      </div>

      {/* Blogs list table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Articles</h2>
        </div>

        {blogs.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-350 dark:text-slate-700 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">You haven't written any posts yet</h3>
              <p className="text-slate-400 text-sm">Create your first blog post and share your knowledge with WriteFlow readers.</p>
            </div>
            <Link
              to="/create-blog"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md"
            >
              <Plus className="w-4 h-4" /> Start Writing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-center">Views</th>
                  <th className="px-6 py-4 text-center">Likes</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                    {/* Title and image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4.5">
                        <img
                          src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
                          alt={blog.title}
                          className="w-16 h-11.5 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                        />
                        <div className="min-w-0 max-w-[280px] sm:max-w-sm">
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="font-bold text-slate-800 dark:text-slate-200 hover:text-primary-655 dark:hover:text-primary-400 transition-colors truncate block"
                          >
                            {blog.title}
                          </Link>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{blog.summary}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40">
                        {blog.category}
                      </span>
                    </td>

                    {/* Views */}
                    <td className="px-6 py-4 text-center font-semibold text-sm text-slate-700 dark:text-slate-300">
                      {blog.views || 0}
                    </td>

                    {/* Likes */}
                    <td className="px-6 py-4 text-center font-semibold text-sm text-slate-700 dark:text-slate-300">
                      {blog.likes?.length || 0}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/edit-blog/${blog._id}`}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
