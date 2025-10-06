
// src/components/Footer.tsx
import { FaXTwitter, FaLinkedin, FaDiscord, FaGithub } from "react-icons/fa6";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';


export default function Footer() {
  const [email, setEmail] = useState('');
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add backend logic (Netlify function or Firebase) to save email
    alert(`Subscribed with: ${email}`);
    setEmail('');
  };
  return (

    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left - Brand */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-xl font-semibold text-white">SafeVoice</h2>
          <p className="text-sm">Your safe space to share and connect 💜</p>
        </div>

        {/* Center - Social Links */}
        <div className="flex space-x-6 text-xl">
          <a
            href="https://x.com/piyushydv011?t=8VKvJiRHuwFIWstbcXji3Q&s=09"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://www.linkedin.com/in/piyush-yadav-b513a0288"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://discord.gg/bdRJz6q2"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaDiscord />
          </a>
          <a
            href="https://github.com/Piyushydv08"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaGithub />
          </a>
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="ml-2 text-xl font-bold">SafeVoice</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your story. Your strength. Your Safe Voice.
            </p>
            <p className="text-gray-400">
              A safe space for women to share their stories and find support.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-pink-500">Home</Link>
              </li>
              <li>
                <Link to="/stories" className="text-gray-400 hover:text-pink-500">Stories</Link>
              </li>
              <li>
                <Link to="/share-story" className="text-gray-400 hover:text-pink-500">Share Story</Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-pink-500">Resources</Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-400 hover:text-pink-500">FAQs</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-pink-500">About</Link>
              </li>
              <li>
                <Link to="/PrivacyPolicy" className="text-gray-400 hover:text-pink-500">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/termsandconditions" className="text-gray-400 hover:text-pink-500">Terms and Conditions</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                Email: safevoiceforwomen@gmail.com
              </li>
              <li className="text-gray-400">
                Emergency: 1800-SAFE-NOW
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded"
                >
                  Subscribe
                </button>
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                >
                  No Thanks
                </button>
              </div>
            </form>
            <p className="text-gray-400 text-xs mt-2">
              By subscribing, you agree to our <Link to="/termsandconditions" className="underline">Terms of Service</Link> and <Link to="/PrivacyPolicy" className="underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Right - Contact */}
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <a
            href="mailto:youremail@example.com"
            className="hover:text-white transition"
          >
            Contact Us
          </a>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SafeVoice. All rights reserved.
      </div>
    </footer>
  );
}

