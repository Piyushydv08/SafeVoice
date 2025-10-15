import React from 'react';
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
import PrivacyPolicy from './pages/Privacypolicy';
import Termsandconditions from './pages/termsandconditions';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50">
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
