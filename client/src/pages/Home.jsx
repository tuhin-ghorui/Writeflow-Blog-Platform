import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SkeletonCard from '../components/SkeletonCard';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Eye, Heart, Search, Calendar, User, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { name: 'Technology', count: '12 Posts', color: 'from-blue-500 to-cyan-500', icon: '💻' },
  { name: 'Lifestyle', count: '8 Posts', color: 'from-pink-500 to-rose-500', icon: '🌿' },
  { name: 'Business', count: '6 Posts', color: 'from-emerald-500 to-teal-500', icon: '📈' },
  { name: 'Health', count: '9 Posts', color: 'from-amber-500 to-orange-500', icon: '❤️' },
  { name: 'Travel', count: '15 Posts', color: 'from-purple-500 to-indigo-500', icon: '✈️' },
  { name: 'Design', count: '4 Posts', color: 'from-violet-500 to-fuchsia-500', icon: '🎨' },
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch latest blogs
        const latestData = await api.get('/blogs?limit=3');
        setLatestBlogs(latestData.blogs || []);

        // Fetch featured/popular blog (most viewed)
        const popularData = await api.get('/blogs?sort=most-viewed&limit=1');
        if (popularData.blogs && popularData.blogs.length > 0) {
          setFeaturedBlog(popularData.blogs[0]);
        }
      } catch (error) {
        console.error('Error fetching landing page data:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-20">
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-20 text-center rounded-3xl overflow-hidden bg-gradient-to-tr from-slate-900 via-slate-900 to-primary-950 dark:from-slate-950 dark:via-slate-950 dark:to-primary-950 border border-slate-800 text-white shadow-2xl px-6 md:px-12 animate-fade-in">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_60%)] pointer-events-none"></div>
        <div className="relative max-w-3xl space-y-8 z-10">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary-500/10 border border-primary-500/20 text-primary-400 tracking-wide uppercase inline-block">
            ✨ Welcome to the Writing Revolution
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Share Your Ideas <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
              With The World
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            WriteFlow is a fast, beautiful, and secure platform where writers and creative minds express themselves, gain followers, and share valuable knowledge.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/15 focus-within:border-primary-500/50 transition-all">
            <div className="flex items-center flex-1 px-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search articles, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 outline-none focus:ring-0 text-white placeholder-slate-400 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all active:scale-[0.98]"
            >
              Search
            </button>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to={user ? "/create-blog" : "/register"}
              className="px-8 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-bold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all flex items-center gap-2 group hover:-translate-y-0.5"
            >
              Start Writing <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/blogs"
              className="px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 hover:border-white/20 transition-all"
            >
              Explore Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Popular Categories</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Explore trending topics on WriteFlow</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              to={`/blogs?category=${category.name}`}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 text-center shadow-sm hover:shadow-md hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-bold text-slate-850 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{category.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Post */}
      {featuredBlog && !loading && (
        <section className="space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Featured Post</h2>
          </div>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow p-6 lg:p-8">
            <Link to={`/blog/${featuredBlog.slug}`} className="block h-64 lg:h-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
              <img
                src={featuredBlog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
                alt={featuredBlog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-primary-600/90 text-white backdrop-blur shadow-sm">
                  {featuredBlog.category}
                </span>
              </div>
            </Link>
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <BookOpen className="w-3.5 h-3.5" />
                  {Math.max(1, Math.ceil(featuredBlog.content.split(' ').length / 200))} min read
                </span>
                <Link to={`/blog/${featuredBlog.slug}`}>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-tight">
                    {featuredBlog.title}
                  </h3>
                </Link>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base">
                  {featuredBlog.summary}
                </p>
              </div>

              {/* Author and stats */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <div className="flex items-center space-x-3">
                  <img
                    src={featuredBlog.author.avatar}
                    alt={featuredBlog.author.fullName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/10"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{featuredBlog.author.fullName}</p>
                    <p className="text-xs text-slate-400">@{featuredBlog.author.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> {featuredBlog.views || 0}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500/10" /> {featuredBlog.likes?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Latest Blogs Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Latest Articles</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated with fresh posts from our community</p>
          </div>
          <Link
            to="/blogs"
            className="hidden sm:flex items-center gap-1 text-sm font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-all group"
          >
            See all posts <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, idx) => <SkeletonCard key={idx} />)
          ) : latestBlogs.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No blog posts found</h3>
              <p className="text-slate-400 mt-1">Be the first to publish a post on WriteFlow!</p>
              <Link to="/create-blog" className="mt-4 inline-block px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm">
                Create Post
              </Link>
            </div>
          ) : (
            latestBlogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary-500/20 dark:hover:border-primary-500/20 hover:-translate-y-1 transition-all flex flex-col h-full"
              >
                <Link to={`/blog/${blog.slug}`} className="block h-52 overflow-hidden bg-slate-100 dark:bg-slate-850 relative group">
                  <img
                    src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur shadow-sm">
                      {blog.category}
                    </span>
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-grow space-y-4">
                  <div className="space-y-2 flex-grow">
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      {Math.max(1, Math.ceil(blog.content.split(' ').length / 200))} min read
                    </span>
                    <Link to={`/blog/${blog.slug}`}>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-snug line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                      {blog.summary}
                    </p>
                  </div>

                  {/* Author and stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/40">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={blog.author.avatar}
                        alt={blog.author.fullName}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/10"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">{blog.author.fullName.split(' ')[0]}</p>
                        <p className="text-[10px] text-slate-400">@{blog.author.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {blog.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500" /> {blog.likes?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="text-center sm:hidden pt-4">
          <Link
            to="/blogs"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
          >
            See all posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
