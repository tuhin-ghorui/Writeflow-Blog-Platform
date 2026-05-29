import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, ShieldAlert, Key, Edit, Heart, Eye, FileText, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=John',
  'https://api.dicebear.com/7.x/lorelei/svg?seed=Sara',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Robo',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Smile',
];

const Profile = () => {
  const { user, updateProfileState } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [stats, setStats] = useState({ totalBlogs: 0, totalViews: 0, totalLikes: 0 });
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const data = await api.get('/users/profile');
        setStats(data.stats);
        
        // Populate profile form
        setFullName(data.user.fullName);
        setUsername(data.user.username);
        setEmail(data.user.email);
        setAvatar(data.user.avatar);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!fullName || !username || !email) {
      return toast.error('Name, username, and email are required');
    }

    try {
      setUpdatingProfile(true);
      const updatedUser = await api.put('/users/profile', {
        fullName,
        username,
        email,
        avatar,
      });
      updateProfileState(updatedUser);
      toast.success('Profile details updated successfully!');
    } catch (error) {
      console.error('Error updating profile details:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please enter all password fields');
    }

    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    try {
      setUpdatingPassword(true);
      await api.put('/users/profile', {
        currentPassword,
        newPassword,
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse py-8">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 w-1/4 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-200 dark:bg-slate-800 h-64 rounded-2xl"></div>
          <div className="bg-slate-200 dark:bg-slate-800 h-96 lg:col-span-2 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-4">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-8 h-8 text-primary-500" />
          My Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Customize your writer profile details and password security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar Details & Stats Summary */}
        <div className="space-y-6">
          {/* Avatar card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto">
              <img
                src={avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=user'}
                alt={fullName}
                className="w-full h-full rounded-full object-cover ring-4 ring-primary-500/10 shadow-sm"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{fullName}</h2>
              <p className="text-sm text-slate-400">@{username}</p>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-455">
              <Calendar className="w-3.5 h-3.5" />
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            {user.role === 'admin' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 border border-amber-250/30 text-amber-600 dark:text-amber-450 uppercase inline-block">
                System Admin
              </span>
            )}
          </div>

          {/* Stats card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Writer Stats
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><FileText className="w-4 h-4" /> Articles Published</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{stats.totalBlogs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><Eye className="w-4 h-4" /> Total Article Views</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{stats.totalViews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><Heart className="w-4 h-4" /> Total Article Likes</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{stats.totalLikes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Profile update form & Change Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary-500" />
              Edit Profile Details
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              {/* Avatar Selector Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Select Profile Avatar
                </label>
                <div className="grid grid-cols-6 gap-2 bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200 dark:border-slate-850 rounded-2xl">
                  {AVATAR_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAvatar(preset)}
                      className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                        avatar === preset ? 'border-primary-600 scale-105 shadow' : 'border-transparent'
                      }`}
                    >
                      <img src={preset} alt={`preset-${index}`} className="w-full h-full object-cover bg-slate-100 dark:bg-slate-900" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                    <User className="w-4 h-4 text-slate-400 mr-2.5" />
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm py-1.5"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label htmlFor="username" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Username
                  </label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                    <User className="w-4 h-4 text-slate-400 mr-2.5" />
                    <input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm py-1.5"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                  <Mail className="w-4 h-4 text-slate-400 mr-2.5" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm py-1.5"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-md disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {updatingProfile ? 'Saving...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary-500" />
              Change Password Security
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-5">
              {/* Current password */}
              <div className="space-y-1.5">
                <label htmlFor="currentPass" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Current Password
                </label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                  <Key className="w-4 h-4 text-slate-400 mr-2.5" />
                  <input
                    id="currentPass"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* New password */}
                <div className="space-y-1.5">
                  <label htmlFor="newPass" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    New Password
                  </label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                    <Key className="w-4 h-4 text-slate-400 mr-2.5" />
                    <input
                      id="newPass"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm py-1.5"
                    />
                  </div>
                </div>

                {/* Confirm New password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmNewPass" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Confirm New Password
                  </label>
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-1.5 focus-within:border-primary-500/40 transition-all">
                    <Key className="w-4 h-4 text-slate-400 mr-2.5" />
                    <input
                      id="confirmNewPass"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 text-sm py-1.5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-md disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  {updatingPassword ? 'Updating...' : 'Update Password Security'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
