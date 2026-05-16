import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaHeart } from 'react-icons/fa';

interface Story {
  id: string;
  title: string;
  content: string;
  media_urls?: string[];
  author_id?: string;
  profiles?: { username?: string };
  reactions?: { count: number }[];
  reactionsCount?: number;
}

interface TopStoriesCarouselProps {
  stories: Story[];
}

const AUTOPLAY_INTERVAL = 10000;

const CATEGORIES: { keywords: string[]; label: string; accent: string; light: string }[] = [
  {
    keywords: ['surviv', 'escape', 'free'],
    label: 'Survival',
    accent: '#e11d48',
    light: 'rgba(225,29,72,0.08)',
  },
  {
    keywords: ['heal', 'recover', 'therapy'],
    label: 'Healing',
    accent: '#7c3aed',
    light: 'rgba(124,58,237,0.08)',
  },
  {
    keywords: ['hope', 'future', 'dream'],
    label: 'Hope',
    accent: '#d97706',
    light: 'rgba(217,119,6,0.08)',
  },
  {
    keywords: ['strength', 'courage', 'brave'],
    label: 'Strength',
    accent: '#059669',
    light: 'rgba(5,150,105,0.08)',
  },
];

const DEFAULT_CATEGORY = { label: 'Story', accent: '#db2777', light: 'rgba(219,39,119,0.08)' };

function getCategory(content: string) {
  const lower = content.toLowerCase();
  return (
    CATEGORIES.find((c) => c.keywords.some((k) => lower.includes(k))) ?? DEFAULT_CATEGORY
  );
}

export default function TopStoriesCarousel({ stories }: TopStoriesCarouselProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || stories.length === 0) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((index + stories.length) % stories.length);
        setIsTransitioning(false);
        setProgressKey((k) => k + 1);
      }, 400);
    },
    [isTransitioning, stories.length]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  useEffect(() => {
    if (isHovered || stories.length === 0) return;
    timerRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext, isHovered, stories.length]);

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-500">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-4 opacity-30">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        <p className="text-lg font-medium">No stories yet — be the first to share!</p>
      </div>
    );
  }

  const activeStory = stories[activeIndex];
  const cat = getCategory(activeStory.content);

  return (
    <section
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <span
          className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 transition-all duration-700"
          style={{ background: cat.light, color: cat.accent }}
        >
          Community Voices
        </span>
        <h2
          className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.02em' }}
        >
          Top Stories
        </h2>
        <div
          className="mt-4 mx-auto h-1 rounded-full w-14 transition-all duration-700"
          style={{ background: cat.accent }}
        />
      </div>

      {/* Carousel — px-14/px-20 creates room for arrows outside the card */}
      <div className="relative px-14 md:px-20">

        {/* Card */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(8px) scale(0.985)' : 'translateY(0) scale(1)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            boxShadow: '0 8px 48px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.06)',
          }}
        >
          {/* Accent bar top */}
          <div
            className="h-1.5 w-full"
            style={{ background: cat.accent, transition: 'background 0.7s ease' }}
          />

          {/* Body */}
          <div className="relative bg-white dark:bg-gray-900 p-8 md:p-12">
            {/* Watermark quote */}
            <span
              aria-hidden="true"
              className="absolute top-4 right-8 leading-none font-serif select-none pointer-events-none"
              style={{
                fontSize: 140,
                color: cat.accent,
                opacity: 0.06,
                fontFamily: 'Georgia, serif',
                lineHeight: 1,
              }}
            >
              "
            </span>

            {/* Category pill */}
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5"
              style={{ background: cat.light, color: cat.accent, transition: 'all 0.7s ease' }}
            >
              {cat.label}
            </span>

            {/* Title */}
            <h3
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-5 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {activeStory.title}
            </h3>

            {/* Content preview */}
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8 sv-clamp">
              {activeStory.content}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <button
                onClick={() => navigate('/stories')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-200 active:scale-95 hover:opacity-90 focus:outline-none"
                style={{ background: cat.accent }}
              >
                Read More
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <div className="flex items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1.5">
                  <FaHeart style={{ color: cat.accent }} />
                  {activeStory.reactionsCount ?? 0}
                </span>
                <span className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
                <span>Anonymous_{activeStory.author_id?.slice(0, 6) || 'User'}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {!isHovered && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-800">
              <div
                key={progressKey}
                className="h-full rounded-full"
                style={{
                  background: cat.accent,
                  animation: `sv-progress ${AUTOPLAY_INTERVAL}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>

        {/* Left arrow — sits in the px-14/px-20 gutter, well outside the card */}
        <button
          onClick={goPrev}
          aria-label="Previous story"
          className="absolute left-0 top-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-md hover:scale-110 transition-all duration-200 focus:outline-none"
          style={{ transform: 'translateY(-50%)' }}
        >
          <FaChevronLeft className="text-sm" />
        </button>

        {/* Right arrow */}
        <button
          onClick={goNext}
          aria-label="Next story"
          className="absolute right-0 top-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-md hover:scale-110 transition-all duration-200 focus:outline-none"
          style={{ transform: 'translateY(-50%)' }}
        >
          <FaChevronRight className="text-sm" />
        </button>
      </div>

      {/* Dot indicators */}
      {stories.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {stories.slice(0, 9).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Go to story ${idx + 1}`}
              className="rounded-full transition-all duration-300 focus:outline-none"
              style={{
                width: idx === activeIndex ? 28 : 10,
                height: 10,
                background:
                  idx === activeIndex
                    ? cat.accent
                    : 'var(--dot-inactive, #d1d5db)',
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes sv-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .sv-clamp {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dark .rounded-full[style*="d1d5db"] {
          --dot-inactive: #4b5563;
        }
      `}</style>
    </section>
  );
}