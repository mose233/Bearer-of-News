import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-100">
            <ShieldCheck className="h-4 w-4" />
            Privacy Policy
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Bearer of News / XNewsApp Privacy Policy
          </h1>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
            Last updated: 2026
          </p>
        </div>

        <div className="space-y-6 rounded-[1.5rem] border border-white/10 bg-[#111827] p-6 text-sm leading-7 text-slate-300">
          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              1. Overview
            </h2>
            <p>
              Bearer of News / XNewsApp helps users create, review, export, and
              share Facebook-ready posts, videos, captions, and campaigns. This
              Privacy Policy explains how we handle information when you use our
              website, Creator Studio, Meta/Facebook connection, uploads, and AI
              content tools.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              2. Information We May Collect
            </h2>
            <p>
              We may collect account information such as your name, email
              address, login details, connected Facebook Page information,
              uploaded media, generated content, captions, drafts, and technical
              information needed to keep the service working.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              3. Meta / Facebook Connection
            </h2>
            <p>
              If you choose to connect Facebook, we use Meta-authorized login
              and permissions to help you identify your account and available
              Pages. We only request permissions needed for the features shown
              in the app. Facebook connection is optional until you choose to
              share or publish through Meta-supported workflows.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              4. User Uploads and AI Content
            </h2>
            <p>
              You may upload images, videos, audio, captions, and prompts to
              create content. You are responsible for using media you own or
              have permission to use. AI-generated content should be reviewed
              before sharing or publishing.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              5. How We Use Information
            </h2>
            <p>
              We use information to provide the app, generate and preview
              content, support exports, improve the product, maintain security,
              support account features, and help users manage content workflows.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              6. Publishing and Sharing
            </h2>
            <p>
              Bearer of News is designed for manual review. We do not intend to
              auto-publish content without user action. Users should review
              their content before downloading, sharing, or publishing to any
              platform.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              7. Data Sharing
            </h2>
            <p>
              We do not sell your personal information. Some features may rely
              on service providers for hosting, authentication, storage, AI
              generation, email, analytics, or payment processing. These
              providers only receive information needed to provide their
              services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              8. Data Security
            </h2>
            <p>
              We use reasonable technical and organizational measures to protect
              information. No online system is completely secure, so users
              should avoid uploading sensitive media or private information they
              do not want processed by the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              9. Your Choices
            </h2>
            <p>
              You may choose not to connect Facebook, may review content before
              sharing, and may remove or update content where app features
              allow. You may also contact support for privacy-related requests.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              10. Contact
            </h2>
            <p>
              For privacy questions, contact Bearer of News / XNewsApp support
              through the contact method provided on the website.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              11. Copyright
            </h2>
            <p>© 2024 Bearer of News. All rights reserved.</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
