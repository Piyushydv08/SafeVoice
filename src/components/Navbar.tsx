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
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/stories', label: 'Stories' },
    { to: '/share-story', label: 'Share your Story' },
    { to: '/resources', label: 'Resources' },
    { to: '/faqs', label: 'FAQs' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-pink-100 via-white to-pink-200 shadow-xl border-b border-pink-200 backdrop-blur-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center group transform transition-transform duration-300 hover:scale-110"
            >
              <span className="relative">
                <Heart className="h-8 w-8 text-pink-500 animate-bounce drop-shadow-lg" />
                <span className="absolute -top-2 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-70"></span>
              </span>
              <div className="ml-2">
                <span className="text-2xl font-extrabold text-pink-600 drop-shadow-sm tracking-wide font-serif">SafeVoice</span>
                <p className="text-xs text-gray-600 hidden md:block animate-fade-in italic font-light">
                  Your story. Your strength.
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${location.pathname === to ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <div className="relative flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin" className={`admin-link ${location.pathname === '/admin' ? 'active-admin' : ''}`}>
                    Admin Panel
                  </Link>
                )}
                <span className="text-gray-700 font-mono bg-pink-100 px-2 py-1 rounded shadow-inner">
                  Anonymous_{user.uid.slice(0, 8)}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-4 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-pink-500 transition-all duration-200 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className={`bg-gradient-to-r from-pink-500 to-pink-400 text-white px-4 py-2 rounded-md shadow-md hover:from-pink-600 hover:to-pink-500 transition-all duration-200 font-semibold ${location.pathname === '/auth' ? 'ring-2 ring-pink-400' : ''}`}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-pink-500 hover:text-pink-700 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 rounded-lg shadow-lg mt-2 border border-pink-100 animate-fade-in-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`mobile-link ${location.pathname === to ? 'active-mobile' : ''}`}
                >
                  {label}
                </Link>
              ))}

              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className={`mobile-admin-link ${location.pathname === '/admin' ? 'active-admin' : ''}`}>
                      Admin Panel
                    </Link>
                  )}
                  <span className="block text-gray-700 px-3 py-2 font-mono bg-pink-100 rounded shadow-inner">
                    Anonymous_{user.uid.slice(0, 8)}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left text-pink-600 hover:text-pink-800 px-3 py-2 rounded-md font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className={`block text-white bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 px-3 py-2 rounded-md font-semibold shadow ${location.pathname === '/auth' ? 'ring-2 ring-pink-400' : ''}`}
                >
                  Sign In
                </Link>
              )}
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
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }
        .nav-link:hover {
          background: linear-gradient(90deg, #f9a8d4 0%, #f472b6 100%);
          color: #fff;
        }
        .nav-link.active {
          background: linear-gradient(90deg, #ec4899 0%, #db2777 100%);
          color: white;
          box-shadow: 0 2px 10px #ec489966;
        }

        .mobile-link.active-mobile {
          background: linear-gradient(90deg, #ec4899 0%, #db2777 100%);
          color: white;
          font-weight: 600;
        }

        .admin-link.active-admin,
        .mobile-admin-link.active-admin {
          background: linear-gradient(90deg, #f59e42 0%, #d97706 100%);
          color: white;
          box-shadow: 0 2px 10px #fbbf2433;
        }
      `}</style>
    </nav>
  );
}

