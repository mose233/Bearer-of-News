import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const TermsOfService: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#0B1020] text-white">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center text-sm font-bold text-slate-300 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-8 rounded-[1.5rem] border border-white/10 bg-[#111827] p-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm font-bold text-violet-100">
            <FileText className="h-4 w-4" />
            Terms of Service
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Bearer of News / XNewsApp Terms of Service
          </h1>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
            Last updated: 2026
          </p>
        </div>

        <div className="space-y-6 rounded-[1.5rem] border border-white/10 bg-[#111827] p-6 text-sm leading-7 text-slate-300">
          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By using Bearer of News / XNewsApp, you agree to these Terms of
              Service. If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              2. What the Service Does
            </h2>
            <p>
              Bearer of News / XNewsApp helps users create, review, export, and
              share Facebook-ready posts, AI-assisted videos, captions, drafts,
              campaigns, and related creative content.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              3. User Responsibility
            </h2>
            <p>
              You are responsible for the content you create, upload, review,
              download, share, or publish. You should only use media, music,
              images, videos, names, likenesses, and materials that you own or
              have permission to use.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              4. AI-Generated Content
            </h2>
            <p>
              AI-generated content may be inaccurate, incomplete, or unsuitable
              for publishing without review. You must review captions, visuals,
              voiceovers, claims, and generated media before sharing or
              publishing.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              5. Facebook / Meta Use
            </h2>
            <p>
              If you connect Facebook, you agree to use Meta-related features
              responsibly and only with Pages or accounts you are authorized to
              manage. Bearer of News is designed around manual review and user
              action before sharing or publishing.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              6. No Auto-Publishing Without User Action
            </h2>
            <p>
              The service is intended to support user-controlled workflows.
              Content should not be published automatically without the user
              reviewing and choosing to share or publish.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              7. Acceptable Use
            </h2>
            <p>
              You agree not to use the service for spam, fake engagement,
              harassment, impersonation, deceptive content, copyright misuse,
              unauthorized media, harmful content, or misleading claims. You
              must follow applicable laws and platform rules where you share
              content.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              8. Team Review and Approval
            </h2>
            <p>
              If you use team collaboration features, you are responsible for
              ensuring drafts are reviewed and approved by the right people
              before sharing or publishing.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              9. Service Availability
            </h2>
            <p>
              We may update, improve, pause, or discontinue parts of the service
              at any time. Some AI, export, Facebook, or third-party features
              may depend on external services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              10. Limitation of Liability
            </h2>
            <p>
              Bearer of News / XNewsApp is provided as a creative and content
              management tool. To the extent allowed by law, we are not
              responsible for losses resulting from user-created content,
              platform decisions, third-party services, or misuse of the app.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              11. Contact
            </h2>
            <p>
              For questions about these Terms, contact Bearer of News / XNewsApp
              support through the contact method provided on the website.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              12. Copyright
            </h2>
            <p>© 2024 Bearer of News. All rights reserved.</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsOfService;
