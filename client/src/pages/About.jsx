import React from 'react';
import { Feather, Shield, Compass, Sparkles, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-16 max-w-4xl mx-auto py-8">
      {/* 1. Header Section */}
      <div className="text-center space-y-4">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-500 to-primary-600 shadow-md">
          <Feather className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          About WriteFlow
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          WriteFlow is a premium blogging ecosystem built to empower creators, technical writers, and educators to share knowledge beautifully and securely.
        </p>
      </div>

      {/* 2. Core Story & Values */}
      <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
        <p className="text-slate-650 dark:text-slate-350 leading-relaxed text-base">
          We believe that sharing ideas is the engine of progress. However, standard blogging environments are either cluttered with advertisements or lack critical writer features.
        </p>
        <p className="text-slate-650 dark:text-slate-350 leading-relaxed text-base">
          WriteFlow resolves these issues by delivering a modern, distraction-free publishing dashboard combined with lightning-fast performance, dark mode settings, granular search tools, and robust security protocols.
        </p>
      </div>

      {/* 3. Key Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm text-center space-y-3">
          <div className="mx-auto flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-850 dark:text-slate-200">Creative Freedom</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Write using a feature-rich, markdown-supported editor, choose cover banners, tag relevant topics, and categorize articles effortlessly.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm text-center space-y-3">
          <div className="mx-auto flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-450">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-850 dark:text-slate-200">Community First</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Interact with writers via dynamic comment panels, express appreciation through content liking systems, and track post views.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm text-center space-y-3">
          <div className="mx-auto flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-850 dark:text-slate-200">Secure Architecture</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Powered by JSON Web Tokens, input sanitization middleware, rate limiters, helmet protections, and password hashing security.
          </p>
        </div>
      </div>

      {/* 4. Tech stack list */}
      <div className="bg-gradient-to-tr from-slate-900 to-slate-950 text-white rounded-3xl p-8 border border-slate-850 shadow-lg text-center space-y-4">
        <Sparkles className="w-6 h-6 text-primary-400 mx-auto" />
        <h2 className="text-2xl font-bold">Built with Modern Tech Stack</h2>
        <p className="text-slate-450 max-w-xl mx-auto text-sm">
          WriteFlow leverages a robust full-stack configuration combining a Vite-powered React UI, Express backend server, Mongoose MERN model integrations, and Tailwind styling.
        </p>
      </div>
    </div>
  );
};

export default About;
