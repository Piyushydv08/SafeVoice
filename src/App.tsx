import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SafetyProvider, useSafety } from './context/SafetyContext';
import DisguiseView from './components/DisguiseView';
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
import PrivacyPolicy from './pages/Privacypolicy';
import Termsandconditions from './pages/termsandconditions';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';



function AppContent() {
  const { isDisguised } = useSafety();

  return (
    <Router>
      <ScrollToTop />
      {/* // Global back-to-top button available across all pages */}
      <BackToTop />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {isDisguised && <DisguiseView />}
        <div 
          aria-hidden={isDisguised ? 'true' : undefined}
          style={isDisguised ? { display: 'none' } : undefined}
        >
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
        </div>
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <SafetyProvider>
        <AppContent />
      </SafetyProvider>
    </ThemeProvider>
  );
}

export default App;
