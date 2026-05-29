import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 shadow-md">
                <Feather className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-400">
                WriteFlow
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              WriteFlow is a modern SaaS blogging platform where great ideas find their audience. Express yourself, build your audience, and read what matters.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white tracking-wider uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Preset Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white tracking-wider uppercase mb-4">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/blogs?category=Technology" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/blogs?category=Lifestyle" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link to="/blogs?category=Business" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/blogs?category=Health" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Health
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} WriteFlow. All rights reserved.</p>
          <p className="flex items-center mt-2 md:mt-0">
            Made with <Heart className="w-3.5 h-3.5 mx-1 text-red-500 fill-red-500" /> by Antigravity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
