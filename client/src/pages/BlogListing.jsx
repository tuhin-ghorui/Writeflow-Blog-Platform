import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import SkeletonCard from '../components/SkeletonCard';
import { Search, Calendar, Eye, Heart, BookOpen, ChevronLeft, ChevronRight, X, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORY_LIST = ['Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Design'];

const BlogListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalBlogs: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 6
  });

  // Extract query filters from URL search params
  const categoryParam = searchParams.get('category') || '';
  const tagParam = searchParams.get('tag') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'latest'; // 'latest' | 'most-viewed' | 'popular'
  const pageParam = parseInt(searchParams.get('page')) || 1;

  const [searchInput, setSearchInput] = useState(searchParam);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Build query string
        const params = new URLSearchParams();
        if (categoryParam) params.append('category', categoryParam);
        if (tagParam) params.append('tag', tagParam);
        if (searchParam) params.append('search', searchParam);
        if (sortParam) params.append('sort', sortParam);
        params.append('page', pageParam.toString());
        params.append('limit', '6');

        const data = await api.get(`/blogs?${params.toString()}`);
        setBlogs(data.blogs || []);
        setPagination(data.pagination || { totalBlogs: 0, totalPages: 1, currentPage: 1, limit: 6 });
      } catch (error) {
        console.error('Error fetching blogs list:', error);
        toast.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [categoryParam, tagParam, searchParam, sortParam, pageParam]);

  // Update query params helper
  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        updated.delete(key);
      } else {
        updated.set(key, value.toString());
      }
    });
    // Reset to page 1 on filter change, unless updating page specifically
    if (!newParams.page) {
      updated.set('page', '1');
    }
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Explore Articles
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-base">
          Discover insights, tutorials, and stories from developers and creators.
        </p>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white dark:bg-slate-900 p-4 border border-slate-150/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-grow flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 rounded-xl px-3 py-1.5 focus-within:border-primary-500/40 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm py-1"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateParams({ search: '' });
              }}
              className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </form>

        {/* Sorting and Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort By:
            </span>
            <select
              value={sortParam}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="text-sm font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:border-primary-500/40"
            >
              <option value="latest">Latest Posts</option>
              <option value="most-viewed">Most Viewed</option>
              <option value="popular">Most Liked</option>
            </select>
          </div>

          {/* Clear Filters CTA */}
          {(categoryParam || tagParam || searchParam) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 transition-colors flex items-center gap-1.5"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Chips Selection */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          onClick={() => updateParams({ category: '' })}
          className={`px-4.5 py-2 rounded-xl text-sm font-semibold transition-all ${
            !categoryParam
              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/10'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          All Topics
        </button>
        {CATEGORY_LIST.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParams({ category: cat })}
            className={`px-4.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              categoryParam.toLowerCase() === cat.toLowerCase()
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/10'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active filters summary */}
      {tagParam && (
        <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/40 px-4 py-2 rounded-xl w-fit text-sm">
          <span className="text-primary-700 dark:text-primary-400 font-semibold">Active Tag: #{tagParam}</span>
          <button
            onClick={() => updateParams({ tag: '' })}
            className="p-0.5 rounded-full bg-primary-200/50 dark:bg-primary-850 hover:bg-primary-200 text-primary-800 dark:text-primary-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(6).fill(0).map((_, idx) => <SkeletonCard key={idx} />)
        ) : blogs.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No posts found</h3>
            <p className="text-slate-400 mt-1">Try adjusting your keywords or clearing the active filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          blogs.map((blog) => (
            <article
              key={blog._id}
              className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary-500/25 dark:hover:border-primary-500/25 hover:-translate-y-1 transition-all flex flex-col h-full"
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
                    <BookOpen className="w-3.5 h-3.5" />
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

                {/* Tags rendering */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {blog.tags.slice(0, 3).map(tag => (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateParams({ tag });
                        }}
                        className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* Author and stats */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/40">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={blog.author?.avatar}
                      alt={blog.author?.fullName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/10"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                        {blog.author?.fullName}
                      </p>
                      <p className="text-[10px] text-slate-400">@{blog.author?.username}</p>
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

      {/* Pagination Controls */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 pt-8">
          <button
            onClick={() => updateParams({ page: pageParam - 1 })}
            disabled={pageParam === 1}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-slate-655" />
          </button>
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => updateParams({ page: pageParam + 1 })}
            disabled={pageParam === pagination.totalPages}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-slate-655" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogListing;
