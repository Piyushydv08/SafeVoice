import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight, FaArrowUp } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

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

// Define a type for the story object for better type safety
interface Story {
  id: string;
  title: string;
  content: string;
  media_urls?: string[];
  author_id?: string;
  profiles?: { username?: string };
  reactions?: { count: number }[];
  reactionsCount?: number; // Added for client-side sorting
}

// Define a type for Testimonials
interface Testimonial {
  id: string; // Assuming testimonials also have an ID
  content: string;
  author_id?: string;
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

const testimonialSliderSettings = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        dots: false,
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        dots: false,
      }
    }
  ]
};

export default function Home() {
  const [currentSlogan, setCurrentSlogan] = useState(slogans[0]);
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialContent, setTestimonialContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(false); 
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
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  async function fetchTopStories() {
    try {
      // Create a query to get stories ordered by creation date
      const storiesRef = collection(db, 'stories');
      const q = query(
        storiesRef,
        orderBy('created_at', 'desc'),
        limit(9)
      );
      
      const querySnapshot = await getDocs(q);
      const storiesData: Story[] = [];
      
      // Process each document
      for (const doc of querySnapshot.docs) {
        const storyData = {
          id: doc.id,
          ...doc.data(),
          reactionsCount: 0
        } as Story;
        
        // Get reaction count for this story
        const reactionsRef = collection(db, 'reactions');
        const reactionsQuery = query(
          reactionsRef,
          where('story_id', '==', doc.id)
        );
        
        const reactionsSnapshot = await getDocs(reactionsQuery);
        // Count reactions for this story
        const storyReactions = reactionsSnapshot.docs.filter(
          reactionDoc => reactionDoc.data().story_id === doc.id
        );
        
        storyData.reactionsCount = storyReactions.length;
        storiesData.push(storyData);
      }
      
      // Sort by reaction count (highest first)
      storiesData.sort((a, b) => (b.reactionsCount ?? 0) - (a.reactionsCount ?? 0));
      setTopStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setTopStories([]); // Set empty array on error
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
      setTestimonials([]); // Set empty array on error
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
      fetchTestimonials(); // Refresh the testimonials list
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900" style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-700 text-white py-24 overflow-hidden shadow-xl">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-pink-400/10 to-transparent pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1
        className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in-down tracking-tight"
        style={{
          fontFamily: "'Montserrat', 'Nunito', sans-serif",
          letterSpacing: '0.02em',
          textShadow: '0 4px 32px rgba(236, 72, 153, 0.25), 0 1.5px 0 #fff'
        }}
        >
        Welcome to <span className="bg-gradient-to-r from-yellow-200 via-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">SafeVoice</span>
        </h1>
        <p
        className="text-2xl md:text-3xl mb-8 animate-fade-in font-medium"
        style={{
          fontFamily: "'Montserrat', 'Nunito', sans-serif",
          textShadow: '0 2px 16px rgba(168, 85, 247, 0.15)'
        }}
        >
        {currentSlogan}
        </p>
        <p
        className="text-lg md:text-xl mb-10 animate-fade-in-up font-light"
        style={{
          fontFamily: "'Montserrat', 'Nunito', sans-serif",
          color: 'rgba(255,255,255,0.92)'
        }}
        >
        A safe space to share your story and connect with others who understand
        </p>
        <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate('/stories')}
          className="bg-white/90 hover:bg-white text-pink-600 hover:text-purple-700 font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200 text-lg"
          style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}
        >
          Explore Stories
        </button>
        <button
          onClick={() => navigate('/share-story')}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-200 text-lg"
          style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}
        >
          Share Your Voice
        </button>
        </div>
      </div>
      {/* Decorative SVG */}
      <svg className="absolute bottom-0 left-0 w-full h-24 text-white opacity-60" viewBox="0 0 1440 320" fill="none">
        <path fill="currentColor" d="M0,224L60,218.7C120,213,240,203,360,197.3C480,192,600,192,720,186.7C840,181,960,171,1080,176C1200,181,1320,203,1380,213.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
      </svg>
      </div>

      {/* Top Stories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Top Stories</h2>
      {topStories.length > 0 ? (
        <Slider
        prevArrow={<PrevArrow />}
        nextArrow={<NextArrow />}
        dots={false}
        arrows={true}
        infinite={topStories.length > 3}
        speed={500}
        slidesToShow={3}
        slidesToScroll={1}
        autoplay={true}
        autoplaySpeed={5000}
        responsive={[
          {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: topStories.length > 2,
            arrows: true,
            dots: false,
          }
          },
          {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: topStories.length > 1,
            arrows: true,
            dots: false,
          }
          }
        ]}
        >
        {topStories
          .sort((a, b) => (b.reactionsCount ?? 0) - (a.reactionsCount ?? 0))
          .slice(0, 9)
          .map((story) => {
          const isExpanded = expandedStoryId === story.id;
          const shouldTruncate = story.content.length > 600 && !isExpanded;
          return (
            <div key={story.id} className="px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col w-[420px] max-w-full mx-auto transform hover:scale-105 transition-transform duration-300" style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}>
              <div className="p-8 flex-grow">
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">{story.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-base mb-4">
                {shouldTruncate
                ? `${story.content.substring(0, 600)}...`
                : story.content}
                {shouldTruncate && (
                <button
                  onClick={() => setExpandedStoryId(story.id)}
                  className="ml-2 text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 font-semibold transition-colors duration-200"
                >
                  Read More
                </button>
                )}
                {isExpanded && story.content.length > 600 && (
                <button
                  onClick={() => setExpandedStoryId(null)}
                  className="ml-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold transition-colors duration-200"
                >
                  Show Less
                </button>
                )}
              </p>
              </div>
              <div className="p-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>By Anonymous_{story.author_id?.slice(0, 6) || 'User'}</span>
                <span>{story.reactionsCount ?? 0} reactions</span>
              </div>
              </div>
            </div>
            </div>
          );
          })}
        </Slider>
      ) : (
        <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No top stories available at the moment.</p>
      )}
      </div>
      
      {/* Testimonials Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
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
        <div className="mb-12 max-w-xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-2">Please sign in to share your experience</p>
          <button
          onClick={() => navigate('/auth')}
          className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600"
          style={{ fontFamily: "'Montserrat', 'Nunito', sans-serif" }}
          >
          Sign In
          </button>
        </div>
        )}

        {testimonials.length > 0 ? (
        testimonials.length > 3 ? ( // Only use Slider if more than 3 testimonials
          <Slider {...testimonialSliderSettings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-2 sm:px-3">
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
          </Slider>
        ) : (
          // Fallback for 1-3 testimonials
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-2 sm:px-3">
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
        )
        ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No testimonials yet. Be the first to share your experience!</p>
        )}
      </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        About SafeVoice
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        We provide a safe, anonymous platform for women to share their stories,
        find support, and access resources. Together, we're building a
        community of strength and healing.
        </p>
      </div>
      </div>
      {showButton && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition duration-300 z-50"
        aria-label="Back to top"
      >
        <FaArrowUp />
      </button>
      )}
    </div>
  );
}