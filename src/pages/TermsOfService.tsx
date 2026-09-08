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
                By accessing or using xnewsapp.com, you agree to these Terms of
                Service and any applicable laws, regulations, and third-party
                platform policies that apply to your use of our services.
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
                xnewsapp.com provides an AI Creator Studio that helps users
                create digital content using AI-powered tools. Depending on
                the available features, users may create videos, images,
                voiceovers, music, scripts, captions, and other digital media,
                then preview, export, download, or share their creations
                through supported platforms and services.
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
                    You are responsible for providing accurate information
                    when using xnewsapp.com.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You must comply with all applicable laws and the policies
                    of third-party platforms you connect to or use.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You are responsible for the prompts, uploads, instructions,
                    and other materials you submit to the platform.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You are responsible for reviewing AI-generated content
                    before publishing, downloading, or sharing it.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You must not use xnewsapp.com for unlawful, harmful,
                    fraudulent, abusive, or infringing activities.
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
                4. Social Media & Platform Use
              </h2>

              <p className="text-gray-700 mb-3">
                xnewsapp.com may provide features that allow users to export,
                download, or share content with third-party social media and
                digital platforms, including Facebook and other supported
                services.
              </p>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You are responsible for ensuring that you have the necessary
                    rights and permissions for content you publish or share.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    You must comply with the terms and policies of the
                    third-party platforms where you publish or share content.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    xnewsapp.com does not guarantee that a third-party platform
                    will accept, publish, distribute, or maintain your content.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Third-party platform features, availability, permissions,
                    and policies may change independently of xnewsapp.com.
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
                You retain ownership of content that you upload or provide to
                xnewsapp.com, subject to any rights belonging to third parties.
                You are responsible for ensuring that you have the necessary
                rights, licenses, and permissions to use such content.
              </p>

              <p className="text-gray-700 leading-relaxed mt-3">
                xnewsapp.com does not claim ownership of your original content.
                However, you grant us the permissions necessary to process,
                transmit, store, and provide the requested services for your
                content.
              </p>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Copyright className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                6. AI-Generated Content
              </h2>

              <p className="text-gray-700 leading-relaxed">
                AI-generated content may be produced using third-party
                artificial intelligence services. AI-generated results may
                contain inaccuracies, unexpected results, or material that
                requires review or modification.
              </p>

              <p className="text-gray-700 leading-relaxed mt-3">
                You are responsible for reviewing AI-generated content before
                using, publishing, downloading, or sharing it. xnewsapp.com
                does not guarantee that AI-generated content will be accurate,
                unique, suitable for a particular purpose, or free from
                third-party rights claims.
              </p>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                7. Acceptable Use
              </h2>

              <p className="text-gray-700 leading-relaxed mb-3">
                You agree not to use xnewsapp.com to create, upload, distribute,
                or share content or material that:
              </p>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Violates applicable laws or regulations.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Infringes intellectual property, privacy, publicity, or
                    other rights belonging to another person or organization.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Is fraudulent, abusive, malicious, or intended to harm
                    another person or service.
                  </span>
                </li>

                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>
                    Attempts to interfere with, disrupt, or gain unauthorized
                    access to xnewsapp.com or its services.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <FileText className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                8. Payments & Third-Party Services
              </h2>

              <p className="text-gray-700 leading-relaxed">
                Certain features or AI services on xnewsapp.com may require
                payment. Available prices, payment methods, and applicable
                charges will be presented to you before a paid service is
                processed.
              </p>

              <p className="text-gray-700 leading-relaxed mt-3">
                Payments may be processed through third-party payment
                providers. xnewsapp.com does not control the independent
                operation, availability, or policies of third-party payment
                providers or AI service providers.
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
                9. Service Availability & Limitation of Liability
              </h2>

              <p className="text-gray-700 leading-relaxed">
                We work to keep xnewsapp.com available and reliable, but we do
                not guarantee that the service will always be uninterrupted,
                error-free, or available at all times.
              </p>

              <p className="text-gray-700 leading-relaxed mt-3">
                AI generation services, payment services, cloud services,
                social media platforms, and other third-party services may
                experience interruptions, limitations, delays, or changes
                outside our control.
              </p>

              <p className="text-gray-700 leading-relaxed mt-3">
                To the extent permitted by applicable law, xnewsapp.com is not
                responsible for losses resulting from third-party service
                interruptions, rejected content, platform changes, or a user's
                use of generated or shared content.
              </p>
            </div>
          </div>
        </div>

        {/* Section 10 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <XCircle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                10. Suspension or Termination
              </h2>

              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate access to
                xnewsapp.com where we reasonably believe that a user has
                violated these Terms, applicable laws, third-party platform
                requirements, or used the service in a harmful or abusive
                manner.
              </p>
            </div>
          </div>
        </div>

        {/* Section 11 */}
        <div className="mb-12">
          <div className="flex items-start gap-4 mb-4">
            <Mail className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />

            <div>
              <h2 className="text-2xl font-bold mb-3">
                11. Contact
              </h2>

              <p className="text-gray-700 leading-relaxed">
                For questions regarding these Terms of Service, please contact
                us at:{' '}
               <a
  href="mailto:support@xnewsapp.com"
  className="text-blue-600 hover:underline font-medium"
>
  support@xnewsapp.com
</a>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-8 mb-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 xnewsapp.com. All rights reserved.
          </p>
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
