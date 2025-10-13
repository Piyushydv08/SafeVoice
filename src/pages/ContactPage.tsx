import { useState } from 'react';
import { Mail, Linkedin, Send, User, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    body: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Formspree will handle the submission
    const form = e.target as HTMLFormElement;
    form.submit();
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Contact{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 animate-pulse">
            SafeVoice
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get in touch with our team. We're here to listen, support, and help you in any way we can.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-[1.01] transition duration-500">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
          <p className="text-gray-600 mb-8">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <form 
            action="https://formspree.io/f/{your-formspree-id}" 
            method="POST"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="What is this regarding?"
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <textarea
                  id="body"
                  name="body"
                  required
                  rows={6}
                  value={formData.body}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Team Information */}
        <div className="space-y-8">
          {/* Team Members */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl shadow-lg p-8 transition-all duration-500 hover:scale-[1.02] hover:shadow-pink-400/40">
            <h2 className="text-3xl font-bold mb-6">Our Team</h2>
            <p className="text-lg mb-8 opacity-90">
              Meet the dedicated individuals behind SafeVoice who are committed to creating a safe space for women.
            </p>
            
            <div className="space-y-6">
              {/* Piyush Yadav */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-3">Piyush Yadav</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-yellow-300" />
                    <a 
                      href="mailto:piyushydv011@gmail.com"
                      className="text-yellow-300 hover:text-yellow-200 hover:underline transition-colors"
                    >
                      piyushydv011@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-5 w-5 text-yellow-300" />
                    <a 
                      href="https://linkedin.com/in/piyushydv08"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-300 hover:text-yellow-200 hover:underline transition-colors"
                    >
                      linkedin.com/in/piyushydv08
                    </a>
                  </div>
                </div>
              </div>

              {/* Aditi Raj */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-3">Aditi Raj</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-yellow-300" />
                    <a 
                      href="mailto:aditiraj0205@gmail.com"
                      className="text-yellow-300 hover:text-yellow-200 hover:underline transition-colors"
                    >
                      aditiraj0205@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-5 w-5 text-yellow-300" />
                    <a 
                      href="https://linkedin.com/in/aditiraj2006"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-300 hover:text-yellow-200 hover:underline transition-colors"
                    >
                      linkedin.com/in/aditiraj2006
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Contact Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-[1.01] transition duration-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Other Ways to Reach Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-pink-500" />
                <div>
                  <p className="font-semibold text-gray-900">General Inquiries</p>
                  <a 
                    href="mailto:safevoiceforwomen@gmail.com"
                    className="text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    safevoiceforwomen@gmail.com
                  </a>
                </div>
              </div>
              <div className="text-gray-600">
                <p className="font-semibold">Response Time</p>
                <p>We typically respond within 24-48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}