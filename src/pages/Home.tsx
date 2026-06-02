import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import TopStoriesCarousel from '../components/TopStoriesCarousel';

interface Testimonial {
  id: string;
  content: string;
  author_id?: string;
}

function TestimonialsBanner({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const visibleCount = Math.min(3, testimonials.length);

  useEffect(() => {
    if (testimonials.length <= 3) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + visibleCount) % testimonials.length);
        setIsTransitioning(false);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, [testimonials.length, visibleCount]);

  const getVisible = () => {
    if (testimonials.length <= 3) return testimonials;
    return Array.from({ length: visibleCount }, (_, i) =>
      testimonials[(currentIndex + i) % testimonials.length]
    );
  };

  const totalGroups = Math.ceil(testimonials.length / visibleCount);
  const currentGroup = Math.floor(currentIndex / visibleCount);

  return (
    <div>
      {/* Animated cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(8px)' : 'translateY(0)',
        }}
      >
        {getVisible().map((testimonial) => (
          <div key={`${testimonial.id}-${currentIndex}`} className="px-2 sm:px-3">
            <div
              className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-105"
              style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}
            >
              <p className="text-gray-600 dark:text-gray-300 mb-4 font-normal text-sm italic">
                "{testimonial.content}"
              </p>
              <p className="text-gray-800 dark:text-gray-200 font-semibold text-xs text-right">
                By Anonymous_{testimonial.author_id?.slice(0, 8) || 'User'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators — only show if more than 3 testimonials */}
      {testimonials.length > 3 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalGroups }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(i * visibleCount);
                  setIsTransitioning(false);
                }, 300);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentGroup
                  ? 'bg-pink-500 w-4'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-pink-300'
              }`}
              aria-label={`Go to group ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Firebase imports
import { auth } from '../lib/firebase';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  where
} from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore();

// Import slick-carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slogans = [
  "Breaking the silence, one story at a time.",
  "Your voice matters. Your story matters.",
  "Together we stand, united we heal.",
  "Empowering voices, creating change.",
  "You are not alone in this journey.",
  "Strength in sharing, power in unity."
];

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

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-pink-500 hover:text-pink-700 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md -ml-4"
    >
      <FaChevronLeft />
    </button>
  );
};

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-pink-500 hover:text-pink-700 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md -mr-4"
    >
      <FaChevronRight />
    </button>
  );
};

