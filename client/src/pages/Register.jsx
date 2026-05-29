import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Key, Feather, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=John',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Sara',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robo',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Smile',
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password || !confirmPassword) {
      return toast.error('Please enter all fields');
    }

    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      setSubmitting(true);
      await register(fullName, username, email, password, avatar);
      toast.success('Registration successful! Welcome to WriteFlow!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-8 rounded-3xl shadow-lg relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-500 to-primary-600 shadow-md shadow-primary-500/25">
            <Feather className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Create account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
              Log in instead
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          
          {/* Avatar Selector Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Choose Avatar Profile Picture
            </label>
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex-shrink-0">
                <img
                  src={avatar}
                  alt="Selected avatar"
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-primary-500/20"
                />
              </div>
              <div className="grid grid-cols-6 gap-2 ml-4">
                {AVATAR_PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                      avatar === preset ? 'border-primary-600 scale-105' : 'border-transparent'
                    }`}
                  >
                    <img src={preset} alt={`preset-${index}`} className="w-full h-full object-cover bg-slate-100 dark:bg-slate-900" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Full name input */}
            <div className="space-y-1">
              <label htmlFor="fullName" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Full Name
              </label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                <User className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm py-1.5"
                />
              </div>
            </div>

            {/* Username input */}
            <div className="space-y-1">
              <label htmlFor="username" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Username
              </label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                <User className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm py-1.5"
                />
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Email Address
              </label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                <Mail className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm py-1.5"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Password
              </label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                <Lock className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm py-1.5"
                />
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                <Key className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm py-1.5"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-3.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
