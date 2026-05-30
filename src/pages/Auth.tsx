import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { auth } from '../lib/firebase';

// Initialize Firestore
const db = getFirestore();

type AuthMethod = 'email' | 'google';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const createUserProfile = async (user: any, additionalData = {}) => {
    try {
      const userRef = doc(db, 'profiles', user.uid);
      await setDoc(
        userRef,
        {
          email: user.email,
          display_name: user.displayName || user.email?.split('@')[0] || 'Anonymous User',
          phone: user.phoneNumber,
          avatar_url: user.photoURL,
          created_at: serverTimestamp(),
          ...additionalData
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password must be at least 8 chars, with uppercase, lowercase, number & special character.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const profileCreated = await createUserProfile(user, { provider: 'email' });
      if (!profileCreated) {
        throw new Error('Failed to create user profile');
      }

      toast.success('Signup successful! Please check your email to verify your account.');
      navigate('/');
    } catch (error: any) {
      console.error('Error signing up:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error('Failed to sign up. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Sign in successful!');
      navigate('/');
    } catch (error: any) {
      console.error('Error signing in:', error);
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email.');
          break;
        case 'auth/wrong-password':
          toast.error('Incorrect password.');
          break;
        case 'auth/too-many-requests':
          toast.error('Too many failed login attempts. Please try again later.');
          break;
        case 'auth/user-disabled':
          toast.error('This account has been disabled.');
          break;
        default:
          toast.error('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const profileCreated = await createUserProfile(user, { provider: 'google' });
      if (!profileCreated) {
        throw new Error('Failed to create user profile');
      }

      toast.success('Signed in with Google!');
      navigate('/');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error(`Failed to sign in with Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email first');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast.error(`Failed to send reset email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Error setting auth persistence:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.providerData[0]?.providerId === 'password' && !user.emailVerified) {
          toast('Please verify your email address for full access.', {
            icon: '⚠️',
            style: {
              borderRadius: '10px',
              background: '#FFF3CD',
              color: '#856404',
            },
          });
        }
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const heroFeatures = [
    {
      title: 'Safe & Confidential',
      desc: 'Your privacy is our top priority.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V6l-8-3-8 3v6c0 6 8 10 8 10Z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      bg: 'bg-pink-50',
      fg: 'text-pink-500',
    },
    {
      title: 'Supportive Community',
      desc: 'Connect with people who understand.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      bg: 'bg-violet-50',
      fg: 'text-violet-500',
    },
    {
      title: 'Share & Heal',
      desc: 'Share your story and inspire others.',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
      ),
      bg: 'bg-rose-50',
      fg: 'text-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#fff8fb] dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-0 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-500/10" />
        <div className="absolute top-1/4 right-0 h-72 w-72 rounded-full bg-fuchsia-200/25 blur-3xl dark:bg-fuchsia-500/10" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-200/25 blur-3xl dark:bg-violet-500/10" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-20 sm:px-6 lg:px-8">

        {/* main content */}
        <main className="grid flex-1 items-center gap-10 pb-4 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-4">
          {/* left hero */}
          <section className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-300">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Join SafeVoice
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.02]">
              Create your{' '} <br/>
              <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
                Safe Space
              </span>
            </h1>

            <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-500" />

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-900 dark:text-slate-300">
              A supportive community where your <br/>story matters and your voice is heard.
            </p>

            <div className="mt-10 space-y-5">
              {heroFeatures.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.bg} ${item.fg} ring-1 ring-black/5 dark:ring-white/10`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 hidden lg:block">
              <div className="relative h-56 w-full max-w-[26rem] overflow-hidden rounded-[2rem] border border-pink-100 bg-gradient-to-br from-white to-pink-50 shadow-[0_18px_50px_rgba(236,72,153,0.10)] dark:border-white/10 dark:from-white/5 dark:to-white/0">
                <div className="absolute left-6 top-6 h-20 w-20 rounded-full bg-pink-200/40 blur-2xl" />
                <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-fuchsia-200/40 blur-2xl" />

                <div className="absolute bottom-8 left-8 flex items-end gap-3">
                  <div className="h-20 w-12 rounded-t-full bg-pink-100/70 dark:bg-white/10" />
                  <div className="h-28 w-14 rounded-t-full bg-pink-200/60 dark:bg-white/10" />
                  <div className="h-16 w-12 rounded-t-full bg-pink-100/70 dark:bg-white/10" />
                </div>

                <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-pink-100 bg-white/85 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <svg viewBox="0 0 24 24" className="h-10 w-10 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22a7 7 0 0 0 7-7V9a7 7 0 0 0-14 0v6a7 7 0 0 0 7 7Z" />
                    <path d="M9 15h6" />
                  </svg>
                </div>

                <div className="absolute right-7 top-8 h-10 w-10 rounded-full bg-fuchsia-200/50 blur-xl" />
                <div className="absolute right-10 bottom-10 h-12 w-12 rounded-full bg-violet-200/50 blur-xl" />
              </div>
            </div>
          </section>

          {/* auth card */}
          <section className="relative z-10">
            <div className="rounded-[2rem] border border-pink-100 bg-white/95 p-5 shadow-[0_20px_60px_rgba(236,72,153,0.10)] backdrop-blur dark:border-white/10 dark:bg-white/[0.04] sm:p-6 lg:p-7">
              <div className="text-center">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {isSignUp ? 'Sign Up for SafeVoice' : 'Sign In to SafeVoice'}
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-semibold text-pink-600 transition hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>

              {/* auth tabs */}
              <div className="mt-6 flex items-center justify-center gap-6 border-b border-slate-200/80 px-2 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`relative flex items-center gap-2 px-4 pb-3 text-sm font-semibold transition ${
                    authMethod === 'email'
                      ? 'text-pink-600 dark:text-pink-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email
                  {authMethod === 'email' && (
                    <span className="absolute bottom-[-1px] left-0 h-0.5 w-full rounded-full bg-pink-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('google')}
                  className={`relative flex items-center gap-2 px-4 pb-3 text-sm font-semibold transition ${
                    authMethod === 'google'
                      ? 'text-pink-600 dark:text-pink-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                    />
                  </svg>
                  Google
                  {authMethod === 'google' && (
                    <span className="absolute bottom-[-1px] left-0 h-0.5 w-full rounded-full bg-pink-500" />
                  )}
                </button>
              </div>

              <div className="pt-6">
                {/* Email/Password Form */}
                {authMethod === 'email' && (
                  <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Email
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pink-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </span>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full rounded-2xl border border-slate-200 bg-white px-12 py-3.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-pink-500 dark:focus:ring-pink-500/10"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pink-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M5 8V6a5 5 0 0110 0v2h1a1 1 0 011 1v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a1 1 0 011-1h1zm2 0h6V6a3 3 0 10-6 0v2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>

                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full rounded-2xl border border-slate-200 bg-white px-12 py-3.5 pr-12 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-pink-500 dark:focus:ring-pink-500/10"
                          placeholder="Create a password"
                          required
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M3.98 5.7A9.97 9.97 0 001 10s3 5 9 5c1.08 0 2.1-.15 3.03-.42l-1.47-1.47A3.5 3.5 0 018.9 7.96L7.55 6.6A8.83 8.83 0 003.98 5.7z" />
                              <path d="M17.82 10c-.54-1.1-1.77-3.01-3.93-4.52l-1.5 1.5A3.5 3.5 0 0111.1 13.1l-1.44 1.44A8.71 8.71 0 0017.82 10z" />
                              <path d="M19 2.59L2.59 19 1 17.41 17.41 1 19 2.59z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 4c4.5 0 8.4 3 9.8 6-1.4 3-5.3 6-9.8 6S1.6 13 0.2 10C1.6 7 5.5 4 10 4zm0 2c-3.3 0-6.2 2-7.4 4 1.2 2 4.1 4 7.4 4s6.2-2 7.4-4c-1.2-2-4.1-4-7.4-4zm0 1.5A2.5 2.5 0 1110 14a2.5 2.5 0 010-5z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {isSignUp && (
                          <div className="mt-4 grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-2 sm:gap-x-6">
                            
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                                  passwordChecks.length
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                                }`}
                              >
                                ✓
                              </div>
                              <span>At least 8 characters</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                                  passwordChecks.number
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                                }`}
                              >
                                ✓
                              </div>
                              <span>One number</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                                  passwordChecks.upper
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                                }`}
                              >
                                ✓
                              </div>
                              <span>One uppercase letter</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                                  passwordChecks.special
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                                }`}
                              >
                                ✓
                              </div>
                              <span>One special character</span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                                  passwordChecks.lower
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                                }`}
                              >
                                ✓
                              </div>
                              <span>One lowercase letter</span>
                            </div>

                          </div>
                        )};
                                            </div>

                    <button
                      type="submit"
                      className="mt-2 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-4 py-3.5 text-base font-bold text-white shadow-[0_14px_30px_rgba(236,72,153,0.25)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={loading}
                    >
                      {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>

                    {!isSignUp && (
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm font-medium text-pink-600 transition hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    <div className="pt-2">
                      <div className="relative flex items-center">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                        <span className="px-3 text-xs uppercase tracking-[0.2em] text-slate-400">or continue with</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-pink-200 hover:bg-pink-50/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.07]"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                          />
                        </svg>
                        {isSignUp ? 'Continue with Google' : 'Sign in with Google'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Google Auth Tab */}
                {authMethod === 'google' && (
                  <div className="space-y-4">
                    <p className="text-center text-sm leading-6 text-slate-600 dark:text-slate-400">
                      Click below to {isSignUp ? 'sign up' : 'sign in'} with your Google account.
                    </p>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-pink-200 hover:bg-pink-50/60 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.07]"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                        />
                      </svg>
                      {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
                    </button>

                    {!isSignUp && (
                      <div className="rounded-2xl border border-pink-100 bg-pink-50/70 p-4 text-sm text-slate-600 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-slate-300">
                        <p className="font-semibold text-slate-800 dark:text-white">Forgot your Google password?</p>
                        <a
                          href="https://accounts.google.com/signin/recovery"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block text-pink-600 transition hover:text-pink-500 dark:text-pink-400 dark:hover:text-pink-300"
                        >
                          Reset it on Google&apos;s website
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="mt-6 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
                By signing up, you agree to our{' '}
                <span className="font-medium text-pink-600 dark:text-pink-400">Terms of Service</span>{' '}
                and{' '}
                <span className="font-medium text-pink-600 dark:text-pink-400">Privacy Policy</span>.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}