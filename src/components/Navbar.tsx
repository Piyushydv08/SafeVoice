import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { auth } from '../lib/firebase'; // Change this import
import { onAuthStateChanged } from 'firebase/auth'; // Add this import
import { toast } from 'react-hot-toast'; // Add for sign-out feedback

// Define admin emails. This should be consistent with your AdminPendingNGOs page.
const ADMIN_EMAILS = ['safevoiceforwomen@gmail.com', 'piyushydv011@gmail.com', 'aditiraj0205@gmail.com'];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace Supabase auth with Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center group transform transition-transform duration-300 hover:scale-110"
            >
              <Heart className="h-8 w-8 text-pink-500 animate-bounce" />
              <div className="ml-2">
                <span className="text-xl font-bold text-gray-800">SafeVoice</span>
                <p className="text-sm text-gray-600 hidden md:block animate-fade-in">
                  Your story. Your strength.
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop menu */}
         <div className="hidden md:flex items-center space-x-4">
             <Link to="/" className="text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">Home</Link> {/* added hover effect */}
             <Link to="/stories" className="text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">Stories</Link> {/* added hover effect */}
            <Link to="/share-story" className="text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">Share your Story</Link> {/*added hover effect */}
            <Link to="/resources" className="text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">Resources</Link> {/*  added hover effect */}
            <Link to="/faqs" className="text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">FAQs</Link> {/*  added hover effect */}
            <Link to="/about" className="text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">About</Link> {/*  added hover effect */}
        </div> 
            {user ? (
              <div className="relative flex items-center space-x-4">
                {isAdmin && (
              <Link to="/admin" className="text-yellow-500 font-bold px-3 py-2 rounded-md hover:text-yellow-600">
                    Admin Panel
                  </Link>
                )}
                <span className="text-gray-700">Anonymous_{user.uid.slice(0, 8)}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-pink-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

       {/* Mobile menu */}
{isMenuOpen && (
  <div className="md:hidden">
    <div className="px-2 pt-2 pb-3 space-y-1">
      <Link to="/" className="block text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">Home</Link> {/*  added hover effect */}
      <Link to="/stories" className="block text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">Stories</Link> {/*  added hover effect */}
      <Link to="/share-story" className="block text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">Share your Story</Link> {/*  added hover effect */}
      <Link to="/resources" className="block text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">Resources</Link> {/*  added hover effect */}
      <Link to="/faqs" className="block text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">FAQs</Link> {/* added hover effect */}
      <Link to="/about" className="block text-gray-700 hover:text-pink-500 transition-colors duration-300 hover:underline underline-offset-4 px-3 py-2 rounded-md">About</Link> {/* added hover effect */}
              {user ? (
                <>
                  {isAdmin && (
                <Link to="/admin" className="block text-yellow-500 font-bold px-3 py-2 rounded-md hover:text-yellow-600">
                      Admin Panel
                    </Link>
                  )}
                  <span className="block text-gray-700 px-3 py-2">Anonymous_{user.uid.slice(0, 8)}</span>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
