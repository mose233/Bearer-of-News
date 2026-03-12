import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Mail, FileText, Users } from 'lucide-react';

export default function Privacy() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-center text-blue-100">
            Your privacy is important to us
          </p>
          <p className="text-center text-blue-200 mt-4">
            <strong>Last Updated:</strong> {currentDate}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section 1 */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              1. Information We Collect
            </h2>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            We collect the following personal information when you use Bearer of News:
          </p>
          <ul className="space-y-3 ml-6">
            <li className="text-gray-700">
              <strong>Email Address:</strong> From your Facebook profile when you log in
            </li>
            <li className="text-gray-700">
              <strong>First and Last Name:</strong> From your Facebook profile
            </li>
            <li className="text-gray-700">
              <strong>Facebook Profile Information:</strong> Including your Facebook Pages and access permissions
            </li>
            <li className="text-gray-700">
              <strong>Content:</strong> Draft posts, images, and collaboration data you create in our app
            </li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Eye className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              2. How We Use Your Information
            </h2>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            We use your information solely to provide our collaboration services:
          </p>
          <ul className="space-y-3 ml-6">
            <li className="text-gray-700">
              To authenticate you via Facebook Login
            </li>
            <li className="text-gray-700">
              To verify your Page management permissions
            </li>
            <li className="text-gray-700">
              To facilitate content collaboration between team members
            </li>
            <li className="text-gray-700">
              To send notifications about draft content and approvals
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              3. Facebook Data Usage
            </h2>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            We access your Facebook data through Facebook's API to:
          </p>
          <ul className="space-y-3 ml-6 mb-4">
            <li className="text-gray-700">
              Verify your identity and Page administrator status
            </li>
            <li className="text-gray-700">
              Display your managed Facebook Pages
            </li>
            <li className="text-gray-700">
              Enable collaboration features for your Pages
            </li>
          </ul>
          <p className="text-lg text-gray-700 font-semibold">
            We never post to your Facebook Pages automatically. All publishing requires manual approval.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Lock className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              4. Data Protection
            </h2>
          </div>
          <p className="text-lg text-gray-700">
            We implement security measures to protect your data and comply with GDPR requirements.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Mail className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              5. Contact Our Data Protection Officer
            </h2>
          </div>
          <p className="text-lg text-gray-700">
            For privacy concerns, contact:{' '}
            <a 
              href="mailto:enockmose743@gmail.com" 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              enockmose743@gmail.com
            </a>
          </p>
        </div>

        {/* Section 6 */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              6. Your Rights
            </h2>
          </div>
          <p className="text-lg text-gray-700">
            You can request access, correction, or deletion of your personal data at any time.
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Questions About Our Privacy Policy?
          </h3>
          <p className="text-gray-700 mb-6">
            We're here to help. Contact us anytime with your privacy concerns.
          </p>
          <Link
            to="/about"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
