import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Shield, Mail, Trash2, Flag } from 'lucide-react';

// --- Authorization ---
// Only users signed in with these emails can see this page.
const ADMIN_EMAILS = ['safevoiceforwomen@gmail.com', 'piyushydv011@gmail.com', 'aditiraj0205@gmail.com'];

const db = getFirestore();

interface NGORequest {
  id: string;
  name: string;
  description:string;
  contact: string;
  email: string;
  registration_number: string;
  user_id: string;
}

interface ApprovedNGO {
  id: string;
  name: string;
  description: string;
  contact: string;
  email: string;
  website?: string;
  approved_by: string; // Admin's email
  approved_at: {
    seconds: number; nanoseconds: number;
  };
}

interface Story {
  id: string;
  title: string;
  content: string;
  author_id: string;
  reportCount?: number;
  created_at: Timestamp;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pendingNGOs, setPendingNGOs] = useState<NGORequest[]>([]);
  const [approvedNGOs, setApprovedNGOs] = useState<ApprovedNGO[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check authorization and fetch data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && ADMIN_EMAILS.includes(user.email || '')) {
        setIsAuthorized(true);
        fetchAllAdminData();
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      // Fetch pending requests
      const fetchPendingPromise = getDocs(collection(db, 'ngo_requests'));

      // Fetch approved NGOs
      const approvedQuery = query(collection(db, 'ngos'), where('approved', '==', true), orderBy('approved_at', 'desc'));
      const fetchApprovedPromise = getDocs(approvedQuery);

      // Fetch stories and their report counts
      const fetchStoriesPromise = getDocs(query(collection(db, 'stories'), orderBy('created_at', 'desc')));

      const [
        requestsSnapshot,
        approvedSnapshot,
        storiesSnapshot
      ] = await Promise.all([
        fetchPendingPromise,
        fetchApprovedPromise,
        fetchStoriesPromise
      ]);

      const requestsList = requestsSnapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          } as NGORequest)
      );
      setPendingNGOs(requestsList);
      
      const approvedList = approvedSnapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          } as ApprovedNGO)
        );
        setApprovedNGOs(approvedList);

      // Process stories and fetch report counts for each
      const storiesList = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
      const storiesWithReportCounts = await Promise.all(
        storiesList.map(async (story) => {
          const reportsQuery = query(collection(db, 'reports'), where('story_id', '==', story.id));
          const reportSnap = await getDocs(reportsQuery);
          return { ...story, reportCount: reportSnap.size };
        })
      );

      // Sort stories by report count descending, then by creation date
      storiesWithReportCounts.sort((a, b) => {
        if (b.reportCount !== a.reportCount) return b.reportCount - a.reportCount;
        return b.created_at.seconds - b.created_at.seconds;
      });
      setStories(storiesWithReportCounts);
    } catch (error) {
      console.error('Error fetching admin data: ', error);
      toast.error('Could not load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ngo: NGORequest) => {
    if (!window.confirm(`Are you sure you want to approve ${ngo.name}?`)) return;
    
    const user = auth.currentUser;
    if (!user || !user.email) {
      toast.error("Could not identify approving admin.");
      return;
    }

    try {
      // 1. Add to the public 'ngos' collection
      await addDoc(collection(db, 'ngos'), {
        name: ngo.name,
        description: ngo.description,
        contact: ngo.contact,
        email: ngo.email,
        website: '', // Website is not in the request form, so it will be empty
        approved: true,
        approved_at: serverTimestamp(),
        approved_by: user.email,
      });

      // 2. Delete from the 'ngo_requests' collection
      await deleteDoc(doc(db, 'ngo_requests', ngo.id));

      toast.success(`${ngo.name} has been approved.`);
      // Refresh both lists
      fetchAllAdminData();
    } catch (error) {
      console.error('Error approving NGO: ', error);
      toast.error('Failed to approve NGO.');
    }
  };

  const handleReject = async (ngoId: string, ngoName: string) => {
    if (!window.confirm(`Are you sure you want to reject ${ngoName}?`)) return;

    try {
      await deleteDoc(doc(db, 'ngo_requests', ngoId));
      toast.success(`${ngoName} has been rejected.`);
      // Refresh the list of pending NGOs
      fetchAllAdminData();
    } catch (error) {
      console.error('Error rejecting NGO: ', error);
      toast.error('Failed to reject NGO.');
    }
  };

  const handleDeleteApprovedNGO = async (ngoId: string, ngoName: string) => {
    if (!window.confirm(`Are you sure you want to DELETE the approved NGO "${ngoName}"? This action cannot be undone.`)) return;

    try {
        await deleteDoc(doc(db, 'ngos', ngoId));
        toast.success(`${ngoName} has been deleted.`);
        setApprovedNGOs(prev => prev.filter(item => item.id !== ngoId));
    } catch (error) {
        console.error('Error deleting approved NGO: ', error);
        toast.error('Failed to delete NGO.');
    }
  };

  const handleDeleteStory = async (storyId: string, storyTitle: string) => {
    if (!window.confirm(`Are you sure you want to DELETE the story "${storyTitle}"? This will also delete all associated reactions and reports.`)) return;

    const toastId = toast.loading(`Deleting story...`);
    try {
      const batch = writeBatch(db);

      // 1. Delete the story itself
      batch.delete(doc(db, 'stories', storyId));

      // 2. Delete associated reactions
      const reactionsQuery = query(collection(db, 'reactions'), where('story_id', '==', storyId));
      const reactionsSnap = await getDocs(reactionsQuery);
      reactionsSnap.forEach(doc => batch.delete(doc.ref));

      // 3. Delete associated reports
      const reportsQuery = query(collection(db, 'reports'), where('story_id', '==', storyId));
      const reportsSnap = await getDocs(reportsQuery);
      reportsSnap.forEach(doc => batch.delete(doc.ref));

      await batch.commit();

      toast.success(`Story "${storyTitle}" has been deleted.`, { id: toastId });
      setStories(prev => prev.filter(item => item.id !== storyId));
    } catch (error) {
      console.error('Error deleting story: ', error);
      toast.error('Failed to delete story.', { id: toastId });
    }
  };

  if (loading) {
    return <div className="text-center p-10 text-gray-900 dark:text-white">Loading Admin Panel...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="text-center p-10 max-w-md mx-auto bg-white dark:bg-gray-900">
        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-500">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">You do not have permission to view this page. Please sign in with an admin account.</p>
        <button onClick={() => navigate('/auth')} className="mt-6 bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

      {/* Pending Requests Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Pending NGO Requests</h2>
        {pendingNGOs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">No pending requests.</p>
        ) : (
          <div className="space-y-6">
            {pendingNGOs.map(ngo => (
              <div key={ngo.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{ngo.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{ngo.description}</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Contact:</strong> {ngo.contact}</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Email:</strong> {ngo.email}</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Registration #:</strong> {ngo.registration_number}</p>
                <div className="mt-4 flex space-x-4">
                  <button onClick={() => handleApprove(ngo)} className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" /> Approve
                  </button>
                  <button onClick={() => handleReject(ngo.id, ngo.name)} className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    <XCircle className="h-5 w-5 mr-2" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>


      {/* Approved NGOs Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Approved NGOs</h2>
        {approvedNGOs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">No approved NGOs yet.</p>
        ) : (
          <div className="space-y-6">
            {approvedNGOs.map(ngo => (
              <div key={ngo.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{ngo.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{ngo.description}</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Contact:</strong> {ngo.contact}</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Email:</strong> {ngo.email}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  Approved by {ngo.approved_by} on {ngo.approved_at ? new Date(ngo.approved_at.seconds * 1000).toLocaleDateString() : 'N/A'}
                </p>
                <div className="mt-4 flex space-x-4">
                  <a href={`mailto:${ngo.email}`} className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    <Mail className="h-5 w-5 mr-2" /> Contact
                  </a>
                  <button onClick={() => handleDeleteApprovedNGO(ngo.id, ngo.name)} className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    <Trash2 className="h-5 w-5 mr-2" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Story Moderation Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Story Moderation</h2>
        {stories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">No stories to moderate.</p>
        ) : (
          <div className="space-y-6">
            {stories.map(story => (
              <div key={story.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{story.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 max-h-24 overflow-y-auto">{story.content}</p>
                  </div>
                  {story.reportCount && story.reportCount > 0 && (
                    <div className="flex-shrink-0 ml-4 text-sm inline-flex items-center bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2.5 py-1 rounded-full">
                      <Flag className="h-4 w-4 mr-1.5" />
                      {story.reportCount} {story.reportCount === 1 ? 'Report' : 'Reports'}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex space-x-4">
                  <button onClick={() => handleDeleteStory(story.id, story.title)} className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    <Trash2 className="h-5 w-5 mr-2" /> Delete Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}