'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import gsap from 'gsap';
import { Mail, Lock, User, MapPin, ArrowRight, Loader2, Sparkles, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function SignupPage() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 3D Panel text entrance
      gsap.from('.spline-text', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.2
      });

      // Form panel entrance
      gsap.from('.auth-panel', {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
      
      // Form elements stagger
      gsap.from('.anim-item', {
        y: 20,
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.4
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Validation Shake
  React.useEffect(() => {
    if (error) {
      gsap.fromTo('.error-shake', 
        { x: -6 }, 
        { x: 6, duration: 0.06, yoyo: true, repeat: 5, ease: 'sine.inOut', onComplete: () => gsap.set('.error-shake', { x: 0 }) }
      );
    }
  }, [error]);

  const supabase = createClient();

  const handleSuccess = () => {
    router.push('/profile-setup');
    router.refresh();
  };

  const handleDemoAuth = () => {
    router.push('/profile-setup');
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            state,
          }
        }
      });
      if (error) throw error;
      handleSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Signup failed.');
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/profile-setup`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign up failed.');
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const onGithubSignUp = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/profile-setup`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'GitHub sign up failed.');
      setDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] w-full h-full flex flex-col lg:flex-row-reverse bg-white dark:bg-[#0a0a0a] overflow-hidden"
      ref={containerRef}
    >
      {/* RIGHT: IMAGE PANEL (Mirrored for signup) */}
      <div className="relative w-full lg:flex-1 lg:w-1/2 h-[40vh] lg:h-screen bg-gradient-to-br from-[#14532d] via-[#0f3f22] to-[#05140b] overflow-hidden flex flex-col justify-between">
        <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_50%_50%,rgba(163,230,53,0.15),transparent_60%)] pointer-events-none" />
        
        {/* Farm Image Background */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/images/auth-bg.png" 
            alt="AgroPulse Farm Drone Shot" 
            fill 
            className="object-cover opacity-60 mix-blend-luminosity"
            priority
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-8 lg:p-14 flex flex-col h-full justify-between pointer-events-none">
          <div className="spline-text flex items-center gap-3 justify-end lg:justify-start">
            <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center text-[#05140b] shadow-lg shadow-lime-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight font-display">AgroPulse</span>
          </div>

          <div className="mb-4 lg:mb-16">
            <h1 className="spline-text text-4xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight font-display">
              Plant the seeds.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-300">Reap the future.</span>
            </h1>
            <p className="spline-text text-green-100/80 text-lg max-w-md font-medium leading-relaxed">
              Create your account to unlock powerful farming tools, real-time market insights, and expert community support.
            </p>
          </div>
        </div>
      </div>

      {/* LEFT: AUTH FORM */}
      <div className="w-full lg:flex-1 lg:w-1/2 h-[60vh] lg:h-screen p-6 lg:p-12 auth-panel overflow-y-auto">
        <div className="w-full max-w-md mx-auto min-h-full flex flex-col justify-center py-8">
          <div className="mb-8 anim-item">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight font-display">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Join thousands of modern farmers today.</p>
          </div>

          {error && (
            <div className="error-shake mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {demoMode && (
            <div className="mb-8 p-5 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 rounded-2xl anim-item text-center">
              <p className="text-orange-800 dark:text-orange-300 font-bold mb-4 text-sm">Demo Mode Active</p>
              <button
                onClick={handleDemoAuth}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5"
              >
                Enter as Demo User
              </button>
            </div>
          )}

          <form onSubmit={onSignup} className="space-y-5">
            <div className="anim-item">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-lime-500 transition-colors">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-gray-900 dark:text-white font-semibold transition-all outline-none"
                  placeholder="Ramesh Kumar"
                  required
                />
              </div>
            </div>

            <div className="anim-item">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-lime-500 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-gray-900 dark:text-white font-semibold transition-all outline-none"
                  placeholder="farmer@agropulse.com"
                  required
                />
              </div>
            </div>


            <div className="anim-item">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">State</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-lime-500 transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-gray-900 dark:text-white font-semibold transition-all outline-none appearance-none"
                  required
                >
                  <option value="" disabled className="text-gray-400">Select your state</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s} className="text-gray-900">{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 anim-item">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-lime-500 transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-gray-900 dark:text-white font-semibold transition-all outline-none"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Confirm</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-lime-500 transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 text-gray-900 dark:text-white font-semibold transition-all outline-none"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 mt-8 rounded-2xl shadow-lg shadow-lime-500/20 text-sm font-bold text-[#0a1f11] bg-lime-400 hover:bg-lime-300 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50 disabled:hover:translate-y-0 dark:focus:ring-offset-[#0a0a0a]"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
            </button>
          </form>



          <div className="mt-8 anim-item">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white dark:bg-[#0a0a0a] text-gray-500 font-bold uppercase tracking-wider">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                type="button"
                onClick={onGoogleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50 transition-all dark:focus:ring-offset-[#0a0a0a]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={onGithubSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:opacity-50 transition-all dark:focus:ring-offset-[#0a0a0a]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm font-medium text-gray-500 dark:text-gray-400 anim-item">
            Already have an account?{' '}
            <Link href="/auth" className="font-bold text-lime-600 dark:text-lime-400 hover:text-lime-500 transition-colors">
              Login <ArrowRight className="inline w-4 h-4 ml-0.5 relative -top-[1px]" />
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
