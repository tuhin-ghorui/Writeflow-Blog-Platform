import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Feather, ArrowLeft, Image, Tags, FileText, Eye, Heading, Bold, Italic, Link as LinkIcon, Code } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology', 'Lifestyle', 'Business', 'Health', 'Travel', 'Design'];

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !summary || !content || !category) {
      return toast.error('Please enter all required fields');
    }

    try {
      setSubmitting(true);
      await api.post('/blogs', {
        title,
        summary,
        content,
        coverImage,
        category,
        tags,
      });
      toast.success('Blog post created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error(error.message || 'Failed to create blog post');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to inject Markdown tags
  const injectMarkdown = (type) => {
    const textarea = document.getElementById('editor-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    switch (type) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'header':
        replacement = `## ${selectedText || 'Header'}`;
        break;
      case 'link':
        replacement = `[${selectedText || 'Link Text'}](https://example.com)`;
        break;
      case 'code':
        replacement = `\`\`\`javascript\n${selectedText || 'console.log("hello");'}\n\`\`\``;
        break;
      default:
        break;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
    // Focus back and set cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  // Convert markdown to basic HTML for preview
  const renderPreview = () => {
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Feather className="w-6 h-6 text-primary-500" />
          Create New Article
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mastering React Context API"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-primary-500/40"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary-500/40 font-semibold"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Image URL */}
            <div className="space-y-1.5">
              <label htmlFor="coverImage" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Image className="w-3.5 h-3.5" /> Cover Image URL
              </label>
              <input
                id="coverImage"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-primary-500/40"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label htmlFor="tags" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Tags className="w-3.5 h-3.5" /> Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, webdev, javascript"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-primary-500/40"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <label htmlFor="summary" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Brief Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="summary"
              rows="2"
              required
              maxLength="300"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Provide a quick summary of the article..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-primary-500/40 resize-none"
            ></textarea>
          </div>

          {/* Editor/Preview tabs */}
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Article Body Content <span className="text-red-500">*</span>
              </label>
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !previewMode ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    previewMode ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
              </div>
            </div>

            {/* Custom text editing helpers (Visible only in editor mode) */}
            {!previewMode && (
              <div className="flex flex-wrap gap-1 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850/60 rounded-xl">
                <button type="button" onClick={() => injectMarkdown('header')} className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Add Header"><Heading className="w-4 h-4" /></button>
                <button type="button" onClick={() => injectMarkdown('bold')} className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Add Bold"><Bold className="w-4 h-4" /></button>
                <button type="button" onClick={() => injectMarkdown('italic')} className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Add Italic"><Italic className="w-4 h-4" /></button>
                <button type="button" onClick={() => injectMarkdown('link')} className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Add Link"><LinkIcon className="w-4 h-4" /></button>
                <button type="button" onClick={() => injectMarkdown('code')} className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg" title="Add Code Block"><Code className="w-4 h-4" /></button>
              </div>
            )}

            {/* Body text wrapper */}
            {previewMode ? (
              <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 min-h-[300px] overflow-y-auto blog-content" dangerouslySetInnerHTML={{ __html: renderPreview() || '<p class="text-slate-400 italic">No content to preview...</p>' }}>
              </div>
            ) : (
              <textarea
                id="editor-textarea"
                rows="14"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article body here... Supports markdown formatting. Use buttons above for bold, italic, links, and code blocks."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-6 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:border-primary-500/40 font-mono"
              ></textarea>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <Link
              to="/dashboard"
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/30 text-slate-600 dark:text-slate-400 text-sm font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {submitting ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
