import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';

const ADMIN_EMAILS = ['safevoiceforwomen@gmail.com', 'piyushydv011@gmail.com', 'aditiraj0205@gmail.com'];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success('Signed out successfully');
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/stories', label: 'Stories' },
    { to: '/share-story', label: 'Share Story' },
    { to: '/resources', label: 'Resources' },
    { to: '/faqs', label: 'FAQs' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-pink-100 via-white to-pink-200 shadow-xl border-b border-pink-200 backdrop-blur-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16 min-h-[4rem]">
          {/* Logo - Optimized for mobile */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="flex items-center group transform transition-transform duration-300 hover:scale-105"
              onClick={handleLinkClick}
            >
              <span className="relative">
                <Heart className="h-7 w-7 sm:h-8 sm:w-8 text-pink-500 drop-shadow-lg" />
                <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-pink-400 rounded-full opacity-70"></span>
              </span>
              <div className="ml-2">
                <span className="text-xl sm:text-2xl font-extrabold text-pink-600 drop-shadow-sm tracking-wide font-serif">
                  SafeVoice
                </span>
                <p className="text-xs text-gray-600 sm:block animate-fade-in italic font-light">
                  Your story. Your strength.
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop menu - Updated breakpoint to 830px */}
          <div className="hidden custom-lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={handleLinkClick}
                className={`nav-link px-2 py-2 xl:text-base ${location.pathname === to ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-1 xl:space-x-2 ml-1">
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={handleLinkClick}
                    className={`admin-link px-2 py-2 text-sm ${location.pathname === '/admin' ? 'active-admin' : ''}`}
                  >
                    Admin
                  </Link>
                )}
                <span className="text-gray-700 font-mono bg-pink-100 px-2 py-1 rounded text-xs xl:text-sm shadow-inner max-w-[100px] xl:max-w-[120px] truncate">
                  Anonymous_{user.uid.slice(0, 6)}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-2 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-pink-500 transition-all duration-200 font-semibold text-sm whitespace-nowrap"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={handleLinkClick}
                className={`bg-gradient-to-r from-pink-500 to-pink-400 text-white px-3 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-pink-500 transition-all duration-200 font-semibold text-sm xl:text-base whitespace-nowrap ${location.pathname === '/auth' ? 'ring-2 ring-pink-400' : ''}`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button - Shows at 830px and below */}
          <div className="custom-lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-pink-500 hover:text-pink-700 transition-colors duration-200 p-2 rounded-lg hover:bg-pink-50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Simplified Mobile Menu */}
        {isMenuOpen && (
          <div className="custom-lg:hidden fixed inset-0 top-16 z-40 animate-fade-in bg-white">
            <div className="flex flex-col h-full w-full bg-white">
              {/* Navigation Links - Simplified */}
              <div className="flex-1 px-4 pt-4 space-y-1 bg-white">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={handleLinkClick}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      location.pathname === to 
                        ? 'bg-pink-500 text-white shadow-sm' 
                        : 'text-gray-700 hover:bg-pink-50'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              {/* User Section */}
              <div className="px-4 space-y-3 border-t border-gray-200 pt-4 pb-6 bg-white">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={handleLinkClick}
                        className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                          location.pathname === '/admin'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'text-gray-700 hover:bg-amber-50'
                        }`}
                      >
                        Admin
                      </Link>
                    )}
                    
                    <div className="px-4 py-2 bg-gray-100 rounded-lg">
                      <p className="text-gray-600 font-mono text-sm break-all">
                        Anonymous_{user.uid.slice(0, 8)}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-pink-500 text-white px-4 py-3 rounded-lg font-medium text-base hover:bg-pink-600 transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={handleLinkClick}
                    className={`block w-full text-center bg-pink-500 text-white px-4 py-3 rounded-lg font-medium text-base hover:bg-pink-600 transition-all duration-200 ${
                      location.pathname === '/auth' ? 'ring-2 ring-pink-300' : ''
                    }`}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom styles */}
      <style>{`
        .nav-link {
          position: relative;
          color: #be185d;
          font-weight: 500;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: linear-gradient(90deg, #f9a8d4 0%, #f472b6 100%);
          color: #fff;
          transform: translateY(-1px);
        }
        .nav-link.active {
          background: linear-gradient(90deg, #ec4899 0%, #db2777 100%);
          color: white;
          box-shadow: 0 4px 15px #ec489966;
        }

        .admin-link {
          position: relative;
          color: #d97706;
          font-weight: 500;
          border-radius: 0.75rem;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .admin-link:hover {
          background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
          color: #fff;
          transform: translateY(-1px);
        }
        .admin-link.active-admin {
          background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 15px #fbbf2433;
        }

        /* Custom breakpoint for 830px */
        @media (min-width: 830px) {
          .custom-lg\\:flex {
            display: flex !important;
          }
          .custom-lg\\:hidden {
            display: none !important;
          }
        }

        /* Mobile animations */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        /* Backdrop for mobile menu */
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
      `}
      </style>
    </nav>
  );
}