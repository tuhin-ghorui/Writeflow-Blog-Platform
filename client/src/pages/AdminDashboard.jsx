import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShieldAlert, Users, FileText, MessageSquare, Eye, Trash2, Calendar, Clock, BookOpen, User } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'users' | 'blogs' | 'comments'
  const [loading, setLoading] = useState(true);

  // States
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalComments: 0,
    totalViews: 0,
    recentBlogs: [],
    recentUsers: [],
  });
  const [usersList, setUsersList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [commentsList, setCommentsList] = useState([]);

  // Fetch Stats (always needed on load)
  const fetchStats = async () => {
    try {
      const data = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load admin stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.get('/admin/users');
      setUsersList(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users list');
    }
  };

  const fetchBlogs = async () => {
    try {
      const data = await api.get('/blogs?limit=1000');
      setBlogsList(data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs list');
    }
  };

  const fetchComments = async () => {
    try {
      const data = await api.get('/admin/comments');
      setCommentsList(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments moderation list');
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchStats();
    if (activeTab === 'users') await fetchUsers();
    else if (activeTab === 'blogs') await fetchBlogs();
    else if (activeTab === 'comments') await fetchComments();
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    } else {
      navigate('/');
    }
  }, [user, activeTab]);

  const handleDeleteUser = async (userId) => {
    if (userId === user._id) return toast.error('You cannot delete your own admin account');
    if (!window.confirm('WARNING: Deleting a user will CASCADE and delete ALL their blog posts and comments. Are you sure?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User and all associated blogs/comments deleted');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to force delete this blog post? This will delete all comments on it too.')) return;

    try {
      await api.delete(`/blogs/${blogId}`);
      toast.success('Blog post deleted successfully');
      fetchBlogs();
      fetchStats();
    } catch (error) {
      toast.error(error.message || 'Failed to delete blog post');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      toast.success('Comment deleted successfully');
      fetchComments();
      fetchStats();
    } catch (error) {
      toast.error(error.message || 'Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse py-8">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 w-1/4 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, idx) => (
            <div key={idx} className="bg-slate-200 dark:bg-slate-800 h-28 rounded-2xl"></div>
          ))}
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-96 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-primary-500" />
          Admin Panel
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Monitor system metrics, manage users, and moderate user generated contents.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 gap-2">
        {['stats', 'users', 'blogs', 'comments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold capitalize transition-all border-b-2 -mb-0.5 ${
              activeTab === tab
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-850 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 1. STATS TAB VIEW */}
      {activeTab === 'stats' && (
        <div className="space-y-8 animate-fade-in">
          {/* Dashboard cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-450 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Users</p>
                <h3 className="text-2xl font-black text-slate-850 dark:text-white mt-0.5">{stats.totalUsers}</h3>
              </div>
            </div>

            {/* Total Blogs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-xl">
                <Feather className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Blogs</p>
                <h3 className="text-2xl font-black text-slate-850 dark:text-white mt-0.5">{stats.totalBlogs}</h3>
              </div>
            </div>

            {/* Total Comments */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Comments</p>
                <h3 className="text-2xl font-black text-slate-850 dark:text-white mt-0.5">{stats.totalComments}</h3>
              </div>
            </div>

            {/* Total Views */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-450 rounded-xl">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Views</p>
                <h3 className="text-2xl font-black text-slate-850 dark:text-white mt-0.5">{stats.totalViews}</h3>
              </div>
            </div>
          </div>

          {/* Recent lists grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Blogs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800/60">
                Recent Blog Uploads
              </h3>
              {stats.recentBlogs?.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No blogs found.</p>
              ) : (
                <div className="space-y-4">
                  {stats.recentBlogs?.map(post => (
                    <div key={post._id} className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <Link to={`/blog/${post.slug}`} className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-primary-655 hover:underline truncate block">
                          {post.title}
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">By @{post.author?.username || 'deleted'}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 flex-shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Users */}
            <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800/60">
                Recent User Registrations
              </h3>
              {stats.recentUsers?.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No users found.</p>
              ) : (
                <div className="space-y-4">
                  {stats.recentUsers?.map(usr => (
                    <div key={usr._id} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={usr.avatar} alt={usr.fullName} className="w-8 h-8 rounded-full object-cover" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{usr.fullName}</p>
                          <p className="text-xs text-slate-400 truncate">@{usr.username}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-455 flex-shrink-0">
                        {new Date(usr.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS TAB VIEW */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm animate-fade-in">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Registered Users ({usersList.length})</h2>
          </div>
          {usersList.length === 0 ? (
            <p className="text-center py-10 text-slate-400">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={usr.avatar} alt={usr.fullName} className="w-9 h-9 rounded-full object-cover" />
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{usr.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">@{usr.username}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{usr.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          usr.role === 'admin'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200/55 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/55'
                            : 'bg-slate-100 text-slate-655 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-400">{new Date(usr.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(usr._id)}
                          disabled={usr._id === user._id}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. BLOGS TAB VIEW */}
      {activeTab === 'blogs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm animate-fade-in">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Moderate Articles ({blogsList.length})</h2>
          </div>
          {blogsList.length === 0 ? (
            <p className="text-center py-10 text-slate-400">No blogs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4 text-center">Views</th>
                    <th className="px-6 py-4 text-center">Likes</th>
                    <th className="px-6 py-4">Date Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {blogsList.map((blog) => (
                    <tr key={blog._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'} alt={blog.title} className="w-12 h-8.5 rounded object-cover bg-slate-100 dark:bg-slate-800" />
                          <Link to={`/blog/${blog.slug}`} className="font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-primary-655 hover:underline max-w-xs truncate">
                            {blog.title}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">@{blog.author?.username || 'deleted'}</td>
                      <td className="px-6 py-4 text-center text-sm font-medium">{blog.views || 0}</td>
                      <td className="px-6 py-4 text-center text-sm font-medium">{blog.likes?.length || 0}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-400">{new Date(blog.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                          title="Delete Blog"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. COMMENTS TAB VIEW */}
      {activeTab === 'comments' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm animate-fade-in">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Moderate Comments ({commentsList.length})</h2>
          </div>
          {commentsList.length === 0 ? (
            <p className="text-center py-10 text-slate-400">No comments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
                    <th className="px-6 py-4">Comment Text</th>
                    <th className="px-6 py-4">By User</th>
                    <th className="px-6 py-4">On Blog Post</th>
                    <th className="px-6 py-4">Date Added</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {commentsList.map((comment) => (
                    <tr key={comment._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 max-w-sm break-words whitespace-pre-wrap">{comment.text}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">@{comment.user?.username || 'deleted'}</td>
                      <td className="px-6 py-4">
                        {comment.blog ? (
                          <Link to={`/blog/${comment.blog.slug}`} className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline max-w-xs truncate block">
                            {comment.blog.title}
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic text-sm">deleted post</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                          title="Delete Comment"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
