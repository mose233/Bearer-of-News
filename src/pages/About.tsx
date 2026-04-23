import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Index() {
  const navigate = useNavigate();

  // =========================
  // FACEBOOK CONNECT (REAL)
  // =========================
  const connectFacebook = () => {
    const appId = "3796273373998643"; // your Facebook App ID
    const redirectUri = "https://xnewsapp.com/facebook/callback";

    const fbUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=email,public_profile&response_type=code`;

    window.location.href = fbUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* HERO SECTION */}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h1 className="text-5xl font-bold mb-6">
          Bearer of News
        </h1>

        <p className="text-xl max-w-2xl mx-auto mb-8">
          Collaborate. Approve. Publish.
          <br />
          A secure platform for managing Facebook content with full team control.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">

          <Button onClick={() => navigate('/signup')}>
            Start Free Trial
          </Button>

          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>

          <Button
            onClick={connectFacebook}
            className="bg-blue-800 hover:bg-blue-900"
          >
            Connect Facebook
          </Button>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="p-6 border rounded-xl text-center">
            <h3 className="text-xl font-bold mb-2">Collaborate</h3>
            <p className="text-gray-600">
              Teams create and manage drafts together in one place.
            </p>
          </div>

          <div className="p-6 border rounded-xl text-center">
            <h3 className="text-xl font-bold mb-2">Review</h3>
            <p className="text-gray-600">
              Admins approve content before publishing.
            </p>
          </div>

          <div className="p-6 border rounded-xl text-center">
            <h3 className="text-xl font-bold mb-2">Publish</h3>
            <p className="text-gray-600">
              Final posts are manually published on Facebook.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gray-100">
        <h2 className="text-3xl font-bold mb-4">
          Ready to get started?
        </h2>

        <p className="mb-6 text-gray-600">
          Join teams using Bearer of News today.
        </p>

        <Button size="lg" onClick={() => navigate('/signup')}>
          Create Account
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Bearer of News. All rights reserved.
      </footer>

    </div>
  );
}