export default function Home() {
  const [currentSlogan, setCurrentSlogan] = useState(slogans[0]);
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialContent, setTestimonialContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan(slogans[Math.floor(Math.random() * slogans.length)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchTopStories();
    fetchTestimonials();
  }, []);

  async function fetchTopStories() {
    try {
      const storiesRef = collection(db, 'stories');
      const q = query(
        storiesRef,
        orderBy('created_at', 'desc'),
        limit(9)
      );

      const querySnapshot = await getDocs(q);
      const storiesData: Story[] = [];
      const storyIds: string[] = [];

      for (const doc of querySnapshot.docs) {
        const storyData = {
          id: doc.id,
          ...doc.data(),
          reactionsCount: 0
        } as Story;
        storiesData.push(storyData);
        storyIds.push(doc.id);
      }

      // Collect reactions counts in-memory if there are stories
      const reactionsCountMap: Record<string, number> = {};
      if (storyIds.length > 0) {
        const chunks: string[][] = [];
        for (let i = 0; i < storyIds.length; i += 30) {
          chunks.push(storyIds.slice(i, i + 30));
        }

        for (const chunk of chunks) {
          try {
            const reactionsRef = collection(db, 'reactions');
            const reactionsQuery = query(
              reactionsRef,
              where('story_id', 'in', chunk)
            );
            const reactionsSnapshot = await getDocs(reactionsQuery);
            reactionsSnapshot.docs.forEach(reactionDoc => {
              const data = reactionDoc.data();
              const storyId = data.story_id;
              if (storyId) {
                reactionsCountMap[storyId] = (reactionsCountMap[storyId] || 0) + 1;
              }
            });
          } catch (err) {
            console.error('Error batch-fetching reactions chunk:', err);
          }
        }
      }

      // Merge counts back into stories
      for (const story of storiesData) {
        story.reactionsCount = reactionsCountMap[story.id] || 0;
      }

      storiesData.sort((a, b) => (b.reactionsCount ?? 0) - (a.reactionsCount ?? 0));
      setTopStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to fetch stories.');
      setTopStories([]);
    }
  }

  async function fetchTestimonials() {
    try {
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(
        testimonialsRef,
        orderBy('created_at', 'desc'),
        limit(9)
      );

      const querySnapshot = await getDocs(q);
      const testimonialsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Testimonial[];

      setTestimonials(testimonialsData);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    }
  }

  async function handleAddTestimonial(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to add a testimonial.');
      setLoading(false);
      return;
    }

    try {
      const testimonialsRef = collection(db, 'testimonials');
      await addDoc(testimonialsRef, {
        content: testimonialContent,
        author_id: user.uid,
        created_at: serverTimestamp()
      });

      toast.success('Testimonial added successfully!');
      setTestimonialContent('');
      fetchTestimonials();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900" style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}>
      
      {/* ========================================================================= */}
      {/* UPGRADED HERO SECTION (2-COLUMN DESIGN)                                   */}
      {/* ========================================================================= */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-slate-50 via-purple-50/40 to-pink-50/30 dark:from-gray-950 dark:via-purple-950/10 dark:to-pink-950/10 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-gray-100 dark:border-gray-800">
        
        {/* Ambient Blurred Background Accent Blurs */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-purple-300/20 to-pink-300/20 dark:from-purple-900/10 dark:to-pink-900/10 rounded-full filter blur-3xl opacity-70 -mr-32 -mt-20 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-pink-200/20 to-fuchsia-200/20 dark:from-pink-900/5 dark:to-fuchsia-900/5 rounded-full filter blur-3xl opacity-60 -ml-20 -mb-20 pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Context Branding, Typography & High-Contrast CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Context Pill Tag */}
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100/80 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200/50 dark:border-pink-900/30 shadow-sm animate-fade-in">
              <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
              Empowering Community Space
            </span>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-fuchsia-500 to-purple-600 dark:from-pink-400 dark:via-fuchsia-400 dark:to-purple-400 drop-shadow-sm">
                SafeVoice
              </span>
            </h1>

            {/* Dynamic Rotating Slogan Container */}
            <div className="min-h-[4rem] sm:min-h-[3rem] flex items-center justify-center lg:justify-start">
              <p className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 italic transition-all duration-500 ease-in-out">
                "{currentSlogan}"
              </p>
            </div>

            {/* Platform Intent Statement */}
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-xl font-light leading-relaxed">
              A secure, supportive, and anonymous platform to voice your experiences, find solidarity in shared journeys, and safely connect with professional support systems.
            </p>

            {/* CTA Buttons Group - Repaired for AAA Contrast & Visual Weight */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/stories')}
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-base"
              >
                Explore Stories
              </button>
              <button
                onClick={() => navigate('/share-story')}
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-900 shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-base"
              >
                Share Your Voice
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Mockup/Visual Canvas */}
          <div className="lg:col-span-5 hidden lg:flex justify-center relative">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              
              {/* Soft morphing background gradient ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/10 via-fuchsia-400/5 to-purple-500/10 rounded-full animate-pulse opacity-70" />
              
              {/* Glassmorphic Trust Banner Card */}
              <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-8 rounded-3xl border border-white/40 dark:border-gray-700/40 shadow-2xl flex flex-col space-y-4 max-w-xs transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-pink-100 dark:bg-pink-950/50 rounded-xl text-pink-600 dark:text-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-200 text-sm tracking-wide">100% Secure Space</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Your identity remains completely private. Advanced tokenization eliminates structural data traces so you can share without boundaries.
                </p>
                <div className="h-1 w-2/3 bg-gradient-to-r from-pink-500 to-transparent rounded-full mt-2" />
              </div>

              {/* Minor floating point indicators */}
              <div className="absolute top-4 left-12 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-40" />
              <div className="absolute bottom-12 right-8 w-4 h-4 bg-purple-400 rounded-full opacity-30" />
            </div>
          </div>

        </div>
      </section>

      {/* Top Stories Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <TopStoriesCarousel stories={topStories} />
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Voices of Strength
          </h2>

          {/* Testimonial Submission Form */}
          {auth.currentUser ? (
            <form onSubmit={handleAddTestimonial} className="mb-12 max-w-xl mx-auto">
              <textarea
                value={testimonialContent}
                onChange={(e) => setTestimonialContent(e.target.value)}
                placeholder="Share your experience with SafeVoice..."
                className="w-full p-4 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
                rows={4}
                required
                style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}
              ></textarea>
              <button
                type="submit"
                className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors duration-200"
                disabled={loading}
                style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}
              >
                {loading ? 'Submitting...' : 'Give Your Review'}
              </button>
            </form>
          ) : (
            <div className="mb-12 max-w-xl mx-auto flex items-center justify-center gap-4">
              <p className="text-gray-600 dark:text-gray-300 whitespace-nowrap">
                Please sign in to share your experience
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 whitespace-nowrap flex-shrink-0"
                style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}
              >
                Sign In
              </button>
            </div>
          )}

          {/* Dynamic Rotating Testimonials Banner */}
          {testimonials.length > 0 ? (
            <TestimonialsBanner testimonials={testimonials} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No testimonials yet. Be the first to share your experience!
            </p>
          )}
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            About SafeVoice
          </h2>
          <p className="text-base text-gray-500 dark:text-gray-400 font-light leading-relaxed">
            A minimalist snapshot of our secure community architecture and principles.
          </p>
        </div>

        {/* Compact Grid Elements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Item 1: Our Mission */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80">
            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mx-auto lg:mx-0 text-pink-600 dark:text-pink-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-pink-600 dark:text-pink-400 mb-1.5">
              Our Mission
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              A secure, supportive, and entirely judgment-free sanctuary for women to heal.
            </p>
          </div>

          {/* Item 2: Absolute Anonymity */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto lg:mx-0 text-purple-600 dark:text-purple-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-purple-600 dark:text-purple-400 mb-1.5">
              Absolute Anonymity
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              Advanced data protection mechanisms cleanly detach your account details from shared spaces.
            </p>
          </div>

          {/* Item 3: AI-Driven Safety */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto lg:mx-0 text-blue-600 dark:text-blue-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21l3-2 3 2-.75-4M9.75 17h4.5M9.75 17L5.25 10.5m9 6.5l4.5-6.5M5.25 10.5L12 3l6.75 7.5m-13.5 0h13.5" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-blue-600 dark:text-blue-400 mb-1.5">
              AI-Driven Safety
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              Intelligent moderation logic systematically shields variables from intrusive or malicious traffic.
            </p>
          </div>

          {/* Item 4: Verified Resources */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/80">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto lg:mx-0 text-teal-600 dark:text-teal-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-teal-600 dark:text-teal-400 mb-1.5">
              Verified Resources
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              Clean routing channels for fluid, real-time links to trusted helplines and advocates.
            </p>
          </div>

        </div>
      </section>

      {/* Global CSS Inject Custom Styles */}
      <style>{`
        /* For Webkit browsers (Chrome, Safari) */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* For IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}
