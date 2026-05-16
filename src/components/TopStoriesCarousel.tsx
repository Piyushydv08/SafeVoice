// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaChevronLeft, FaChevronRight, FaHeart, FaBook } from 'react-icons/fa';

// interface Story {
//   id: string;
//   title: string;
//   content: string;
//   media_urls?: string[];
//   author_id?: string;
//   profiles?: { username?: string };
//   reactions?: { count: number }[];
//   reactionsCount?: number;
// }

// interface TopStoriesCarouselProps {
//   stories: Story[];
// }

// const AUTOPLAY_INTERVAL = 10000;

// const getCategoryTag = (content: string): { label: string; color: string } => {
//   const lower = content.toLowerCase();
//   if (lower.includes('surviv') || lower.includes('escape') || lower.includes('free'))
//     return { label: 'Survival', color: 'from-rose-500 to-pink-600' };
//   if (lower.includes('heal') || lower.includes('recover') || lower.includes('therapy'))
//     return { label: 'Healing', color: 'from-violet-500 to-purple-600' };
//   if (lower.includes('hope') || lower.includes('future') || lower.includes('dream'))
//     return { label: 'Hope', color: 'from-amber-400 to-orange-500' };
//   if (lower.includes('strength') || lower.includes('courage') || lower.includes('brave'))
//     return { label: 'Strength', color: 'from-emerald-500 to-teal-600' };
//   return { label: 'Story', color: 'from-pink-500 to-fuchsia-600' };
// };

// const gradientPalettes = [
//   'from-pink-400/20 via-fuchsia-300/10 to-purple-400/20',
//   'from-rose-400/20 via-pink-300/10 to-fuchsia-400/20',
//   'from-violet-400/20 via-purple-300/10 to-pink-400/20',
//   'from-amber-300/20 via-rose-300/10 to-pink-400/20',
//   'from-fuchsia-400/20 via-violet-300/10 to-indigo-400/20',
// ];

// export default function TopStoriesCarousel({ stories }: TopStoriesCarouselProps) {
//   const navigate = useNavigate();
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [progressKey, setProgressKey] = useState(0);
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const goTo = useCallback(
//     (index: number) => {
//       if (isTransitioning || stories.length === 0) return;
//       setIsTransitioning(true);
//       setTimeout(() => {
//         setActiveIndex((index + stories.length) % stories.length);
//         setIsTransitioning(false);
//         setProgressKey((k) => k + 1);
//       }, 350);
//     },
//     [isTransitioning, stories.length]
//   );

//   const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
//   const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

//   useEffect(() => {
//     if (isHovered || stories.length === 0) return;
//     timerRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [goNext, isHovered, stories.length]);

//   if (stories.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
//         <FaBook className="text-5xl mb-4 opacity-30" />
//         <p className="text-lg font-medium">No stories yet — be the first to share!</p>
//       </div>
//     );
//   }

//   const activeStory = stories[activeIndex];
//   const tag = getCategoryTag(activeStory.content);
//   const palette = gradientPalettes[activeIndex % gradientPalettes.length];

//   // Visible cards: prev, active, next (for desktop)
//   const getVisibleIndexes = () => {
//     const n = stories.length;
//     if (n === 1) return [0];
//     if (n === 2) return [0, 1];
//     return [
//       (activeIndex - 1 + n) % n,
//       activeIndex,
//       (activeIndex + 1) % n,
//     ];
//   };

//   const visibleIndexes = getVisibleIndexes();

//   return (
//     <section
//       className="relative w-full"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Section header */}
//       <div className="text-center mb-10">
//         <span className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300 mb-3">
//           Community Voices
//         </span>
//         <h2
//           className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
//           style={{ fontFamily: "'Playfair Display', 'Georgia', serif", letterSpacing: '-0.01em' }}
//         >
//           Top Stories
//         </h2>
//         <div className="mt-3 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-500" />
//       </div>

//       {/* Featured card — large spotlight */}
//       <div className="relative max-w-4xl mx-auto mb-8 px-4">
//         <div
//           className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
//             isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
//           }`}
//           style={{ minHeight: 320 }}
//         >
//           {/* Background gradient blob */}
//           <div className={`absolute inset-0 bg-gradient-to-br ${palette} blur-2xl`} />
//           <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md" />

//           {/* Card content */}
//           <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
//             {/* Left: icon + tag */}
//             <div className="flex-shrink-0 flex flex-col items-center gap-3">
//               <div
//                 className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tag.color} flex items-center justify-center shadow-lg`}
//               >
//                 <FaBook className="text-white text-2xl" />
//               </div>
//               <span
//                 className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${tag.color} shadow`}
//               >
//                 {tag.label}
//               </span>
//             </div>

//             {/* Right: story text */}
//             <div className="flex-1 min-w-0">
//               <h3
//                 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
//                 style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
//               >
//                 {activeStory.title}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed line-clamp-4">
//                 {activeStory.content}
//               </p>

//               <div className="mt-6 flex items-center gap-4 flex-wrap">
//                 <button
//                   onClick={() => navigate('/stories')}
//                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
//                 >
//                   Read More
//                 </button>
//                 <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 ml-auto">
//                   <FaHeart className="text-pink-400" />
//                   <span>{activeStory.reactionsCount ?? 0} reactions</span>
//                   <span className="mx-2 opacity-40">·</span>
//                   <span>Anonymous_{activeStory.author_id?.slice(0, 6) || 'User'}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Progress bar */}
//           {!isHovered && (
//             <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
//               <div
//                 key={progressKey}
//                 className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"
//                 style={{
//                   animation: `progress-fill ${AUTOPLAY_INTERVAL}ms linear forwards`,
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Navigation arrows */}
//         <button
//           onClick={goPrev}
//           aria-label="Previous story"
//           className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-11 h-11 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-pink-500 hover:text-pink-700 hover:scale-110 transition-all duration-200"
//         >
//           <FaChevronLeft />
//         </button>
//         <button
//           onClick={goNext}
//           aria-label="Next story"
//           className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-11 h-11 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-pink-500 hover:text-pink-700 hover:scale-110 transition-all duration-200"
//         >
//           <FaChevronRight />
//         </button>
//       </div>

