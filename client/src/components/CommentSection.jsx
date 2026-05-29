import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Send, Trash2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CommentSection = ({ blogId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/comments/${blogId}`);
        setComments(data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const commentData = await api.post('/comments', {
        blogId,
        text: newComment.trim(),
      });

      // Instantly add to comments array
      setComments(prev => [commentData, ...prev]);
      setNewComment('');
      toast.success('Comment posted successfully');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error(error.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      // Instantly remove from list
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="space-y-8 bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800/60 pb-4">
        <MessageSquare className="w-5.5 h-5.5 text-primary-500" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Discussion ({comments.length})
        </h3>
      </div>

      {/* Add Comment Box */}
      {user ? (
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <div className="flex space-x-3 items-start">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-500/10"
            />
            <div className="flex-1 relative">
              <textarea
                rows="3"
                placeholder="Share your thoughts on this post..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/25 resize-none transition-all"
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-md shadow-primary-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/60 p-5 rounded-2xl text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              Log In
            </Link>{' '}
            or{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
              Sign Up
            </Link>{' '}
            to participate in the discussion.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {Array(2).fill(0).map((_, idx) => (
              <div key={idx} className="flex gap-3 animate-pulse">
                <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/4 rounded"></div>
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 w-full rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500">
            <p className="text-sm">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-4.5 pt-6 first:pt-0 group">
                <img
                  src={comment.user?.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=user'}
                  alt={comment.user?.fullName}
                  className="w-9.5 h-9.5 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                />
                <div className="flex-grow space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {comment.user?.fullName}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 font-medium">
                        @{comment.user?.username}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        • {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Delete action */}
                    {user && (user._id === comment.user?._id || user.role === 'admin') && (
                      <button
                        onClick={() => handleCommentDelete(comment._id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed break-words whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
