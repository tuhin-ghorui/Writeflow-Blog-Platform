import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, Feather, LayoutDashboard, User, LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-slate-200/80 dark:border-slate-800/80 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-primary-600 shadow-md shadow-primary-500/25">
                <Feather className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-400">
                WriteFlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 font-medium transition-colors">
              Home
            </Link>
            <Link to="/blogs" className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 font-medium transition-colors">
              Blogs
            </Link>
            <Link to="/about" className="text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 font-medium transition-colors">
              About
            </Link>
          </div>

          {/* Right actions (Theme toggle + Auth) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800/80 transition-all border border-slate-200/50 dark:border-slate-800/50"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  id="user-menu-btn"
                  className="flex items-center space-x-3 p-1.5 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 transition-all"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-500/20"
                    src={user.avatar}
                    alt={user.fullName}
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.fullName.split(' ')[0]}</span>
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 py-1.5 z-20 animate-slide-up origin-top-right">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400 dark:text-slate-500">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2.5 text-slate-400" />
                        Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-2.5 text-slate-400" />
                        My Profile
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors font-medium border-t border-slate-100 dark:border-slate-800 mt-1"
                        >
                          <Shield className="w-4 h-4 mr-2.5" />
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4.5 py-2 text-sm font-semibold text-slate-700 hover:text-primary-600 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900 transition-colors"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-4 px-6 space-y-4 animate-slide-up">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/blogs"
            onClick={() => setIsOpen(false)}
            className="block text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-colors"
          >
            Blogs
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white transition-colors"
          >
            About
          </Link>

          <hr className="border-slate-100 dark:border-slate-800" />

          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 pb-2">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.fullName}
                />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.fullName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{user.email}</p>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center py-2 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600"
              >
                <LayoutDashboard className="w-5 h-5 mr-3 text-slate-400" />
                Dashboard
              </Link>

              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center py-2 text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600"
              >
                <User className="w-5 h-5 mr-3 text-slate-400" />
                My Profile
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center py-2 text-base font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex w-full items-center py-2 text-base font-semibold text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-slate-700 hover:text-primary-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold shadow-lg shadow-primary-500/20 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
