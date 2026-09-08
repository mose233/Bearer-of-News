import {
  FileText,
  Shield,
  Users,
  Facebook,
  Copyright,
  AlertTriangle,
  XCircle,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-16 w-16" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Terms of Service
          </h1>

          <p className="text-xl text-center text-blue-100">
            xnewsapp.com Platform Agreement
          </p>

          <p className="text-center text-blue-200 mt-2">
            Last Updated: {currentDate}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Section 1 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                1. Acceptance of Terms
              </h2>

              <p className="text-gray-700 leading-relaxed">
                By using xnewsapp.com, you agree to these Terms of Service. If
                you do not agree with these terms, please do not use the
                service.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <FileText className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                2. Service Description
              </h2>

              <p className="text-gray-700 leading-relaxed">
                xnewsapp.com is an AI Creator Studio that helps users create,
                edit, review, export, download, and share AI-assisted videos,
                images, voiceovers, music, captions, drafts, campaigns, and
                other creative content.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Users className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                3. User Responsibilities
              </h2>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You are responsible for the content you create, upload,
                    review, download, share, or publish.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You must only use media, music, images, videos, names,
                    likenesses, and other materials that you own or have
                    permission to use.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You must comply with applicable laws and the rules of
                    platforms where you share or publish content.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You remain responsible for reviewing and approving content
                    before sharing or publishing it.
                  </span>
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
              <h2 className="text-2xl font-bold mb-3">
                4. Social Media &amp; Platform Use
              </h2>

              <p className="text-gray-700 mb-3">
                xnewsapp.com may provide features that allow users to connect
                with or share content to supported social media platforms.
              </p>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You may only connect accounts, Pages, or profiles that you
                    are authorized to manage.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You are responsible for complying with the policies and
                    requirements of each platform you use.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Publishing or sharing content requires user action and
                    authorization.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    xnewsapp.com does not require or store your social media
                    login passwords.
                  </span>
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
              <h2 className="text-2xl font-bold mb-3">
                5. Content Ownership
              </h2>

              <p className="text-gray-700 leading-relaxed">
                You retain your rights to content you create or upload through
                xnewsapp.com, subject to any rights belonging to third parties
                and any applicable third-party service terms. xnewsapp.com does
                not claim ownership of your original content.
              </p>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                6. AI-Generated Content
              </h2>

              <p className="text-gray-700 leading-relaxed">
                AI-generated content may be inaccurate, incomplete, unexpected,
                or unsuitable for publishing without review. You are
                responsible for reviewing generated captions, visuals,
                voiceovers, music, claims, and other content before downloading,
                sharing, or publishing it.
              </p>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <XCircle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                7. Acceptable Use &amp; Termination
              </h2>

              <p className="text-gray-700 leading-relaxed">
                You agree not to use xnewsapp.com for spam, fake engagement,
                harassment, impersonation, deceptive or fraudulent content,
                copyright misuse, unauthorized media, harmful content,
                misleading claims, or unlawful activities. We reserve the
                right to suspend or restrict access where necessary if an
                account or use of the service violates these terms or
                applicable laws.
              </p>
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Mail className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                8. Payments &amp; Third-Party Services
              </h2>

              <p className="text-gray-700 leading-relaxed">
                Some features of xnewsapp.com may require payment. Payment,
                AI generation, hosting, storage, authentication, analytics,
                social media, and other features may depend on third-party
                service providers. Third-party services may have their own
                terms and policies, and xnewsapp.com is not responsible for
                interruptions, changes, or decisions made by those providers.
              </p>
            </div>
          </div>
        </div>

        {/* Section 9 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                9. Service Availability &amp; Limitation of Liability
              </h2>

              <p className="text-gray-700 leading-relaxed">
                xnewsapp.com may update, improve, pause, restrict, or
                discontinue parts of the service at any time. To the extent
                permitted by law, xnewsapp.com is not responsible for losses
                resulting from user-created or AI-generated content, platform
                decisions, third-party services, service interruptions,
                payment provider issues, or misuse of the service.
              </p>
            </div>
          </div>
        </div>

        {/* Section 10 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Mail className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">10. Contact</h2>

              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms of Service:{' '}
                <a
                  href="mailto:enockmose743@gmail.com"
                  className="text-blue-600 hover:underline font-medium"
                >
                  enockmose743@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Copyright className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">11. Copyright</h2>

              <p className="text-gray-700 leading-relaxed">
                © 2024 xnewsapp.com. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Questions About Our Terms?
          </h3>

          <p className="text-gray-700 mb-6">
            Contact us or learn more about xnewsapp.com
          </p>

          <Button
            onClick={() => navigate('/about')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Learn More About Us
          </Button>
        </div>
      </div>
    </div>
  );
}
