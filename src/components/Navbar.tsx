import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Link to="/" className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">Home</Link>
            <Link to="/stories" className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">Stories</Link>
            <Link to="/share-story" className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">Share your Story</Link>
            <Link to="/resources" className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">Resources</Link>
            <Link to="/about" className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">About</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Anonymous_{user.id.slice(0, 8)}</span>
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
              <Link to="/" className="block text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">Home</Link>
              <Link to="/stories" className="block text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">Stories</Link>
              <Link to="/share-story" className="block text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">Share your Story</Link>
              <Link to="/resources" className="block text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">Resources</Link>
              <Link to="/about" className="block text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">About</Link>
              {user ? (
                <>
                  <span className="block text-gray-700 px-3 py-2">Anonymous_{user.id.slice(0, 8)}</span>
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