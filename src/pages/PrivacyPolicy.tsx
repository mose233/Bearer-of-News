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
            xnewsapp.com Privacy Policy
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
              xnewsapp.com is an AI Creator Studio that helps users create,
              edit, export, download, and share AI-generated videos, images,
              voiceovers, music, captions, and digital content. This Privacy
              Policy explains how we collect, use, protect, and manage your
              information when you use our website and Creator Studio.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              2. Information We May Collect
            </h2>
            <p>
              We may collect account information such as your name, email
              address, login details, uploaded media, generated content,
              captions, prompts, drafts, projects, exported media, and
              technical information needed to provide and maintain the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              3. Connected Accounts &amp; Social Media
            </h2>
            <p>
              You may choose to connect supported social media platforms to
              publish or share your content. These connections are optional,
              and we only request the permissions necessary for the features
              you choose to use.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              4. User Uploads and AI Content
            </h2>
            <p>
              You may upload images, videos, audio, captions, and prompts to
              create content. You are responsible for ensuring that you own, or
              have permission to use, any content you upload. We recommend
              reviewing AI-generated content before downloading or sharing it.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              5. How We Use Information
            </h2>
            <p>
              We use information to provide the app, generate and preview AI
              content, manage your projects, support exports and downloads,
              improve Creator Studio features, process secure payments where
              applicable, maintain security, and prevent misuse.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              6. Export, Download &amp; Sharing
            </h2>
            <p>
              xnewsapp.com gives users control over their content. Projects are
              exported, downloaded, or shared only after the user's own action.
              We do not automatically publish content on your behalf. Users
              should review their content before downloading, sharing, or
              publishing it to any platform.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              7. Data Sharing
            </h2>
            <p>
              We do not sell your personal information. Some features may rely
              on trusted service providers for hosting, authentication,
              storage, AI generation, email, analytics, or payment processing.
              These providers receive only the information needed to provide
              their services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              8. Data Security
            </h2>
            <p>
              We use reasonable technical and organizational measures to
              protect your information. However, no online system can guarantee
              absolute security. Users should avoid uploading sensitive media
              or private information they do not want processed by the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              9. Your Rights &amp; Choices
            </h2>
            <p>
              You may choose whether to connect supported social media
              accounts, review your content before sharing, and remove or
              update content where app features allow. You may also contact us
              with privacy or data-related requests.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              10. Contact
            </h2>
            <p>
              For privacy questions or data-related requests, contact us at:
              support@xnewsapp.com
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-extrabold text-white">
              11. Copyright
            </h2>
            <p>© 2026 xnewsapp.com. All rights reserved.</p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
