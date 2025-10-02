import React, { useState, useEffect, useRef } from 'react';
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

interface Testimonial {
  id: string;
  content: string;
  author_id?: string;
}

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-pink-500 hover:text-pink-700 bg-white dark:bg-gray-700 dark:text-pink-400 rounded-full p-2 shadow-md -ml-4"
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
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-pink-500 hover:text-pink-700 bg-white dark:bg-gray-700 dark:text-pink-400 rounded-full p-2 shadow-md -mr-4"
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
    { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1, infinite: true, arrows: true, dots: false } },
    { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1, infinite: true, arrows: true, dots: false } }
  ]
};

export default function Home() {
  const [currentSlogan, setCurrentSlogan] = useState(slogans[0]);
  const [fade, setFade] = useState(false);
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialContent, setTestimonialContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [searchKeyword, setSearchKeyword] = useState('');

  const navigate = useNavigate();
  const testimonialRef = useRef<HTMLFormElement | null>(null);

  // Dark/light mode toggle
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Cycle slogans with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentSlogan(slogans[Math.floor(Math.random() * slogans.length)]);
        setFade(false);
      }, 500);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch stories and testimonials
  useEffect(() => {
    fetchTopStories();
    fetchTestimonials();
  }, []);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToForm = () => testimonialRef.current?.scrollIntoView({ behavior: 'smooth' });

  const filteredStories = topStories.filter(story =>
    story.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    story.content.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  async function fetchTopStories() {
    try {
      const storiesRef = collection(db, 'stories');
      const q = query(storiesRef, orderBy('created_at', 'desc'), limit(9));
      const querySnapshot = await getDocs(q);
      const storiesData: Story[] = [];

      for (const doc of querySnapshot.docs) {
        const storyData = { id: doc.id, ...doc.data(), reactionsCount: 0 } as Story;

        const reactionsRef = collection(db, 'reactions');
        const reactionsQuery = query(reactionsRef, where('story_id', '==', doc.id));
        const reactionsSnapshot = await getDocs(reactionsQuery);
        storyData.reactionsCount = reactionsSnapshot.size;
        storiesData.push(storyData);
      }

      storiesData.sort((a, b) => (b.reactionsCount ?? 0) - (a.reactionsCount ?? 0));
      setTopStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setTopStories([]);
    }
  }

  async function fetchTestimonials() {
    try {
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(testimonialsRef, orderBy('created_at', 'desc'), limit(9));
      const querySnapshot = await getDocs(q);
      const testimonialsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Testimonial[];
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
      await addDoc(testimonialsRef, { content: testimonialContent, author_id: user.uid, created_at: serverTimestamp() });
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
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-gray-900 dark:text-gray-100 pt-16">
      {/* Hero Section */}
<div className="relative bg-gradient-to-r from-pink-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white py-20">
  <button
    onClick={() => setDarkMode(!darkMode)}
    className="absolute top-6 right-6 bg-white dark:bg-gray-700 dark:text-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
  >
    {darkMode ? '🌞' : '🌙'}
  </button>

  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl">
    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down">Welcome to SafeVoice</h1>
    <p className={`text-xl md:text-2xl mb-8 transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>{currentSlogan}</p>
    <p className="text-lg mb-8 animate-fade-in-up">A safe space to share your story and connect with others who understand</p>
  </div>
</div>

      {/* Story Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <input
          type="text"
          placeholder="Search stories..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full max-w-md mx-auto block p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Top Stories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">Top Stories</h2>
        {filteredStories.length > 0 ? (
          <Slider
            prevArrow={<PrevArrow />}
            nextArrow={<NextArrow />}
            dots={false}
            arrows={true}
            infinite={filteredStories.length > 3}
            speed={500}
            slidesToShow={3}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={5000}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1, infinite: filteredStories.length > 2, arrows: true, dots: false } },
              { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1, infinite: filteredStories.length > 1, arrows: true, dots: false } }
            ]}
          >
            {filteredStories.map((story) => {
              const isExpanded = expandedStoryId === story.id;
              const shouldTruncate = story.content.length > 600 && !isExpanded;
              return (
                <div key={story.id} className="px-4">
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col w-[420px] max-w-full mx-auto transform hover:scale-105 transition-transform duration-300">
                    <div className="p-8 flex-grow">
                      <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">{story.title}</h3>
                      <p className="text-gray-600 dark:text-gray-200 text-base mb-4">
                        {shouldTruncate ? `${story.content.substring(0, 600)}...` : story.content}
                        {shouldTruncate && (
                          <button onClick={() => setExpandedStoryId(story.id)} className="ml-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-500 font-semibold transition-colors duration-200">
                            Read More
                          </button>
                        )}
                        {isExpanded && story.content.length > 600 && (
                          <button onClick={() => setExpandedStoryId(null)} className="ml-2 text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-400 font-semibold transition-colors duration-200">
                            Show Less
                          </button>
                        )}
                      </p>
                    </div>
                    <div className="p-6 border-t border-gray-100 dark:border-gray-600">
                      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-300">
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
          <p className="text-center text-gray-500 dark:text-gray-300">No stories found.</p>
        )}
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center">Voices of Strength</h2>

          {auth.currentUser ? (
            <form ref={testimonialRef} onSubmit={handleAddTestimonial} className="mb-12 max-w-xl mx-auto">
              <textarea
                value={testimonialContent}
                onChange={(e) => setTestimonialContent(e.target.value)}
                placeholder="Share your experience with SafeVoice..."
                className="w-full p-4 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-pink-500 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-100"
                rows={4}
                required
              ></textarea>
              <button
                type="submit"
                className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors duration-200"
                disabled={loading}
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
              >
                Sign In
              </button>
            </div>
          )}

          {testimonials.length > 0 ? (
            testimonials.length > 3 ? (
              <Slider {...testimonialSliderSettings}>
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="px-2 sm:px-3">
                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
                      <p className="text-gray-600 dark:text-gray-200 mb-4 font-normal text-sm italic">"{testimonial.content}"</p>
                      <p className="text-gray-800 dark:text-gray-100 font-semibold text-xs text-right">By Anonymous_{testimonial.author_id?.slice(0, 8) || 'User'}</p>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="px-2 sm:px-3">
                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 h-full flex flex-col justify-between transform transition-transform duration-300 hover:scale-105">
                      <p className="text-gray-600 dark:text-gray-200 mb-4 font-normal text-sm italic">"{testimonial.content}"</p>
                      <p className="text-gray-800 dark:text-gray-100 font-semibold text-xs text-right">By Anonymous_{testimonial.author_id?.slice(0, 8) || 'User'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300">No testimonials yet. Be the first to share your experience!</p>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">About SafeVoice</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We provide a safe, anonymous platform for women to share their stories,
          find support, and access resources. Together, we're building a community of strength and healing.
        </p>
      </div>

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition duration-300 z-50"
          aria-label="Back to top"
        >
          <FaArrowUp/>
        </button>
      )}
    </div>
  );
}
