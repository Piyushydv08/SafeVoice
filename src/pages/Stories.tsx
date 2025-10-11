import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Flag, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { auth } from '../lib/firebase';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore();

const SUPPORT_MESSAGES = [
  "You are not alone",
  "Stay strong",
  "We believe in you",
  "Your voice matters",
  "Thank you for sharing",
  "You are brave",
  "Your courage inspires others",
  "Healing is possible",
  "You are making a difference",
  "Together, we are stronger",
  "Every story matters",
  "You are supported here",
  "Hope is real",
  "You are seen and heard",
  "Your journey matters"
];

// Define supported languages for translation
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'mr', name: 'Marathi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  // Add more languages as needed
];

// Define the structure of a Story for better type safety
interface Story {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  media_urls?: string[];
  created_at: any;
  author_id: string;
  reactionsCount: number;
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  // State to store translated content: { storyId: { langCode: { title: '...', content: '...' } } }
  const [translatedStories, setTranslatedStories] = useState<{ [storyId: string]: { [langCode: string]: { title: string; content: string } } }>({});
  // State to track the selected language for each story: { storyId: langCode }
  const [targetLanguages, setTargetLanguages] = useState<{ [storyId: string]: string }>({});
  // State to track loading status for translation: { storyId: boolean }
  const [loadingTranslations, setLoadingTranslations] = useState<{ [storyId: string]: boolean }>({});
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'likes'>('newest');

  useEffect(() => {
    fetchStories();
    fetchTags();
  }, []); // Fetch only once on mount

