import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <FileQuestion className="w-24 h-24 text-pink-500 mb-6 animate-pulse" />
      <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4" style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}>
        404
      </h1>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
        Page Not Found
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
        We're sorry, but the page you were looking for doesn't exist or has been moved. 
        Let's get you back to a safe space.
      </p>
      
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}
      >
        <Home className="w-5 h-5" />
        Return to Home
      </Link>
    </div>
  );
}
