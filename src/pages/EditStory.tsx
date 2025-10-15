import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { auth } from '../lib/firebase';
// Add Firebase imports
import { 
  getFirestore, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Initialize Firebase services
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
];

export default function EditStory() {
  const location = useLocation();
  const navigate = useNavigate();
  const story = location.state?.story;

  const [title, setTitle] = useState(story?.title || '');
  const [content, setContent] = useState(story?.content || '');
  const [tags, setTags] = useState<string[]>(story?.tags || []);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null); // New media files
  const [existingMediaUrls, setExistingMediaUrls] = useState<string[]>(story?.media_urls || []); // Existing media URLs
  const [loading, setLoading] = useState(false);

  // Check authentication
  useEffect(() => {
    // Check if user is authenticated with Firebase
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to edit your story');
      navigate('/auth');
      return;
    }

    // Check if story exists
    if (!story) {
      toast.error('Story not found');
      navigate('/share-story');
      return;
    }

    // Check if user is authorized to edit this story
    if (story.author_id !== user.uid) {
      toast.error('You are not authorized to edit this story');
      navigate('/share-story');
      return;
    }
  }, [story, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Verify user is still authenticated
    const user = auth.currentUser;
    if (!user) {
      toast.error('Please sign in to update your story');
      navigate('/auth');
      setLoading(false);
      return;
    }

    // Verify user still has permission to edit this story
    if (story.author_id !== user.uid) {
      toast.error('You are not authorized to edit this story');
      navigate('/share-story');
      setLoading(false);
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required.');
      setLoading(false);
      return;
    }

    let updatedMediaUrls = [...existingMediaUrls]; // Start with existing media URLs

    try {
      // Upload new media files if any
      if (mediaFiles && mediaFiles.length > 0) {
        for (const file of Array.from(mediaFiles)) {
          // Check file size (50 MB limit)
          if (file.size > 50 * 1024 * 1024) {
            toast.error(`File ${file.name} is too large. Maximum size is 50 MB.`);
            continue;
          }

          // Check file type
          const allowedTypes = ['image/', 'video/', 'audio/'];
          if (!allowedTypes.some((type) => file.type.startsWith(type))) {
            toast.error(`File ${file.name} is not a supported type.`);
            continue;
          }

          // Upload to Firebase Storage
          const storageRef = ref(storage, `story-media/${user.uid}/${story.id}/${Date.now()}-${file.name}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          updatedMediaUrls.push(downloadURL);
        }
      }

      // Update the story in Firestore
      const storyRef = doc(db, 'stories', story.id);
      await updateDoc(storyRef, {
        title,
        content,
        tags,
        media_urls: updatedMediaUrls,
        updated_at: serverTimestamp()
      });

      toast.success('Story updated successfully!');
      navigate('/share-story'); // Redirect back to the ShareStory page
    } catch (error) {
      console.error('Error updating story:', error);
      toast.error('Failed to update story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRemoveMedia = async (url: string) => {
    try {
      // Extract the path from the Firebase Storage URL
      const urlPath = url.split('?')[0]; // Remove query parameters
      const path = urlPath.split('firebase.storage.googleapis.com')[1];
      
      if (path) {
        // Create a reference to the file
        const fileRef = ref(storage, path);
        
        // Delete the file from Firebase Storage
        try {
          await deleteObject(fileRef);
        } catch (deleteError) {
          console.error('Error deleting file from storage:', deleteError);
          // Continue anyway to update the UI
        }
      }
      
      // Update the UI regardless of whether the file was deleted
      setExistingMediaUrls((prev) => prev.filter((mediaUrl) => mediaUrl !== url));
    } catch (error) {
      console.error('Error processing media URL:', error);
      toast.error('Failed to remove media. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-16 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Your Story</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
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

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Story
          </label>
          <textarea
            id="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  tags.includes(tag)
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="media" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload New Media (Optional)
          </label>
          <input
            type="file"
            id="media"
            multiple
            accept="image/*,video/*,audio/*"
            onChange={(e) => setMediaFiles(e.target.files)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-pink-500 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 dark:file:bg-pink-900/20 dark:file:text-pink-300 dark:hover:file:bg-pink-900/30"
          />
        </div>

        {existingMediaUrls.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Existing Media
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {existingMediaUrls.map((url, index) => (
                <div key={index} className="relative">
                  {url.match(/\.(jpeg|jpg|gif|png)$/i) && (
                    <img src={url} alt={`Media ${index + 1}`} className="w-full rounded-md bg-gray-50 dark:bg-gray-700" />
                  )}
                  {url.match(/\.(mp4|webm|ogg)$/i) && (
                    <video controls className="w-full rounded-md bg-black">
                      <source src={url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {url.match(/\.(mp3|wav|ogg)$/i) && (
                    <audio controls className="w-full bg-gray-50 dark:bg-gray-700 rounded-md">
                      <source src={url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(url)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Story'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/share-story')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}