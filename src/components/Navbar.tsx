import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Moon, Sun } from 'lucide-react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const ADMIN_EMAILS = ['safevoiceforwomen@gmail.com', 'piyushydv011@gmail.com', 'aditiraj0205@gmail.com'];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  // Track scroll position for enhanced glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
    <>
      <nav
        className={`navbar-glass fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'navbar-scrolled' : 'navbar-top'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 min-h-[4rem]">

            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link
                to="/"
                className="flex items-center group transform transition-transform duration-300 hover:scale-105"
                onClick={handleLinkClick}
              >
                <span className="relative flex items-center">
                  <Heart className="h-8 w-8 text-pink-500 dark:text-pink-400 animate-bounce drop-shadow-lg" />
                  <span className="absolute -top-2 -right-2 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-70"></span>
                </span>
                <div className="ml-2">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent drop-shadow-sm tracking-wide font-serif">
                    SafeVoice
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block italic font-light leading-none mt-0.5">
                    Your story. Your strength.
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop menu - custom-lg breakpoint (830px) */}
            <div className="hidden custom-lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={handleLinkClick}
                  className={`nav-link px-3 py-2 text-sm xl:text-base ${location.pathname === to ? 'active' : ''}`}
                >
                  {label}
                </Link>
              ))}

              {/* Theme Toggle for Desktop */}
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn p-2 rounded-xl transition-all duration-300"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {user ? (
                <div className="flex items-center space-x-1 xl:space-x-2 ml-1">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={handleLinkClick}
                      className={`admin-link px-3 py-2 text-sm ${location.pathname === '/admin' ? 'active-admin' : ''}`}
                    >
                      Admin
                    </Link>
                  )}
                  <span className="user-badge text-xs xl:text-sm max-w-[100px] xl:max-w-[120px] truncate">
                    Anonymous_{user.uid.slice(0, 6)}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="sign-btn text-sm whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={handleLinkClick}
                  className={`sign-btn text-sm xl:text-base whitespace-nowrap ${location.pathname === '/auth' ? 'ring-2 ring-pink-400 dark:ring-pink-500' : ''}`}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile: Theme Toggle + Hamburger */}
            <div className="custom-lg:hidden flex items-center space-x-1">
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn p-2 rounded-xl transition-all duration-300"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hamburger-btn p-2 rounded-xl transition-all duration-300"
                aria-label="Toggle menu"
              >
                {isMenuOpen
                  ? <X className="h-6 w-6" />
                  : <Menu className="h-6 w-6" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu — Glassmorphic */}
        <div className={`custom-lg:hidden mobile-menu-glass overflow-hidden transition-all duration-400 ease-in-out ${isMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'}`}>
          <div className="px-4 pt-3 pb-2 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={handleLinkClick}
                className={`mobile-nav-link block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  location.pathname === to
                    ? 'mobile-nav-active'
                    : 'mobile-nav-inactive'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="px-4 pt-2 pb-5 space-y-3 border-t border-pink-200/40 dark:border-white/10">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={handleLinkClick}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                      location.pathname === '/admin'
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50/60 dark:hover:bg-amber-900/30'
                    }`}
                  >
                    Admin
                  </Link>
                )}

                <div className="px-4 py-2 rounded-xl bg-white/30 dark:bg-white/5 border border-pink-200/40 dark:border-white/10 backdrop-blur-sm">
                  <p className="text-gray-600 dark:text-gray-300 font-mono text-sm break-all">
                    Anonymous_{user.uid.slice(0, 8)}
                  </p>
                </div>

                <button
                  onClick={handleSignOut}
                  className="sign-btn w-full text-base py-3"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={handleLinkClick}
                className={`sign-btn block w-full text-center text-base py-3 ${
                  location.pathname === '/auth' ? 'ring-2 ring-pink-300 dark:ring-pink-500' : ''
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Glassmorphic styles */}
      <style>{`
        /* ─── Glassmorphic Navbar Base ─────────────────────────── */
        .navbar-glass {
          background: rgba(255, 240, 245, 0.65);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border-bottom: 1px solid rgba(236, 72, 153, 0.18);
          box-shadow: 0 4px 24px -2px rgba(236, 72, 153, 0.10),
                      0 1px 0 0 rgba(255,255,255,0.5) inset;
        }

        /* Dark mode glass */
        .dark .navbar-glass {
          background: rgba(17, 10, 25, 0.60);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border-bottom: 1px solid rgba(244, 114, 182, 0.15);
          box-shadow: 0 4px 30px -2px rgba(0, 0, 0, 0.40),
                      0 1px 0 0 rgba(255,255,255,0.04) inset;
        }

        /* Enhanced glass on scroll */
        .navbar-scrolled {
          background: rgba(255, 235, 245, 0.78);
          box-shadow: 0 8px 32px -4px rgba(236, 72, 153, 0.16),
                      0 1px 0 0 rgba(255,255,255,0.6) inset;
        }
        .dark .navbar-scrolled {
          background: rgba(15, 8, 22, 0.80);
          box-shadow: 0 8px 32px -4px rgba(0,0,0,0.55),
                      0 1px 0 0 rgba(255,255,255,0.05) inset;
        }

        /* ─── Nav Links ─────────────────────────────────────────── */
        .nav-link {
          position: relative;
          color: #be185d;
          font-weight: 500;
          border-radius: 0.75rem;
          transition: all 0.25s ease;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .dark .nav-link {
          color: #f9a8d4;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #ec4899, #db2777);
          transition: width 0.25s ease;
        }
        .nav-link:hover {
          background: rgba(236, 72, 153, 0.10);
          color: #db2777;
          transform: translateY(-1px);
        }
        .nav-link:hover::after {
          width: 60%;
        }
        .dark .nav-link:hover {
          background: rgba(244, 114, 182, 0.12);
          color: #f472b6;
        }
        .nav-link.active {
          background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
          color: white !important;
          box-shadow: 0 4px 15px rgba(236, 72, 153, 0.40),
                      0 0 0 1px rgba(255,255,255,0.15) inset;
        }
        .nav-link.active::after {
          display: none;
        }
        .dark .nav-link.active {
          background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
          box-shadow: 0 4px 18px rgba(236, 72, 153, 0.50);
        }

        /* ─── Admin Link ─────────────────────────────────────────── */
        .admin-link {
          position: relative;
          color: #d97706;
          font-weight: 500;
          border-radius: 0.75rem;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .dark .admin-link {
          color: #fbbf24;
        }
        .admin-link:hover {
          background: rgba(251, 191, 36, 0.12);
          color: #b45309;
          transform: translateY(-1px);
        }
        .admin-link.active-admin {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
        }

        /* ─── Theme Toggle Button ───────────────────────────────── */
        .theme-toggle-btn {
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(236, 72, 153, 0.20);
          color: #9d174d;
          backdrop-filter: blur(8px);
        }
        .theme-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.70);
          border-color: rgba(236, 72, 153, 0.40);
          transform: rotate(12deg) scale(1.05);
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.18);
        }
        .dark .theme-toggle-btn {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(244, 114, 182, 0.18);
          color: #f9a8d4;
        }
        .dark .theme-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(244, 114, 182, 0.35);
          box-shadow: 0 4px 14px rgba(244, 114, 182, 0.20);
        }

        /* ─── Hamburger Button ──────────────────────────────────── */
        .hamburger-btn {
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(236, 72, 153, 0.20);
          color: #be185d;
          backdrop-filter: blur(8px);
        }
        .hamburger-btn:hover {
          background: rgba(255, 255, 255, 0.70);
          border-color: rgba(236, 72, 153, 0.40);
          color: #9d174d;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.18);
        }
        .dark .hamburger-btn {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(244, 114, 182, 0.18);
          color: #f9a8d4;
        }
        .dark .hamburger-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(244, 114, 182, 0.35);
          color: #f472b6;
        }

        /* ─── Sign In / Sign Out Button ─────────────────────────── */
        .sign-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.45rem 0.9rem;
          border-radius: 0.75rem;
          font-weight: 600;
          background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
          color: white;
          border: 1px solid rgba(255,255,255,0.20);
          box-shadow: 0 4px 16px rgba(236, 72, 153, 0.35),
                      0 1px 0 0 rgba(255,255,255,0.25) inset;
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .sign-btn:hover {
          background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(236, 72, 153, 0.50),
                      0 1px 0 0 rgba(255,255,255,0.25) inset;
        }
        .sign-btn:active {
          transform: translateY(0);
        }
        .dark .sign-btn {
          background: linear-gradient(135deg, #db2777 0%, #9d174d 100%);
          box-shadow: 0 4px 18px rgba(219, 39, 119, 0.45);
        }
        .dark .sign-btn:hover {
          background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
          box-shadow: 0 8px 28px rgba(236, 72, 153, 0.55);
        }

        /* ─── User Badge ────────────────────────────────────────── */
        .user-badge {
          display: inline-block;
          padding: 0.3rem 0.65rem;
          border-radius: 0.6rem;
          font-family: 'Courier New', monospace;
          background: rgba(236, 72, 153, 0.10);
          border: 1px solid rgba(236, 72, 153, 0.20);
          color: #9d174d;
          backdrop-filter: blur(8px);
        }
        .dark .user-badge {
          background: rgba(244, 114, 182, 0.10);
          border: 1px solid rgba(244, 114, 182, 0.20);
          color: #f9a8d4;
        }

        /* ─── Mobile Menu Glass ─────────────────────────────────── */
        .mobile-menu-glass {
          background: rgba(255, 240, 248, 0.88);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-top: 1px solid rgba(236, 72, 153, 0.15);
          box-shadow: 0 12px 40px -4px rgba(236, 72, 153, 0.15);
        }
        .dark .mobile-menu-glass {
          background: rgba(12, 6, 20, 0.92);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border-top: 1px solid rgba(244, 114, 182, 0.12);
          box-shadow: 0 12px 40px -4px rgba(0, 0, 0, 0.50);
        }

        .mobile-menu-open {
          max-height: 600px;
          opacity: 1;
        }
        .mobile-menu-closed {
          max-height: 0;
          opacity: 0;
          pointer-events: none;
        }

        .mobile-nav-link {
          backdrop-filter: blur(4px);
        }
        .mobile-nav-active {
          background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(236, 72, 153, 0.35);
        }
        .mobile-nav-inactive {
          color: #9d174d;
          background: transparent;
        }
        .mobile-nav-inactive:hover {
          background: rgba(236, 72, 153, 0.10);
          color: #be185d;
        }
        .dark .mobile-nav-inactive {
          color: #f9a8d4;
        }
        .dark .mobile-nav-inactive:hover {
          background: rgba(244, 114, 182, 0.12);
          color: #f472b6;
        }
        .dark .mobile-nav-active {
          background: linear-gradient(135deg, #db2777 0%, #9d174d 100%);
        }

        /* ─── Custom Breakpoint (830px) ─────────────────────────── */
        @media (min-width: 830px) {
          .custom-lg\\:flex {
            display: flex !important;
          }
          .custom-lg\\:hidden {
            display: none !important;
          }
        }

        /* ─── Animations ────────────────────────────────────────── */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}