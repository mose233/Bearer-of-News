<footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-10">
  <div className="mx-auto grid max-w-7xl gap-8 text-sm text-slate-400 md:grid-cols-3">
    <div>
      <h3 className="text-base font-extrabold text-white">
        Bearer of News
      </h3>

      <p className="mt-3 leading-7">
        AI Creator Studio for Facebook-ready videos, posts, campaigns,
        approvals, and publishing workflows.
      </p>
    </div>

    <div>
      <h4 className="text-sm font-extrabold text-white">
        Legal
      </h4>

      <div className="mt-3 flex flex-col gap-3">
        <Link to="/privacy" className="hover:text-white transition">
          Privacy Policy
        </Link>

        <Link to="/terms" className="hover:text-white transition">
          Terms of Service
        </Link>

        <Link to="/about" className="hover:text-white transition">
          About
        </Link>
      </div>
    </div>

    <div>
      <h4 className="text-sm font-extrabold text-white">
        Connect
      </h4>

      <div className="mt-3 flex flex-col gap-3">
        <a
          href="mailto:support@xnewsapp.com"
          className="hover:text-white transition"
        >
          support@xnewsapp.com
        </a>

        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white transition"
        >
          Facebook
        </a>

        <a
          href="https://x.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white transition"
        >
          X / Twitter
        </a>

        <a
          href="https://wa.me/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-white transition"
        >
          WhatsApp
        </a>
      </div>
    </div>
  </div>

  <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-slate-500">
    © 2024 Bearer of News. All rights reserved.
  </div>
</footer>
        <DevTools />
      </main>
    </AppProvider>
  );
};

export default Index;
