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

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'google'>('email');
  const navigate = useNavigate();

    // ADDED: toggle for show/hide password
  const [showPassword, setShowPassword] = useState(false); 

  // ADDED: password validation checks
  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  // Validation helpers
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Create user profile in Firestore
  const createUserProfile = async (user: any, additionalData = {}) => {
    try {
      const userRef = doc(db, 'profiles', user.uid);
      await setDoc(userRef, {
        email: user.email,
        display_name: user.displayName || user.email?.split('@')[0] || 'Anonymous User',
        phone: user.phoneNumber,
        avatar_url: user.photoURL,
        created_at: serverTimestamp(),
        ...additionalData
      }, { merge: true });
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

     // CHANGED: use strong password validation
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
      setLoading(false);
      navigate('/');
    } catch (error: any) {
      console.error('Error signing up:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error('Failed to sign up. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Sign in successful!');
      setLoading(false);
      navigate('/');
    } catch (error: any) {
      console.error('Error signing in:', error);
      switch(error.code) {
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
      setLoading(false);
    }
  };

  // Google Sign-In function
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

  // Password reset function
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email first');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
      setLoading(false);
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast.error(`Failed to send reset email: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
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
    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 mt-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignUp ? 'Sign Up for SafeVoice' : 'Sign In to SafeVoice'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignUp
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-pink-600 hover:text-pink-500"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Authentication method tabs */}
          <div className="flex justify-center mb-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              className={`px-4 py-2 flex items-center ${
                authMethod === 'email' 
                  ? 'border-b-2 border-pink-500 text-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('google')}
              className={`px-4 py-2 flex items-center ${
                authMethod === 'google' 
                  ? 'border-b-2 border-pink-500 text-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                />
              </svg>
              Google
            </button>
          </div>
          <div className="mt-6">
            {/* Email/Password Form */}
            {authMethod === 'email' && (
              <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
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
                  <div className="relative">
                    {/* CHANGED: show/hide toggle + validation */}
                    <input
                      type={showPassword ? "text" : "password"} // ⭐ ADDED
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 pr-10" // ⭐ ADDED pr-10
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)} //  ADDED
                      className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                    >
                      {showPassword ? "🙈" : "👁️"} {/* simple toggle icon */}
                    </button>
                  </div>

                  {/* ⭐ ADDED: live password feedback */}
                  {isSignUp && (
                    <ul className="mt-2 text-sm space-y-1">
                      <li className={passwordChecks.length ? "text-green-600" : "text-red-600"}>• Minimum 8 characters</li>
                      <li className={passwordChecks.upper ? "text-green-600" : "text-red-600"}>• At least one uppercase letter</li>
                      <li className={passwordChecks.lower ? "text-green-600" : "text-red-600"}>• At least one lowercase letter</li>
                      <li className={passwordChecks.number ? "text-green-600" : "text-red-600"}>• At least one number</li>
                      <li className={passwordChecks.special ? "text-green-600" : "text-red-600"}>• At least one special character</li>
                    </ul>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  disabled={loading}
                >
                  {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
                
                {!isSignUp && (
                  <div className="text-center mt-2">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm font-medium text-pink-600 hover:text-pink-500"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* Google Sign-In */}
            {authMethod === 'google' && (
              <div className="text-center">
                <p className="mb-4 text-sm text-gray-600">
                  Click the button below to {isSignUp ? 'sign up' : 'sign in'} with your Google account
                </p>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
                    />
                  </svg>
                  {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
                </button>
                
                {/* Add Google Password Reset Note */}
                {!isSignUp && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Forgot your Google password?</p>
                    <a 
                      href="https://accounts.google.com/signin/recovery" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-500"
                    >
                      Reset it on Google's website
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
