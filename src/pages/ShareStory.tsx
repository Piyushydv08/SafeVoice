import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { auth } from '../lib/firebase';
import { Edit, Trash2, CheckSquare, Loader2, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';

// Firebase imports
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Initialize Firestore and Storage
const db = getFirestore();
const storage = getStorage();

const TAGS = [
  'Workplace Harassment',
  'Domestic Violence',
  'Street Harassment',
  'Cyberbullying',
  'Sexual Harassment',
  'Discrimination',
  'Recovery',
  'Support',
  'Healing',
  'Mental Health',
  'Legal',
];

// Add this function to ensure profile exists before creating a story
const ensureProfileExists = async (user: User) => {
  try {
    const profileRef = doc(db, 'profiles', user.uid);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      // Profile doesn't exist, create it
      await setDoc(profileRef, {
        email: user.email || 'anonymous@safeuser.com',
        display_name: user.displayName || user.email?.split('@')[0] || 'Anonymous User',
        created_at: serverTimestamp(),
      });
    }

    return true;
  } catch (error) {
    console.error('Error in ensureProfileExists:', error);
    return false;
  }
};

// Add this interface near the top of your file
interface Story {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  author_id: string;
  media_urls?: string[];
  created_at: any; // Or use proper Timestamp type
  reactionsCount?: number;
}

