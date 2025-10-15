import  { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Shield, Users, Phone, Mail, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

const faqData: FAQ[] = [
  // Reporting Process
  {
    id: '1',
    question: 'How do I share my story anonymously?',
    answer: 'You can share your story by visiting the "Share your Story" page. You don\'t need to provide any personal information - we only require the story content. You can optionally attach photos or audio recordings to support your narrative.',
    category: 'Reporting Process',
    helpful: 45,
    notHelpful: 3
  },
  {
    id: '2',
    question: 'Can I edit or delete my story after submitting?',
    answer: 'Yes, if you are signed in, you can edit or delete your stories from your dashboard. For complete anonymity, stories submitted without an account cannot be modified later.',
    category: 'Reporting Process',
    helpful: 32,
    notHelpful: 5
  },
  {
    id: '3',
    question: 'What types of media can I attach to my story?',
    answer: 'You can attach photos (JPEG, PNG) and audio recordings (MP3, WAV) to your story. All media is stored securely and encrypted. Please ensure you have the right to share any media you upload.',
    category: 'Reporting Process',
    helpful: 28,
    notHelpful: 2
  },
  
  // Privacy & Security
  {
    id: '4',
    question: 'How is my anonymity protected?',
    answer: 'We use advanced security measures including encrypted storage, no IP tracking for anonymous submissions, and secure authentication. Your personal information is never linked to your stories unless you choose to create an account.',
    category: 'Privacy & Security',
    helpful: 67,
    notHelpful: 1
  },
  {
    id: '5',
    question: 'Who can see my story?',
    answer: 'Stories are visible to the SafeVoice community and verified NGOs who can provide support. We do not share stories with law enforcement or other parties without explicit consent.',
    category: 'Privacy & Security',
    helpful: 54,
    notHelpful: 4
  },
  {
    id: '6',
    question: 'Is my data safe and encrypted?',
    answer: 'Yes, all data is encrypted both in transit and at rest using industry-standard security protocols. We use Firebase\'s secure infrastructure and follow strict data protection guidelines.',
    category: 'Privacy & Security',
    helpful: 41,
    notHelpful: 2
  },

  // NGO Support
  {
    id: '7',
    question: 'How do I find NGOs that can help me?',
    answer: 'Visit our Resources page to browse verified NGOs by location and specialization. You can search by keywords, filter by services offered, and contact them directly through the provided information.',
    category: 'NGO Support',
    helpful: 38,
    notHelpful: 3
  },
  {
    id: '8',
    question: 'How are NGOs verified on the platform?',
    answer: 'NGOs undergo a thorough verification process including document verification, background checks, and review of their services. Only legitimate organizations with proven track records are approved.',
    category: 'NGO Support',
    helpful: 29,
    notHelpful: 1
  },
  {
    id: '9',
    question: 'Can NGOs contact me directly?',
    answer: 'NGOs cannot access your personal information unless you choose to share it. If you want support, you can contact them directly using the information provided on their profiles.',
    category: 'NGO Support',
    helpful: 33,
    notHelpful: 4
  },

  // Technical Help
  {
    id: '10',
    question: 'What languages are supported for translation?',
    answer: 'Our AI-powered translation supports 8+ Indian languages including Hindi, Bengali, Tamil, Telugu, Gujarati, Marathi, Kannada, and Malayalam, plus English.',
    category: 'Technical Help',
    helpful: 26,
    notHelpful: 2
  },
  {
    id: '11',
    question: 'How does the grammar correction feature work?',
    answer: 'Our AI grammar correction uses Google Gemini AI to automatically improve the clarity and readability of your text while preserving your original message and intent.',
    category: 'Technical Help',
    helpful: 22,
    notHelpful: 3
  },
  {
    id: '12',
    question: 'I\'m having trouble uploading media files. What should I do?',
    answer: 'Ensure your files are under 10MB and in supported formats (JPEG, PNG for images; MP3, WAV for audio). Try refreshing the page or using a different browser if issues persist.',
    category: 'Technical Help',
    helpful: 19,
    notHelpful: 5
  }
];

const categories = ['All', 'Reporting Process', 'Privacy & Security', 'NGO Support', 'Technical Help'];

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());

  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleFeedback = (faqId: string, isHelpful: boolean) => {
    if (feedbackGiven.has(faqId)) return;
    
    setFeedbackGiven(prev => new Set(prev).add(faqId));
    // In a real app, you would send this feedback to your backend
    console.log(`Feedback for FAQ ${faqId}: ${isHelpful ? 'helpful' : 'not helpful'}`);
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <HelpCircle className="h-12 w-12 text-pink-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about SafeVoice. Can't find what you're looking for? 
            <Link to="/resources" className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 ml-1">Contact our support team</Link>.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredFAQs.length} of {faqData.length} questions
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </div>
        </div>

        {/* FAQ Categories Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.slice(1).map((category) => {
            const iconMap = {
              'Reporting Process': HelpCircle,
              'Privacy & Security': Shield,
              'NGO Support': Users,
              'Technical Help': Phone
            };
            const Icon = iconMap[category as keyof typeof iconMap];
            const count = faqData.filter(faq => faq.category === category).length;
            
            return (
              <div
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  selectedCategory === category ? 'ring-2 ring-pink-500 bg-pink-50 dark:bg-pink-900/20' : ''
                }`}
              >
                <Icon className={`h-8 w-8 mb-3 ${
                  selectedCategory === category 
                    ? 'text-pink-600 dark:text-pink-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`} />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{category}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{count} questions</p>
              </div>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <HelpCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No FAQs found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{faq.question}</h3>
                    <span className="text-sm text-pink-500 dark:text-pink-400 font-medium">{faq.category}</span>
                  </div>
                  {expandedFAQ === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  )}
                </button>

                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6 animate-fade-in">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{faq.answer}</p>
                      
                      {/* Feedback Section */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Was this answer helpful?</span>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleFeedback(faq.id, true)}
                            disabled={feedbackGiven.has(faq.id)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                              feedbackGiven.has(faq.id)
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400'
                            }`}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>Yes ({faq.helpful})</span>
                          </button>
                          <button
                            onClick={() => handleFeedback(faq.id, false)}
                            disabled={feedbackGiven.has(faq.id)}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                              feedbackGiven.has(faq.id)
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : 'hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400'
                            }`}
                          >
                            <ThumbsDown className="h-4 w-4" />
                            <span>No ({faq.notHelpful})</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-lg mb-6">
            If you couldn't find the answer you're looking for, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/resources"
              className="inline-flex items-center px-6 py-3 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
            >
              <Users className="h-5 w-5 mr-2" />
              Contact NGO Support
            </Link>
            <a
              href="mailto:safevoiceforwomen@gmail.com"
              className="inline-flex items-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200 font-semibold"
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}