//       {/* Thumbnail strip */}
//       {stories.length > 1 && (
//         <div className="flex items-stretch justify-center gap-3 px-4 flex-wrap">
//           {stories.slice(0, 6).map((story, idx) => {
//             const isActive = idx === activeIndex;
//             const thumbTag = getCategoryTag(story.content);
//             return (
//               <button
//                 key={story.id}
//                 onClick={() => goTo(idx)}
//                 aria-label={`Go to story: ${story.title}`}
//                 className={`group relative flex-1 min-w-[140px] max-w-[200px] rounded-2xl p-4 text-left border-2 transition-all duration-300 ${
//                   isActive
//                     ? 'border-pink-400 dark:border-pink-500 bg-white dark:bg-gray-800 shadow-lg scale-105'
//                     : 'border-transparent bg-gray-50 dark:bg-gray-800/60 hover:border-pink-200 dark:hover:border-pink-800 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md hover:scale-102'
//                 }`}
//               >
//                 {isActive && (
//                   <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-t-2xl" />
//                 )}
//                 <span
//                   className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${thumbTag.color} mb-2`}
//                 >
//                   {thumbTag.label}
//                 </span>
//                 <p
//                   className={`text-xs font-semibold leading-snug line-clamp-2 ${
//                     isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
//                   }`}
//                 >
//                   {story.title}
//                 </p>
//                 <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
//                   <FaHeart className="text-pink-300" />
//                   {story.reactionsCount ?? 0}
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       )}

//       {/* Dot indicators */}
//       <div className="flex justify-center gap-2 mt-6">
//         {stories.slice(0, 9).map((_, idx) => (
//           <button
//             key={idx}
//             onClick={() => goTo(idx)}
//             aria-label={`Go to story ${idx + 1}`}
//             className={`rounded-full transition-all duration-300 ${
//               idx === activeIndex
//                 ? 'w-7 h-2.5 bg-gradient-to-r from-pink-400 to-purple-500'
//                 : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-pink-300 dark:hover:bg-pink-700'
//             }`}
//           />
//         ))}
//       </div>

//       {/* Keyframe for progress bar */}
//       <style>{`
//         @keyframes progress-fill {
//           from { width: 0%; }
//           to { width: 100%; }
//         }
//         .line-clamp-4 {
//           display: -webkit-box;
//           -webkit-line-clamp: 4;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </section>
//   );
// }
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