export default function ShareStory() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [correctedStories, setCorrectedStories] = useState<{ [storyId: string]: string }>({});
  const [loadingCorrection, setLoadingCorrection] = useState<{ [storyId: string]: boolean }>({});
  const [loadingFormCorrection, setLoadingFormCorrection] = useState(false);
  const [loadingStories, setLoadingStories] = useState(false); // Add a loading state for fetching stories

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // AI Tag Suggestion state
  const [aiTagLoading, setAiTagLoading] = useState(false);
  const [aiTagError, setAiTagError] = useState<string | null>(null);

  const handleSuggestTags = async () => {
    if (!content.trim()) {
      toast.error("Please write a story before suggesting tags.");
      return;
    }
    setAiTagLoading(true);
    setAiTagError(null);
    try {
      const suggested = await suggestTags(content);
      // Merge with existing tags, removing duplicates
      setSelectedTags(prev => Array.from(new Set([...prev, ...suggested])));
      if (suggested.length > 0) {
        toast.success("Tags suggested!");
      } else {
        toast.error("Could not suggest any relevant tags.");
      }
    } catch (err) {
      setAiTagError('Failed to suggest tags.');
      toast.error('Failed to suggest tags.');
    } finally {
      setAiTagLoading(false);
    }
  };
  // Voice recording handlers
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
        setAudioURL(URL.createObjectURL(audioBlob));
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      toast.error('Could not access microphone.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSaveRecording = () => {
    if (recordedAudio) {
      // Convert Blob to File and add to mediaFiles
      const audioFile = new File([recordedAudio], `voice-recording-${Date.now()}.webm`, { type: 'audio/webm' });
      setMediaFiles(prev => [...prev, audioFile]);
      setRecordedAudio(null);
      setAudioURL(null);
      toast.success('Voice recording added!');
    }
  };

  const handleDiscardRecording = () => {
    setRecordedAudio(null);
    setAudioURL(null);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyStories();
  }, []);

  const fetchMyStories = async () => {
    setLoadingStories(true);
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to view your stories');
      navigate('/auth');
      return;
    }

    try {
      // Create a query against the stories collection
      const storiesRef = collection(db, 'stories');
      const q = query(
        storiesRef,
        where('author_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const storiesData = querySnapshot.docs.map(doc => {
        // Properly cast the document data to match the Story interface
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          content: data.content || '',
          tags: data.tags || [],
          author_id: data.author_id || '',
          media_urls: data.media_urls || [],
          created_at: data.created_at,
          reactionsCount: 0
        } as Story;
      });

      // Get reactions count for each story
      for (let story of storiesData) {
        const reactionsRef = collection(db, 'reactions');
        const reactionsQuery = query(reactionsRef, where('story_id', '==', story.id));
        const reactionsSnap = await getDocs(reactionsQuery);
        story.reactionsCount = reactionsSnap.size;
      }

      setMyStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to fetch your stories.');
    } finally {
      setLoadingStories(false);
    }
  };

  const handleDelete = async (storyId: string) => {
    console.log('Deleting story with ID:', storyId);

    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to delete your story');
      navigate('/auth');
      return;
    }

    try {
      // First, get the story to check for media URLs
      const storyRef = doc(db, 'stories', storyId);
      const storySnap = await getDoc(storyRef);

      if (!storySnap.exists()) {
        toast.error('Story not found');
        return;
      }

      const storyData = storySnap.data();

      // Verify ownership
      if (storyData.author_id !== user.uid) {
        toast.error('You can only delete your own stories');
        return;
      }

      // Delete media files from storage if they exist
      if (storyData.media_urls && storyData.media_urls.length > 0) {
        for (const url of storyData.media_urls) {
          try {
            // Extract path from URL
            const pathMatch = url.match(/o\/(.+)\?/);
            if (pathMatch && pathMatch[1]) {
              const path = decodeURIComponent(pathMatch[1]);
              const fileRef = ref(storage, path);
              await deleteObject(fileRef);
            }
          } catch (error) {
            console.error('Error deleting media file:', error);
            // Continue with other deletions even if one fails
          }
        }
      }

      // Delete related reactions
      const reactionsRef = collection(db, 'reactions');
      const q = query(reactionsRef, where('story_id', '==', storyId));
      const reactionsSnap = await getDocs(q);

      const deletePromises = reactionsSnap.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete the story
      await deleteDoc(storyRef);

      toast.success('Story deleted successfully.');

      // Update state
      setMyStories(prevStories => prevStories.filter(story => story.id !== storyId));
      setCorrectedStories(prev => {
        const newState = { ...prev };
        delete newState[storyId];
        return newState;
      });
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete the story.');
    }
  };

  const handleEdit = (story: any) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to edit your story');
      navigate('/auth');
      return;
    }

    // Verify ownership
    if (story.author_id !== user.uid) {
      toast.error('You can only edit your own stories');
      return;
    }

    const contentToEdit = correctedStories[story.id] || story.content;
    navigate(`/edit-story/${story.id}`, {
      state: {
        story: {
          ...story,
          content: contentToEdit,
        }
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // If no text and no audio, require at least one
    const hasAudio = mediaFiles.some(f => f.type.startsWith('audio/'));
    if (!hasAudio && (!title.trim() || !content.trim())) {
      toast.error('Please provide a title and story, or record/upload a voice message.');
      setLoading(false);
      return;
    }

    // Limit to 10 files
    if (mediaFiles.length > 10) {
      toast.error('You can upload a maximum of 10 files.');
      setLoading(false);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to share your story');
      navigate('/auth');
      setLoading(false);
      return;
    }

    // Ensure profile exists
    const profileCreated = await ensureProfileExists(user);
    if (!profileCreated) {
      toast.error('Failed to create user profile');
      setLoading(false);
      return;
    }

    let storyText = content;
    // No audio transcription: if no text, storyText remains empty

    let mediaUrls: string[] = [];
    if (mediaFiles && mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        try {
          // Upload to Firebase Storage
          const downloadURL = await uploadMediaFile(file, user.uid);
          mediaUrls.push(downloadURL);
        } catch (error) {
          console.error('Error uploading media:', error);
          toast.error('Failed to upload media. Please try again.');
          setLoading(false);
          return;
        }
      }
    }

    try {
      // Add a new document to Firestore
      await addDoc(collection(db, 'stories'), {
        title,
        content: storyText,
        tags: selectedTags,
        author_id: user.uid,
        media_urls: mediaUrls,
        created_at: serverTimestamp(),
      });

      toast.success('Your story has been shared successfully');

      // Fetch the updated stories list
      fetchMyStories();

      // Reset the form
      setTitle('');
      setContent('');
      setSelectedTags([]);
      setMediaFiles([]);
    } catch (error) {
      console.error('Error inserting story:', error);
      toast.error('Failed to share story. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // A map of keywords to suggest tags. This is a client-side alternative
  // to a backend AI service and does not require a Blaze plan.
  const TAG_KEYWORDS: { [tag: string]: string[] } = {
    'Domestic Violence': ['abuse', 'partner', 'husband', 'boyfriend', 'spouse', 'family', 'home', 'domestic', 'abusive', 'violence', 'coercion', 'controlling', 'hit', 'yelling', 'afraid', 'intimate partner violence'],
    'Workplace Harassment': ['boss', 'coworker', 'job', 'office', 'workplace', 'harassment', 'manager', 'colleague', 'supervisor', 'hr', 'human resources', 'uncomfortable', 'retaliation', 'hostile environment'],
    'Street Harassment': ['catcall', 'street', 'public', 'stranger', 'followed', 'wolf-whistle', 'walking home', 'public transport', 'groped', 'unwanted attention', 'lewd'],
    'Cyberbullying': ['online', 'social media', 'troll', 'cyber', 'internet', 'dm', 'message', 'doxxing', 'impersonation', 'facebook', 'instagram', 'twitter', 'snapchat', 'tiktok', 'rumors', 'threats'],
    'Sexual Harassment': ['sexual', 'unwanted', 'touch', 'assault', 'inappropriate', 'groped', 'forced', 'advances', 'rape', 'coerced', 'non-consensual', 'violated', 'molestation'],
    'Discrimination': ['race', 'gender', 'religion', 'age', 'disability', 'discriminated', 'unequal', 'bias', 'ethnicity', 'sexuality', 'orientation', 'prejudice', 'unfairly', 'stereotyped', 'marginalized'],
    'Recovery': ['healing', 'recovering', 'therapy', 'support group', 'moving on', 'survivor', 'coping', 'strength', 'resilience', 'overcoming'],
    'Support': ['support', 'help', 'advice', 'community', 'listen', 'friends', 'helpline', 'resources', 'guidance', 'ally', 'allies', 'safe space'],
    'Healing': ['healing', 'therapy', 'counseling', 'peace', 'overcome', 'trauma', 'mental health', 'self-care', 'processing', 'rebuilding', 'inner peace'],
    'Mental Health': ['anxiety', 'depression', 'ptsd', 'trauma', 'panic attacks', 'stress', 'feeling down', 'suicidal', 'mental health', 'counseling'],
    'Legal': ['police', 'report', 'legal', 'lawyer', 'court', 'fir', 'case', 'justice', 'rights', 'filed a complaint'],
  };

  async function suggestTags(storyText: string): Promise<string[]> {
    if (!storyText.trim()) {
      return [];
    }

    const lowerCaseText = storyText.toLowerCase();
    const suggested = new Set<string>();

    for (const tag in TAG_KEYWORDS) {
      for (const keyword of TAG_KEYWORDS[tag]) {
        // Use a regex to match whole words to avoid partial matches (e.g., 'her' in 'therapy')
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(lowerCaseText)) {
          suggested.add(tag);
        }
      }
    }

    return Array.from(suggested);
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Grammar correction functions remain mostly the same, just with different API endpoint structure
  const handleGrammarFix = async (storyId: string, originalContent: string) => {
    setLoadingCorrection(prev => ({ ...prev, [storyId]: true }));
    try {
      // This now points to your Netlify Function endpoint
      const functionUrl = `/.netlify/functions/correct-grammar`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: originalContent }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Grammar correction service failed with status ${response.status}`);
      }

      const { correctedContent } = await response.json();

      setCorrectedStories(prev => ({
        ...prev,
        [storyId]: correctedContent,
      }));

      toast.success('Grammar checked and updated.');
    } catch (error: any) {
      console.error("Grammar correction error:", error);
      toast.error(`Failed to correct grammar: ${error.message}`);
    } finally {
      setLoadingCorrection(prev => ({ ...prev, [storyId]: false }));
    }
  };

  const handleFormGrammarFix = async () => {
    if (!content.trim()) {
      toast.error("Please write something in the story content first.");
      return;
    }
    setLoadingFormCorrection(true);
    try {
      // This now points to your Netlify Function endpoint
      const functionUrl = `/.netlify/functions/correct-grammar`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content }) // Fixed the semicolon error
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Grammar correction service failed with status ${response.status}`);
      }

      const { correctedContent } = await response.json();
      setContent(correctedContent);
      toast.success('Grammar checked and updated in the editor.');
    } catch (error: any) {
      console.error("Form grammar correction error:", error);
      toast.error(`Failed to correct grammar: ${error.message}`);
    } finally {
      setLoadingFormCorrection(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
        {/* Form for sharing a new story */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Share Your Story</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-12">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Content Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1"> {/* Container for label and button */}
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Story
              </label>
              {/* Form Grammar Fix Button */}
              <button
                type="button" // Important: Prevent form submission
                onClick={handleFormGrammarFix}
                className="inline-flex items-center text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingFormCorrection || !content.trim()} // Disable if loading or content is empty
                title="Fix Grammar in Editor"
              >
                {loadingFormCorrection ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-1" />
                ) : (
                  <CheckSquare size={14} className="mr-1" /> // Slightly smaller icon
                )}
                {loadingFormCorrection ? 'Fixing...' : 'Fix Grammar'}
              </button>
            </div>
            <textarea
              id="content"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>


          {/* Media Upload & Voice Recording */}
          <div>
            <label htmlFor="media" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Media (Optional, Max 200MB)
            </label>
            <input
              type="file"
              id="media"
              multiple
              accept="image/*,video/*,audio/*"
              onChange={(e) => {
                if (!e.target.files) return;
                const newFiles = Array.from(e.target.files);
                setMediaFiles(prev =>
                  [...prev, ...newFiles].slice(0, 10) // Keep only up to 10 files
                );
              }}
              className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 dark:file:bg-pink-900/20 dark:file:text-pink-300 dark:hover:file:bg-pink-900/30"
            />

            {/* Voice Recording Controls */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Or record your voice:</label>
              {!isRecording && !recordedAudio && (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="inline-flex items-center bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                >
                  🎤 Record Voice
                </button>
              )}
              {isRecording && (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  ⏹️ Stop Recording
                </button>
              )}
              {recordedAudio && audioURL && (
                <div className="mt-2 flex flex-col gap-2">
                  <audio controls src={audioURL} className="w-full" />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveRecording}
                      className="inline-flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save Recording
                    </button>
                    <button
                      type="button"
                      onClick={handleDiscardRecording}
                      className="inline-flex items-center bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Media Files List */}
          {mediaFiles.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {mediaFiles.map((file, idx) => (
                <li key={idx} className="flex items-center">
                  {file.name}
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:underline dark:text-red-400"
                    onClick={() =>
                      setMediaFiles(files => files.filter((_, i) => i !== idx))
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Tags Selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags (optional)
              </label>
              <button
                type="button"
                onClick={handleSuggestTags}
                className="inline-flex items-center text-xs text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={aiTagLoading || !content.trim()}
                title="Suggest Tags Based on Story Content"
              >
                {aiTagLoading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-1" />
                ) : (
                  <Sparkles size={14} className="mr-1" />
                )}
                {aiTagLoading ? 'Suggesting...' : 'Suggest Tags'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag)
                      ? 'bg-pink-500 text-white shadow'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {aiTagError && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{aiTagError}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              className="inline-flex items-center bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading || loadingFormCorrection} // Also disable if form correction is loading
            >
              {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
              {loading ? 'Sharing...' : 'Share Story'}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your identity will remain anonymous
            </p>
          </div>
        </form>



        {/* Display User's Stories */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-6">Your Stories</h2>
        {loadingStories ? (
          <div className="text-center py-8">
            <Loader2 className="animate-spin h-8 w-8 mx-auto text-pink-500" />
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading your stories...</p>
          </div>
        ) : myStories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">You haven't shared any stories yet.</p>
        ) : (
          <ul className="space-y-6">
            {myStories.map(story => {
              const displayContent = correctedStories[story.id] || story.content; // Show corrected content if available
              const isCorrecting = loadingCorrection[story.id];

              return (
                <li key={story.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6"> {/* Added padding */}
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{story.title}</h3> {/* Adjusted size/margin */}
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{displayContent}</p> {/* Preserve line breaks */}

                  {/* Display media if available */}
                  {story.media_urls && story.media_urls.length > 0 && (
                    <div className="mt-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4"> {/* Added border-top */}
                      {story.media_urls.map((url: string, index: number) => {
                        // ... media rendering logic (same as before) ...
                        const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);
                        const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
                        const isAudio = url.match(/\.(mp3|wav|ogg)$/i);

                        return (
                          <div key={index} className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-600">
                            {isImage && (
                              <img
                                src={url}
                                alt={`Media ${index + 1}`}
                                className="w-full max-h-80 object-contain bg-gray-50 dark:bg-gray-900" // Adjusted max-height
                              />
                            )}
                            {isVideo && (
                              <video
                                controls
                                className="w-full max-h-80 object-contain bg-black" // Adjusted max-height
                              >
                                <source src={url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {isAudio && (
                              <audio controls className="w-full p-2 bg-gray-50 dark:bg-gray-700">
                                <source src={url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Story Footer with Tags, Reactions, and Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm"> {/* Added border-top, flex layout */}
                    {/* Tags and Reactions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-gray-500 dark:text-gray-400">
                      <span>Tags: {story.tags?.join(', ') || 'None'}</span>
                      <span>Reactions: {story.reactionsCount}</span>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3"> {/* Adjusted spacing */}
                      {/* Grammar Fix Button (for existing stories) */}
                      <button
                        onClick={() => handleGrammarFix(story.id, story.content)}
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isCorrecting}
                        title="Fix Grammar"
                      >
                        {isCorrecting ? (
                          <Loader2 className="animate-spin h-4 w-4 mr-1" />
                        ) : (
                          <CheckSquare size={16} className="mr-1" />
                        )}
                        {isCorrecting ? 'Fixing...' : 'Fix Grammar'}
                      </button>
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(story)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit Story"
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(story.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete Story"
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

// Add a helper function to upload files
const uploadMediaFile = async (file: File, userId: string): Promise<string> => {
  // Check file size (200 MB limit)
  if (file.size > 200 * 1024 * 1024) {
    throw new Error(`File ${file.name} is too large. Maximum size is 200 MB.`);
  }

  // Check file type
  const allowedTypes = ['image/', 'video/', 'audio/'];
  if (!allowedTypes.some(type => file.type.startsWith(type))) {
    throw new Error(`File ${file.name} is not a supported type.`);
  }

  // Upload to Firebase Storage
  const storageRef = ref(storage, `story-media/${userId}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};