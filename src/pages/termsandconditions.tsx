import React from 'react';
import { FileText, Shield, Users, AlertCircle, Scale, Heart, MessageSquare, Lock } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <Scale className="h-16 w-16 text-pink-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
        <p className="text-xl text-gray-600">
          Guidelines for our supportive community
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: September 28, 2025
        </p>
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to SafeVoice</h2>
          <p className="text-lg mb-4">
            These Terms and Conditions govern your use of SafeVoice, a platform dedicated to empowering women 
            through shared stories and community support. By accessing or using our services, you agree to be 
            bound by these terms.
          </p>
          <p className="text-lg">
            We've designed these terms to protect our community while ensuring a safe, supportive environment 
            for all users. Please read them carefully.
          </p>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms at a Glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Respectful Community</h3>
            <p className="text-gray-600 text-sm">Treat all members with kindness and respect</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Shield className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Safety First</h3>
            <p className="text-gray-600 text-sm">We prioritize user safety and well-being</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Lock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Privacy Protected</h3>
            <p className="text-gray-600 text-sm">Your stories and data are kept secure</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Community Guidelines</h3>
            <p className="text-gray-600 text-sm">Clear rules for positive interactions</p>
          </div>
        </div>
      </section>

      {/* Acceptance of Terms */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acceptance of Terms</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              By creating an account, accessing, or using SafeVoice in any way, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
            </p>
            <div className="bg-pink-50 border-l-4 border-pink-500 p-4">
              <h3 className="font-semibold text-pink-800 mb-2">Age Requirement</h3>
              <p className="text-pink-700 text-sm">
                You must be at least 18 years old to use SafeVoice. By using our services, you represent and 
                warrant that you are 18 years of age or older.
              </p>
            </div>
            <p className="text-gray-600">
              If you do not agree with any part of these terms, you may not access or use our services.
            </p>
          </div>
        </div>
      </section>

      {/* Account Registration */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Registration & Responsibilities</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Creating Your Account</h3>
              <ul className="text-gray-600 space-y-2 ml-4">
                <li>• You must provide accurate and complete information during registration</li>
                <li>• You are responsible for maintaining the security of your account credentials</li>
                <li>• You may use a pseudonym or anonymous username for privacy</li>
                <li>• Only one account per person is permitted</li>
                <li>• You must notify us immediately of any unauthorized account access</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Account Security</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  You are solely responsible for all activities that occur under your account. We recommend using 
                  a strong, unique password and enabling two-factor authentication when available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Community Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">✓ We Encourage</h3>
              <ul className="space-y-2">
                <li>• Sharing your authentic experiences</li>
                <li>• Supporting and encouraging others</li>
                <li>• Respectful and constructive dialogue</li>
                <li>• Seeking and offering help when appropriate</li>
                <li>• Maintaining confidentiality of shared stories</li>
                <li>• Using content warnings for sensitive topics</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">✗ Strictly Prohibited</h3>
              <ul className="space-y-2">
                <li>• Harassment, bullying, or intimidation</li>
                <li>• Sharing others' personal information</li>
                <li>• Hate speech or discriminatory content</li>
                <li>• Explicit sexual content</li>
                <li>• Promotion of self-harm or suicide</li>
                <li>• Spam, advertising, or commercial content</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Content Guidelines */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Guidelines</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Content Rights</h3>
              <p className="text-gray-600 mb-3">
                You retain ownership of all content you post on SafeVoice. However, by posting content, you grant us 
                certain rights to display, store, and moderate your content as necessary to operate the platform.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Content License</h4>
                <p className="text-blue-700 text-sm">
                  You grant SafeVoice a limited, non-exclusive license to use your content solely for the purpose of 
                  providing our services. This license ends when you delete your content or account.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Content Standards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Appropriate Content</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Personal experiences and stories</li>
                    <li>• Supportive comments and advice</li>
                    <li>• Resources and helpful information</li>
                    <li>• Respectful discussions</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Prohibited Content</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Illegal activities or content</li>
                    <li>• Copyrighted material without permission</li>
                    <li>• False or misleading information</li>
                    <li>• Content that violates others' privacy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Usage */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Usage Rules</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Acceptable Use</h3>
              <p className="text-gray-600 mb-3">You agree to use SafeVoice only for its intended purpose:</p>
              <ul className="text-gray-600 space-y-1 ml-4">
                <li>• Sharing and reading personal stories and experiences</li>
                <li>• Providing and receiving community support</li>
                <li>• Accessing resources and information</li>
                <li>• Participating in respectful community discussions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Technical Restrictions</h3>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <h4 className="font-semibold text-red-800 mb-2">You Must Not:</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Attempt to hack, disrupt, or compromise our systems</li>
                  <li>• Use automated tools to scrape or harvest data</li>
                  <li>• Interfere with other users' experience</li>
                  <li>• Bypass security measures or access restrictions</li>
                  <li>• Upload malicious software or code</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moderation and Enforcement */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Moderation & Enforcement</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Content Moderation</h3>
              <p className="text-gray-600 mb-3">
                To maintain a safe environment, we reserve the right to review, moderate, and remove content that 
                violates these terms or our community guidelines.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Warning</h4>
                  <p className="text-yellow-700 text-sm">First violation may result in a warning and content removal</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Suspension</h4>
                  <p className="text-orange-700 text-sm">Repeated violations may lead to temporary suspension</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Termination</h4>
                  <p className="text-red-700 text-sm">Severe or persistent violations result in account termination</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Reporting System</h3>
              <p className="text-gray-600">
                If you encounter content or behavior that violates our guidelines, please report it using our 
                built-in reporting tools. All reports are reviewed promptly and confidentially.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy and Data */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Privacy & Data Protection</h2>
          <p className="mb-4">
            Your privacy is fundamental to our mission. Our comprehensive Privacy Policy details how we collect, 
            use, and protect your personal information.
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Key Privacy Commitments:</h3>
            <ul className="space-y-1">
              <li>• We never sell your personal data</li>
              <li>• You control your story visibility and sharing</li>
              <li>• Strong encryption protects your content</li>
              <li>• You can delete your account and data anytime</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Disclaimers</h2>
          
          <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-yellow-800 font-semibold">Not Professional Medical or Legal Advice</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    SafeVoice is a peer support platform. Content shared by users does not constitute professional 
                    medical, legal, or therapeutic advice. Always consult qualified professionals for serious issues.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Platform Availability</h3>
              <p className="text-gray-600">
                While we strive for 99.9% uptime, we cannot guarantee uninterrupted access to SafeVoice. We may 
                temporarily suspend services for maintenance, updates, or unforeseen circumstances.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">User-Generated Content</h3>
              <p className="text-gray-600">
                SafeVoice is not responsible for the accuracy, completeness, or reliability of user-generated content. 
                Users are solely responsible for their own posts and interactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              To the fullest extent permitted by law, SafeVoice, its founders, employees, and partners shall not be 
              liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Maximum Liability</h3>
              <p className="text-gray-600 text-sm">
                In any event, our total liability to you for all claims shall not exceed the amount you have paid 
                to SafeVoice in the 12 months preceding the claim (currently $0, as our service is free).
              </p>
            </div>
            
            <p className="text-gray-600">
              Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability for 
              incidental damages, so some of the above limitations may not apply to you.
            </p>
          </div>
        </div>
      </section>

      {/* Termination */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Termination</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Termination by You</h3>
              <p className="text-gray-600 mb-3">
                You may terminate your account at any time by:
              </p>
              <ul className="text-gray-600 space-y-1 ml-4">
                <li>• Using the account deletion feature in settings</li>
                <li>• Contacting our support team</li>
                <li>• Following our data deletion procedures</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Termination by Us</h3>
              <p className="text-gray-600 mb-3">
                We may terminate accounts for:
              </p>
              <ul className="text-gray-600 space-y-1 ml-4">
                <li>• Violations of these terms</li>
                <li>• Harmful behavior toward other users</li>
                <li>• Fraudulent or illegal activity</li>
                <li>• Extended periods of inactivity</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Effect of Termination</h3>
            <p className="text-blue-700 text-sm">
              Upon termination, your right to access SafeVoice will cease immediately. We will delete your personal 
              data according to our Privacy Policy, though some content may remain visible if it has been part of 
              community discussions.
            </p>
          </div>
        </div>
      </section>

      {/* Changes to Terms */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Changes to These Terms</h2>
          <p className="mb-4">
            We may update these Terms and Conditions from time to time to reflect changes in our services, 
            legal requirements, or community needs.
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">When we update these terms:</h3>
            <ul className="space-y-1">
              <li>• We'll notify you via email for significant changes</li>
              <li>• We'll post the updated date prominently</li>
              <li>• We'll provide a summary of key changes</li>
              <li>• Continued use after updates means you accept the new terms</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Legal Information */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Governing Law</h3>
              <p className="text-gray-600 text-sm">
                These terms shall be governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law provisions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Dispute Resolution</h3>
              <p className="text-gray-600 text-sm">
                Any disputes arising from these terms will be resolved through binding arbitration in 
                accordance with Indian arbitration law.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Severability</h3>
            <p className="text-gray-600 text-sm">
              If any provision of these terms is found to be unenforceable, the remaining provisions will 
              continue to be valid and enforceable.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mb-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions About These Terms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">General Questions</h3>
              <p className="text-gray-600 mb-2">
                For questions about these Terms and Conditions:
              </p>
              <p className="text-gray-600">
                Email: <a href="mailto:legal@safevoiceforwomen.com" className="text-pink-500 hover:text-pink-600">legal@safevoiceforwomen.com</a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Support & Help</h3>
              <p className="text-gray-600 mb-2">
                For platform support and assistance:
              </p>
              <p className="text-gray-600">
                Email: <a href="mailto:safevoiceforwomen@gmail.com" className="text-pink-500 hover:text-pink-600">safevoiceforwomen@gmail.com</a>
              </p>
            </div>
          </div>
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">
              <strong>Response Time:</strong> We aim to respond to all legal inquiries within 5 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-sm mb-2">
            By using SafeVoice, you acknowledge that you have read and understood these Terms and Conditions 
            and agree to be bound by them.
          </p>
          <p className="text-gray-500 text-xs">
            SafeVoice Terms and Conditions - Version 2.0 - Effective September 28, 2025
          </p>
        </div>
      </section>
    </div>
  );
}
