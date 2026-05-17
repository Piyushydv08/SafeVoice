import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function NotFound() {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen pt-16 flex items-center justify-center bg-white dark:bg-gray-900 relative overflow-hidden"
      style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}
    >
      {/* Decorative background blobs */}
      <div
        className="absolute top-20 -left-32 w-96 h-96 rounded-full opacity-20 dark:opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #f472b6, #ec4899)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -right-24 w-80 h-80 rounded-full opacity-15 dark:opacity-8 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #a855f7, #7c3aed)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 dark:opacity-5 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #fb7185, transparent)',
          filter: 'blur(100px)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-16 max-w-lg mx-auto">
        {/* Animated 404 number */}
        <div className="relative mb-6">
          <h1
            className="text-[10rem] sm:text-[12rem] font-black leading-none bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent select-none"
            style={{
              textShadow: 'none',
              letterSpacing: '-0.04em',
              lineHeight: '0.85',
            }}
          >
            404
          </h1>
          {/* Subtle glow behind the number */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="w-48 h-48 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(236, 72, 153, 0.25), transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
          </div>
        </div>

        {/* Decorative separator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="block w-12 h-0.5 rounded-full bg-gradient-to-r from-transparent to-pink-400" />
          <span className="block w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span className="block w-12 h-0.5 rounded-full bg-gradient-to-l from-transparent to-purple-400" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back to safety.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white
              bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600
              shadow-lg shadow-pink-500/30 dark:shadow-pink-500/20
              hover:shadow-xl hover:shadow-pink-500/40 dark:hover:shadow-pink-500/30
              hover:-translate-y-0.5
              transition-all duration-300 ease-out"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to Home
          </Link>

          <Link
            to="/stories"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold
              text-pink-600 dark:text-pink-400
              bg-pink-50 dark:bg-pink-500/10
              border border-pink-200 dark:border-pink-500/20
              hover:bg-pink-100 dark:hover:bg-pink-500/20
              hover:-translate-y-0.5
              transition-all duration-300 ease-out"
          >
            Explore Stories
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700/50">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              to="/about"
              className="text-pink-500 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors duration-200 hover:underline underline-offset-4"
            >
              About Us
            </Link>
            <Link
              to="/resources"
              className="text-pink-500 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors duration-200 hover:underline underline-offset-4"
            >
              Resources
            </Link>
            <Link
              to="/faqs"
              className="text-pink-500 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors duration-200 hover:underline underline-offset-4"
            >
              FAQs
            </Link>
            <Link
              to="/contact"
              className="text-pink-500 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors duration-200 hover:underline underline-offset-4"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Keyframe animations via inline style tag */}
      <style>{`
        @keyframes notfound-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
