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
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { auth } from '../lib/firebase';

const db = getFirestore();

export default function Auth() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'google'>('email');
  const navigate = useNavigate();

  // Validation helpers
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidName = (name: string) => name.trim().length >= 2 && name.trim().length <= 50;

  // Create user profile in Firestore
  const createUserProfile = async (user: any, additionalData = {}) => {
    try {
      const userRef = doc(db, 'profiles', user.uid);
      await setDoc(
        userRef,
        {
          email: user.email,
         
          display_name: name || user.displayName || user.email?.split('@')[0],
          created_at: serverTimestamp(),
          ...additionalData,
        },
        { merge: true }
      );
      return true;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return false;
    }
  };

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return toast.error('Enter a valid email');
    if (!isValidName(name)) return toast.error('Enter a valid name (2-50 chars)');
    if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,}$/.test(password))
      return toast.error('Password must be 8+ chars, alphanumeric');

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Update Firebase Auth profile with displayName
      await updateProfile(user, { displayName: name });

      // ✅ Send verification email
      await sendEmailVerification(user);

      // ✅ Create user profile in Firestore
      await createUserProfile(user, { provider: 'email' });

      toast.success('Signup successful! Verify your email.');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      toast.error(err.code === 'auth/email-already-in-use' ? 'Email already registered' : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in!');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to sign in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await createUserProfile(user, { provider: 'google' });
      toast.success('Signed in with Google!');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const handleForgotPassword = async () => {
    if (!email) return toast.error('Enter your email');
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to send reset email');
    }
  };

  // Persist session + listen to auth changes
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/');
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 mt-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignUp ? 'Sign Up for SafeVoice' : 'Sign In to SafeVoice'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          {/* Toggle between Email / Google */}
          <div className="flex justify-center space-x-2 mb-4">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`px-3 py-1 rounded ${authMethod === 'email' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('google')}
              className={`px-3 py-1 rounded ${authMethod === 'google' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
            >
              Google
            </button>
          </div>

          {/* Email Auth */}
          {authMethod === 'email' && (
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              {/* Forgot password only on sign-in */}
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-pink-500 hover:underline"
                >
                  Forgot password?
                </button>
              )}

              <button
                type="submit"
                className="w-full bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 focus:outline-none"
                disabled={loading}
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>
          )}

          {/* Google Auth */}
          {authMethod === 'google' && (
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border px-4 py-2 rounded-md"
            >
              {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
            </button>
          )}

          {/* Switch between SignIn/SignUp */}
          <p className="mt-4 text-center text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-pink-500 hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
