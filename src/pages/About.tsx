import React from 'react';
import { Users, Heart, Shield, MessageSquare, Link as LinkIcon } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About SafeVoice</h1>
        <p className="text-xl text-gray-600">
          Empowering women through shared stories and support
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg">
            SafeVoice is dedicated to creating a secure and supportive space where women can share their stories,
            find strength in community, and access resources for healing and empowerment. We believe that every
            voice matters and that sharing our experiences can lead to collective healing and positive change.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Shield className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Safety</h3>
            <p className="text-gray-600">
              Providing a secure platform for women to share their experiences without fear
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Community</h3>
            <p className="text-gray-600">
              Building a supportive network of understanding and encouragement
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Empowerment</h3>
            <p className="text-gray-600">
              Strengthening women through shared experiences and resources
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <MessageSquare className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Voice</h3>
            <p className="text-gray-600">
              Amplifying stories that need to be heard and acknowledged
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-pink-500 mb-2">10</div>
            <p className="text-gray-600">Stories Shared</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-pink-500 mb-2">50</div>
            <p className="text-gray-600">Community Members</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-pink-500 mb-2">10</div>
            <p className="text-gray-600">Support Messages</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            We're here to listen and support. Reach out to us at any time:
          </p>
          <div className="space-y-2">
            <p className="text-gray-600">
              Email: <a href="mailto:safevoice@gmail.com" className="text-pink-500 hover:text-pink-600">safevoiceforwomen@gmail.com</a>
            </p>
            <p className="text-gray-600">
              For immediate support, please visit our Resources page for emergency contact numbers and support services.
            </p>
          </div>
        </div>
      </section>
      
      {/* Added Secondary Links Section */}
      <section className="mb-16">
        <div className="bg-gray-50 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/privacy" className="flex items-center gap-2 text-gray-700 hover-link">
              <LinkIcon className="h-5 w-5 text-pink-500" /> Privacy Policy
            </a>
            <a href="/terms" className="flex items-center gap-2 text-gray-700 hover-link">
              <LinkIcon className="h-5 w-5 text-pink-500" /> Terms & Conditions
            </a>
            <a href="/resources" className="flex items-center gap-2 text-gray-700 hover-link">
              <LinkIcon className="h-5 w-5 text-pink-500" /> Resources
            </a>
            <a href="/faq" className="flex items-center gap-2 text-gray-700 hover-link">
              <LinkIcon className="h-5 w-5 text-pink-500" /> FAQs
            </a>
          </div>
        </div>
      </section>
      {/* End Secondary Links */}

      {/* Owners Section */}
      <section>
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Founders : </h2>
          <div className="space-y-4">
          <p className="text-lg">
              <strong>Aditi Raj</strong> - <a href="mailto:aditiraj0205@gmail.com" className="text-yellow-300 hover:underline">aditiraj0205@gmail.com</a>
            </p>
            <p className="text-lg">
              <strong>Piyush Yadav</strong> - <a href="mailto:piyushydv011@gmail.com" className="text-yellow-300 hover:underline">piyushydv011@gmail.com</a>
            </p>
            
          </div>
        </div>
      </section>
    </div>
  );
}
