import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Stories from './pages/Stories';
import ShareStory from './pages/ShareStory';
import Resources from './pages/Resources';
import About from './pages/About';
import Auth from './pages/Auth';
import Footer from './components/Footer';
import EditStory from './pages/EditStory';
import AdminDashboard from './pages/AdminDashboard';
import FAQs from './pages/FAQs';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import QuickExit from './components/QuickExit';
import PrivacyPolicy from './pages/Privacypolicy';
import Termsandconditions from './pages/termsandconditions';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading out after 600ms
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 600);

    // Completely remove from DOM after 1000ms
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <ThemeProvider>
      {isLoading && <LoadingScreen isFading={isFading} />}
      <Router>
        <ScrollToTop />
        {/* // Global back-to-top button available across all pages */}
        <BackToTop />
        <QuickExit />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/share-story" element={<ShareStory />} />
              <Route path="/edit-story/:id" element={<EditStory />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/about" element={<About />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
              <Route path="/termsandconditions" element={<Termsandconditions />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-center" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
