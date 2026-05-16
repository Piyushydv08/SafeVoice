import { FaXTwitter, FaLinkedin, FaDiscord, FaGithub } from "react-icons/fa6";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add backend logic (Netlify function or Firebase) to save email
    toast.success(`Subscribed with: ${email}`);
    setEmail('');
  };

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/stories', label: 'Stories' },
    { to: '/share-story', label: 'Share Story' },
    { to: '/resources', label: 'Resources' },
    { to: '/faqs', label: 'FAQs' },
    { to: '/about', label: 'About' },
    { to: '/PrivacyPolicy', label: 'Privacy Policy' },
    { to: '/termsandconditions', label: 'Terms and Conditions' },
  ];

  const socials = [
    {
      href: 'https://x.com/piyushydv011?t=8VKvJiRHuwFIWstbcXji3Q&s=09',
      icon: <FaXTwitter />,
      label: 'X (Twitter)',
    },
    {
      href: 'https://www.linkedin.com/in/piyush-yadav-b513a0288',
      icon: <FaLinkedin />,
      label: 'LinkedIn',
    },
    {
      href: 'https://discord.gg/bdRJz6q2',
      icon: <FaDiscord />,
      label: 'Discord',
    },
    {
      href: 'https://github.com/Piyushydv08',
      icon: <FaGithub />,
      label: 'GitHub',
    },
  ];

  return (
    <>
      <footer className="footer-glass relative overflow-hidden">
        {/* Decorative blurred blobs */}
        <div className="footer-blob footer-blob-1" aria-hidden="true" />
        <div className="footer-blob footer-blob-2" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">

            {/* ── Brand, Social & Newsletter ── */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2 space-y-8">

              {/* Brand & Social */}
              <div>
                <div className="flex items-center mb-3">
                  <span className="relative flex items-center">
                    <Heart className="h-8 w-8 text-pink-500 dark:text-pink-400 drop-shadow-lg" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-400 rounded-full animate-ping opacity-60" />
                  </span>
                  <span className="ml-2 text-xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent font-serif tracking-wide">
                    SafeVoice
                  </span>
                </div>

                <p className="footer-muted text-sm mb-1">
                  Your story. Your strength. Your Safe Voice.
                </p>
                <p className="footer-muted text-sm mb-5">
                  A safe space for women to share their stories and find support.
                </p>

                {/* Social icons */}
                <div className="flex space-x-3">
                  {socials.map(({ href, icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="social-icon-btn"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div>
                <h3 className="footer-heading text-base font-semibold mb-4">
                  Subscribe to Our Newsletter
                </h3>
                <div className="max-w-sm">
                  <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="newsletter-input"
                    />
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        type="submit"
                        className="footer-subscribe-btn flex-1"
                      >
                        Subscribe
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmail('')}
                        className="footer-nothanks-btn flex-1"
                      >
                        No Thanks
                      </button>
                    </div>
                  </form>
                  <p className="footer-muted text-xs mt-2">
                    By subscribing, you agree to our{' '}
                    <Link to="/termsandconditions" className="footer-policy-link">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/PrivacyPolicy" className="footer-policy-link">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* ── Quick Links ── */}
            <div className="col-span-1">
              <h3 className="footer-heading text-base font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {quickLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="footer-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Contact ── */}
            <div className="col-span-1">
              <h3 className="footer-heading text-base font-semibold mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="footer-muted break-words">
                  <span className="block sm:inline">Email: </span>
                  <span className="block sm:inline">safevoiceforwomen@gmail.com</span>
                </li>
                <li className="footer-muted">
                  Emergency: 1800-SAFE-NOW
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="footer-contact-btn"
                  >
                    Contact Us →
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="footer-bottom mt-8 pt-5 border-t border-pink-200/30 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="footer-muted text-xs text-center sm:text-left">
              © {new Date().getFullYear()} SafeVoice. All rights reserved.
            </p>
            <p className="footer-muted text-xs flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-pink-500 inline" /> for a safer world
            </p>
          </div>
        </div>
      </footer>

      {/* Glassmorphic footer styles */}
      <style>{`
        /* ─── Footer Glass Base ──────────────────────────────────── */
        .footer-glass {
          background: rgba(255, 237, 247, 0.70);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-top: 1px solid rgba(236, 72, 153, 0.18);
          box-shadow: 0 -4px 32px -4px rgba(236, 72, 153, 0.10),
                      0 -1px 0 0 rgba(255, 255, 255, 0.55) inset;
        }
        .dark .footer-glass {
          background: rgba(2, 8, 20, 0.97); 
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border-top: 1px solid rgba(244, 114, 182, 0.12);
          box-shadow: 0 -4px 32px -4px rgba(0, 0, 0, 0.45),
                      0 -1px 0 0 rgba(255, 255, 255, 0.04) inset;
        }

        /* ─── Decorative Blobs ───────────────────────────────────── */
        .footer-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          opacity: 0.18;
        }
        .footer-blob-1 {
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, #f472b6, #ec4899);
          top: -80px;
          left: -60px;
        }
        .footer-blob-2 {
          width: 260px;
          height: 260px;
          background: radial-gradient(circle, #fb7185, #f43f5e);
          bottom: -60px;
          right: -40px;
          opacity: 0.12;
        }
        .dark .footer-blob {
          opacity: 0.08;
        }

        /* ─── Text & Heading ─────────────────────────────────────── */
        .footer-heading {
          color: #1f2937;
          letter-spacing: 0.02em;
        }
        .dark .footer-heading {
          color: #f3f4f6;
        }

        .footer-muted {
          color: #6b7280;
        }
        .dark .footer-muted {
          color: #9ca3af;
        }

        /* ─── Quick Links ────────────────────────────────────────── */
        .footer-link {
          color: #6b7280;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .footer-link::before {
          content: '›';
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s ease;
          color: #ec4899;
        }
        .footer-link:hover {
          color: #ec4899;
          transform: translateX(4px);
        }
        .footer-link:hover::before {
          opacity: 1;
          transform: translateX(0);
        }
        .dark .footer-link {
          color: #9ca3af;
        }
        .dark .footer-link:hover {
          color: #f472b6;
        }

        /* ─── Social Icon Buttons ────────────────────────────────── */
        .social-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.2rem;
          height: 2.2rem;
          border-radius: 0.65rem;
          font-size: 1.05rem;
          background: rgba(236, 72, 153, 0.08);
          border: 1px solid rgba(236, 72, 153, 0.18);
          color: #9d174d;
          backdrop-filter: blur(6px);
          transition: all 0.25s ease;
        }
        .social-icon-btn:hover {
          background: linear-gradient(135deg, #ec4899, #db2777);
          border-color: transparent;
          color: white;
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 6px 18px rgba(236, 72, 153, 0.40);
        }
        .dark .social-icon-btn {
          background: rgba(244, 114, 182, 0.08);
          border: 1px solid rgba(244, 114, 182, 0.15);
          color: #f9a8d4;
        }
        .dark .social-icon-btn:hover {
          background: linear-gradient(135deg, #db2777, #9d174d);
          color: white;
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.50);
        }

        /* ─── Newsletter Input ───────────────────────────────────── */
        .newsletter-input {
          width: 100%;
          padding: 0.55rem 0.85rem;
          border-radius: 0.65rem;
          background: rgba(255, 255, 255, 0.50);
          border: 1px solid rgba(236, 72, 153, 0.22);
          color: #1f2937;
          backdrop-filter: blur(8px);
          transition: all 0.25s ease;
          outline: none;
          font-size: 0.875rem;
        }
        .newsletter-input::placeholder {
          color: #9ca3af;
        }
        .newsletter-input:focus {
          border-color: rgba(236, 72, 153, 0.55);
          background: rgba(255, 255, 255, 0.70);
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.12);
        }
        .dark .newsletter-input {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(244, 114, 182, 0.18);
          color: #f3f4f6;
        }
        .dark .newsletter-input::placeholder {
          color: #6b7280;
        }
        .dark .newsletter-input:focus {
          border-color: rgba(244, 114, 182, 0.45);
          background: rgba(255, 255, 255, 0.09);
          box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.12);
        }

        /* ─── Subscribe Button ───────────────────────────────────── */
        .footer-subscribe-btn {
          padding: 0.55rem 1rem;
          border-radius: 0.65rem;
          font-weight: 600;
          font-size: 0.875rem;
          background: linear-gradient(135deg, #ec4899, #db2777);
          color: white;
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 4px 14px rgba(236, 72, 153, 0.35),
                      0 1px 0 rgba(255,255,255,0.20) inset;
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .footer-subscribe-btn:hover {
          background: linear-gradient(135deg, #db2777, #be185d);
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(236, 72, 153, 0.48);
        }
        .dark .footer-subscribe-btn {
          background: linear-gradient(135deg, #db2777, #9d174d);
        }
        .dark .footer-subscribe-btn:hover {
          background: linear-gradient(135deg, #ec4899, #db2777);
        }

        /* ─── No Thanks Button ───────────────────────────────────── */
        .footer-nothanks-btn {
          padding: 0.55rem 1rem;
          border-radius: 0.65rem;
          font-weight: 600;
          font-size: 0.875rem;
          background: rgba(107, 114, 128, 0.12);
          border: 1px solid rgba(107, 114, 128, 0.22);
          color: #6b7280;
          backdrop-filter: blur(6px);
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .footer-nothanks-btn:hover {
          background: rgba(107, 114, 128, 0.22);
          color: #374151;
          transform: translateY(-1px);
        }
        .dark .footer-nothanks-btn {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #9ca3af;
        }
        .dark .footer-nothanks-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #d1d5db;
        }

        /* ─── Policy Links ───────────────────────────────────────── */
        .footer-policy-link {
          text-decoration: underline;
          color: #be185d;
          transition: color 0.2s ease;
        }
        .footer-policy-link:hover {
          color: #ec4899;
        }
        .dark .footer-policy-link {
          color: #f472b6;
        }
        .dark .footer-policy-link:hover {
          color: #f9a8d4;
        }

        /* ─── Contact Us Button ──────────────────────────────────── */
        .footer-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.4rem 0.85rem;
          border-radius: 0.65rem;
          font-weight: 600;
          font-size: 0.8rem;
          background: rgba(236, 72, 153, 0.10);
          border: 1px solid rgba(236, 72, 153, 0.22);
          color: #be185d;
          backdrop-filter: blur(6px);
          transition: all 0.25s ease;
          text-decoration: none;
        }
        .footer-contact-btn:hover {
          background: linear-gradient(135deg, #ec4899, #db2777);
          border-color: transparent;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(236, 72, 153, 0.38);
        }
        .dark .footer-contact-btn {
          background: rgba(244, 114, 182, 0.08);
          border: 1px solid rgba(244, 114, 182, 0.18);
          color: #f9a8d4;
        }
        .dark .footer-contact-btn:hover {
          background: linear-gradient(135deg, #db2777, #9d174d);
          color: white;
          box-shadow: 0 6px 18px rgba(236, 72, 153, 0.45);
        }
      `}</style>
    </>
  );
}