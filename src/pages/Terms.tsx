import { FileText, Shield, Users, Facebook, Copyright, AlertTriangle, XCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Terms of Service</h1>
          <p className="text-xl text-center text-blue-100">Bearer of News Platform Agreement</p>
          <p className="text-center text-blue-200 mt-2">Last Updated: {currentDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Section 1 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By using Bearer of News, you agree to these Terms and Facebook's Platform Policies.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <FileText className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">2. Service Description</h2>
              <p className="text-gray-700 leading-relaxed">
                Bearer of News is a collaboration platform that helps Facebook Page administrators manage content creation and approval workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Users className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">3. User Responsibilities</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You must have legitimate administrative rights to Facebook Pages you connect</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You comply with all applicable laws and Facebook's policies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You are responsible for content created through our platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You maintain final approval authority for all published content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Facebook className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">4. Facebook Platform Compliance</h2>
              <p className="text-gray-700 mb-3">Our app complies with Facebook Platform Policies:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>No auto-posting - all publishing requires manual user action</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>We only access necessary data for collaboration features</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>We don't store Facebook login credentials</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Copyright className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">5. Content Ownership</h2>
              <p className="text-gray-700 leading-relaxed">
                You retain all rights to content created through Bearer of News. We claim no ownership over your posts or media.
              </p>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">6. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                We are not responsible for content posted to Facebook through our platform. Page administrators retain full control and responsibility.
              </p>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <XCircle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">7. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend accounts that violate these terms or Facebook's policies.
              </p>
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Mail className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">8. Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions: <a href="mailto:enockmose743@gmail.com" className="text-blue-600 hover:underline font-medium">enockmose743@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
          <p className="text-gray-700 mb-6">Contact us or learn more about Bearer of News</p>
          <Button onClick={() => navigate('/about')} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Learn More About Us
          </Button>
        </div>
      </div>
    </div>
  );
}