  async function fetchStories() {
    setLoading(true);
    try {
      // Create a query to get all stories ordered by creation date
      const storiesRef = collection(db, 'stories');
      const q = query(storiesRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedStories: Story[] = [];
      
      // Process each story document
      for (const doc of querySnapshot.docs) {
        const storyData = doc.data();
        
        // Get reaction count
        const reactionsRef = collection(db, 'reactions');
        const reactionsQuery = query(reactionsRef, where('story_id', '==', doc.id));
        const reactionsSnapshot = await getDocs(reactionsQuery);
        
        fetchedStories.push({
          id: doc.id,
          title: storyData.title || '',
          content: storyData.content || '',
          tags: storyData.tags || [],
          media_urls: storyData.media_urls || [],
          created_at: storyData.created_at,
          author_id: storyData.author_id || '',
          reactionsCount: reactionsSnapshot.size
        });
      }
      
      setStories(fetchedStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to fetch stories.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchTags() {
    try {
      const storiesRef = collection(db, 'stories');
      const querySnapshot = await getDocs(storiesRef);
      
      if (!querySnapshot.empty) {
        // Extract all tags from stories
        const allTags = querySnapshot.docs
          .map(doc => doc.data().tags || [])
          .flat()
          .filter(Boolean);
        
        // Get unique tags
        const uniqueTags = Array.from(new Set(allTags));
        setAvailableTags(uniqueTags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      // Less intrusive error handling - don't show toast
    }
  }

  const handleReaction = async (storyId: string, type: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to react to stories');
      return;
    }

    try {
      // Check if user already reacted
      const reactionsRef = collection(db, 'reactions');
      const q = query(
        reactionsRef, 
        where('story_id', '==', storyId),
        where('user_id', '==', user.uid)
      );
      
      const existingReactions = await getDocs(q);
      
      if (!existingReactions.empty) {
        toast.error('You have already reacted to this story.');
        return;
      }
      
      // Generate a deterministic ID
      const reactionId = `${user.uid}_${storyId}`;
      
      // Add the reaction with the specific ID
      await setDoc(doc(db, 'reactions', reactionId), {
        story_id: storyId,
        user_id: user.uid,
        type: type,
        created_at: serverTimestamp()
      });
      
      toast.success('Reaction added');
      
      // Optimistic update
      setStories(prevStories => prevStories.map(s =>
        s.id === storyId ? { ...s, reactionsCount: (s.reactionsCount || 0) + 1 } : s
      ));
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction.');
    }
  };

  const handleReport = async (storyId: string) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to report stories');
      return;
    }

    try {
      // Add a report document
      await addDoc(collection(db, 'reports'), {
        story_id: storyId,
        user_id: user.uid,
        reported_at: serverTimestamp(),
        status: 'pending' // For admin to review
      });
      
      toast.success('Story reported. Thank you.');
    } catch (error) {
      console.error('Error reporting story:', error);
      toast.error('Failed to report story.');
    }
  };

  // --- Translation Handler ---
  const handleLanguageChange = async (storyId: string, targetLang: string) => {
    // Reset to original if 'original' is selected or language is empty
    if (!targetLang || targetLang === 'original') {
      setTargetLanguages(prev => ({ ...prev, [storyId]: 'original' }));
      return;
    }

    // Update the target language state immediately for UI feedback
    setTargetLanguages(prev => ({ ...prev, [storyId]: targetLang }));
    setLoadingTranslations(prev => ({ ...prev, [storyId]: true }));

    try {
      // Check if translation is already cached in state
      if (translatedStories[storyId]?.[targetLang]) {
        setLoadingTranslations(prev => ({ ...prev, [storyId]: false }));
        return; // Use cached translation
      }

      const storyToTranslate = stories.find(s => s.id === storyId);
      if (!storyToTranslate) {
        throw new Error("Story not found");
      }

      // --- Make API call to your Netlify Function endpoint ---
      const functionUrl = `/.netlify/functions/translate`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         },
        body: JSON.stringify({
          title: storyToTranslate.title,
          content: storyToTranslate.content,
          targetLang: targetLang, // e.g., 'hi', 'es'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Translation service failed with status ${response.status}`);
      }

      const { translatedTitle, translatedContent } = await response.json();

      // Update the translated stories cache state
      setTranslatedStories(prev => ({
        ...prev,
        [storyId]: {
          ...(prev[storyId] || {}), // Preserve other language translations for this story
          [targetLang]: { title: translatedTitle, content: translatedContent },
        },
      }));

      const langName = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
      toast.success(`Story translated to ${langName}`);

    } catch (error: any) {
      console.error("Translation error:", error);
      toast.error(`Failed to translate story: ${error.message}`);
      // Revert language selection back to original on error
      setTargetLanguages(prev => ({ ...prev, [storyId]: 'original' }));
    } finally {
      // Ensure loading state is turned off
      setLoadingTranslations(prev => ({ ...prev, [storyId]: false }));
    }
  };

  // --- Support Message Handler ---
  const handleSupport = () => {
    const randomMessage = SUPPORT_MESSAGES[Math.floor(Math.random() * SUPPORT_MESSAGES.length)];
    toast(randomMessage, { icon: '💖' });
  };

  // --- Sorting Handler ---
  function getSortedStories(stories: Story[]) {
    let filtered = stories.filter(story =>
      selectedTags.length === 0 || selectedTags.some(tag => story.tags?.includes(tag))
    );
    if (sortOption === 'likes') {
      filtered = filtered.sort((a, b) => (b.reactionsCount ?? 0) - (a.reactionsCount ?? 0));
    } else if (sortOption === 'oldest') {
      filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      // newest
      filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return filtered;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Stories of Strength</h1>

      {/* Filter Controls */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2 md:mb-0 text-center md:text-left">Filter by tags:</h2>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-pink-500 text-white hover:bg-pink-600 shadow'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="px-3 py-1 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value as any)}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-pink-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-20">
          <Loader2 className="animate-spin mx-auto h-10 w-10 text-pink-500 mb-4" />
          <p className="text-gray-500">Loading stories...</p>
        </div>
      )}

      {/* Stories grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {getSortedStories(stories).map((story) => {
            // Determine content to display based on selected language
            const currentTargetLang = targetLanguages[story.id] || 'original';
            const translation = translatedStories[story.id]?.[currentTargetLang];
            const displayTitle = currentTargetLang !== 'original' && translation ? translation.title : story.title;
            const displayContent = currentTargetLang !== 'original' && translation ? translation.content : story.content;
            const isLoading = loadingTranslations[story.id];
            const isExpanded = expandedStoryId === story.id;
            const shouldTruncate = displayContent.length > 400 && !isExpanded;

            return (
              <div key={story.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-shadow hover:shadow-xl">
                {/* Card Header with Language Selector */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800 flex-grow mr-2 truncate">{displayTitle}</h2>
                  <div className="flex items-center flex-shrink-0">
                    {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4 text-gray-500" />}
                    <select
                      value={currentTargetLang}
                      onChange={(e) => handleLanguageChange(story.id, e.target.value)}
                      disabled={isLoading}
                      className="text-xs border border-gray-300 rounded px-2 py-1 bg-white disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      aria-label={`Translate story ${story.id}`}
                    >
                      <option value="original">Original</option>
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-grow">
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {shouldTruncate
                      ? `${displayContent.substring(0, 400)}...`
                      : displayContent}
                    {shouldTruncate && (
                      <button
                        onClick={() => setExpandedStoryId(story.id)}
                        className="ml-2 text-pink-600 hover:text-pink-700 font-semibold transition-colors duration-200"
                      >
                        Read More
                      </button>
                    )}
                    {isExpanded && displayContent.length > 400 && (
                      <button
                        onClick={() => setExpandedStoryId(null)}
                        className="ml-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
                      >
                        Show Less
                      </button>
                    )}
                  </p>

                  {/* Media Display - only show when expanded */}
                  {isExpanded && story.media_urls && story.media_urls.length > 0 && (
                    <div className="mb-4 space-y-3">
                      {story.media_urls.map((url: string, index: number) => {
                        const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);
                        const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                        const isAudio = url.match(/\.(mp3|wav|ogg)$/i);

                        return (
                          <div key={index} className="relative rounded-md overflow-hidden border border-gray-200">
                            {isImage && (
                              <img
                                src={url}
                                alt={`Media ${index + 1}`}
                                className="w-full max-h-64 object-contain bg-gray-50"
                              />
                            )}
                            {isVideo && (
                              <video
                                controls
                                className="w-full max-h-64 object-contain bg-black"
                              >
                                <source src={url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {isAudio && (
                              <audio controls className="w-full p-2 bg-gray-50">
                                <source src={url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {(story.tags || []).map((tag: string) => (
                      <span
                        key={tag}
                        className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer - Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {/* Like Button */}
                    <button
                      onClick={() => handleReaction(story.id, 'heart')}
                      className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 transition-colors group"
                      title="Like"
                    >
                      <Heart size={18} className="group-hover:fill-current" />
                      <span className="font-medium">{story.reactionsCount || 0}</span>
                    </button>
                    {/* Support Button */}
                    <button
                      onClick={handleSupport}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors group"
                      title="Send Support"
                    >
                      <MessageCircle size={18} className="group-hover:fill-current" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* FIX: Ensure .slice is only called on strings */}
                    <span className="text-xs italic">
                      By Anon_{typeof story.author_id === 'string' ? story.author_id.slice(0, 6) : '...'}
                    </span>
                    {/* Report Button */}
                    <button
                      onClick={() => handleReport(story.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Report story"
                    >
                      <Flag size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && stories.length === 0 && (
        <p className="text-center text-gray-500 mt-12 text-lg">No stories found matching your criteria.</p>
      )}
    </div>
  );
}