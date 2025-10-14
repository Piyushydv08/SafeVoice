import React from 'react';
import { Shield, Eye, Lock, Users, AlertTriangle, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900">
      <div className="text-center mb-12">
        <Shield className="h-16 w-16 text-pink-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Your privacy and safety are our highest priorities
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Last updated: September 28, 2025
        </p>
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-4">Our Commitment to Your Privacy</h2>
          <p className="text-lg mb-4">
            At SafeVoice, we understand that sharing personal stories requires immense trust. This Privacy Policy 
            explains how we collect, use, protect, and respect your personal information when you use our platform.
          </p>
          <p className="text-lg">
            We are committed to maintaining the highest standards of privacy protection because we know that 
            your safety and confidentiality are essential to creating a supportive community.
          </p>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy at a Glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Eye className="h-8 w-8 text-blue-500 mb-3" />
            <h3 className="font-semibold mb-2 dark:text-white">What We Collect</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Only essential information needed to provide our services and ensure safety</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Lock className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="font-semibold mb-2 dark:text-white">How We Protect</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Industry-standard encryption and security measures to safeguard your data</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Users className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="font-semibold mb-2 dark:text-white">Who Can Access</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Strict access controls ensure only authorized personnel can view your information</p>
          </div>
        </div>
      </section>

      {/* Information We Collect */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Information We Collect</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Account Information</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                <li>• Email address (for account creation and communication)</li>
                <li>• Username or display name (can be anonymous/pseudonymous)</li>
                <li>• Password (encrypted and never stored in plain text)</li>
                <li>• Profile information you choose to share</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Content You Share</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                <li>• Stories and experiences you post</li>
                <li>• Comments and support messages</li>
                <li>• Any additional content you voluntarily share</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Technical Information</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                <li>• IP address and location data (for security purposes)</li>
                <li>• Browser type and device information</li>
                <li>• Usage patterns and interaction data</li>
                <li>• Cookies and similar technologies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How We Use Information */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How We Use Your Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-600 dark:text-gray-300"><strong>Platform Operations:</strong> To provide, maintain, and improve our services</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-600 dark:text-gray-300"><strong>Safety & Security:</strong> To protect users from harassment, spam, and abuse</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-600 dark:text-gray-300"><strong>Communication:</strong> To send important updates, safety alerts, and support resources</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-600 dark:text-gray-300"><strong>Legal Compliance:</strong> To comply with applicable laws and respond to legal requests</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3"></div>
              <p className="text-gray-600 dark:text-gray-300"><strong>Community Building:</strong> To foster a supportive and safe environment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">How We Protect Your Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Technical Safeguards</h3>
              <ul className="space-y-2">
                <li>• End-to-end encryption for sensitive communications</li>
                <li>• Secure servers with regular security updates</li>
                <li>• Multi-factor authentication options</li>
                <li>• Regular security audits and assessments</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Access Controls</h3>
              <ul className="space-y-2">
                <li>• Strict employee access policies</li>
                <li>• Regular staff training on privacy practices</li>
                <li>• Audit logs for all data access</li>
                <li>• Background checks for personnel</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sharing and Disclosure */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">When We Share Information</h2>
          
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-800 dark:text-red-300 font-semibold">We Never Sell Your Data</h3>
                <p className="text-red-700 dark:text-red-300 text-sm">SafeVoice will never sell, rent, or trade your personal information to third parties for commercial purposes.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Limited Sharing Scenarios</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">We may share information only in these specific circumstances:</p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                <li>• <strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                <li>• <strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
                <li>• <strong>Safety Emergencies:</strong> To prevent immediate harm to you or others</li>
                <li>• <strong>Service Providers:</strong> With trusted partners who help operate our platform (under strict agreements)</li>
                <li>• <strong>Business Transfers:</strong> In the event of a merger or acquisition (with continued privacy protections)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Privacy Rights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Access & Control</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">View and update your personal information anytime</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Data Portability</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Request a copy of your data in a portable format</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Deletion Rights</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Request deletion of your account and associated data</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Communication Preferences</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Control what communications you receive from us</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Anonymity Options</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Use pseudonyms and control your visibility</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">Correction Rights</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Request correction of inaccurate information</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Data Retention</h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              We retain your personal information only for as long as necessary to provide our services and fulfill the purposes outlined in this policy.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Retention Periods</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-1">
                <li>• <strong>Active accounts:</strong> Data retained while account is active</li>
                <li>• <strong>Inactive accounts:</strong> Deleted after 2 years of inactivity</li>
                <li>• <strong>Deleted accounts:</strong> Most data deleted within 30 days</li>
                <li>• <strong>Legal holds:</strong> Some data may be retained longer if required by law</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cookies and Tracking */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cookies and Tracking</h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              We use cookies and similar technologies to enhance your experience and ensure platform security.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Essential Cookies</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Required for basic site functionality and security</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Preference Cookies</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Remember your settings and preferences</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Analytics Cookies</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Help us improve our platform (optional)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third Party Services */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Third-Party Services</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We carefully select third-party services that meet our high privacy and security standards. These may include:
          </p>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2 ml-4">
            <li>• Cloud hosting providers (for secure data storage)</li>
            <li>• Email service providers (for account communications)</li>
            <li>• Security services (for fraud prevention and protection)</li>
            <li>• Analytics tools (for platform improvement)</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            All third-party partners are required to maintain strict confidentiality and use your information only for providing services to SafeVoice.
          </p>
        </div>
      </section>

      {/* Updates to Policy */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Policy Updates</h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">When we update this policy:</h3>
            <ul className="space-y-1">
              <li>• We'll notify you via email for significant changes</li>
              <li>• The updated date will be clearly displayed</li>
              <li>• We'll provide a summary of key changes</li>
              <li>• Your continued use constitutes acceptance of updates</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy Questions & Requests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 dark:text-white">General Privacy Questions</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                For questions about this Privacy Policy or our privacy practices:
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Email: <a href="mailto:privacy@safevoiceforwomen.com" className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300">privacy@safevoiceforwomen.com</a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 dark:text-white">Data Rights Requests</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                To exercise your privacy rights (access, delete, correct data):
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Email: <a href="mailto:datarights@safevoiceforwomen.com" className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300">datarights@safevoiceforwomen.com</a>
              </p>
            </div>
          </div>
          <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              <strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 48 hours and complete data requests within 30 days.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            This Privacy Policy is part of our Terms of Service. By using SafeVoice, you agree to both documents.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
            SafeVoice Privacy Policy - Version 2.0 - Effective September 28, 2025
          </p>
        </div>
      </section>
    </div>
  );
}