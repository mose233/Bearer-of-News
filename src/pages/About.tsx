import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Index() {
  const navigate = useNavigate();

  // =========================
  // FACEBOOK CONNECT
  // =========================
  const handleFacebookLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.error(error);
      alert('Facebook login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* HERO */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h1 className="text-5xl font-bold mb-6">Bearer of News</h1>

        <p className="text-xl max-w-2xl mx-auto mb-8">
          Collaborate. Approve. Publish.
          <br />
          A secure platform for managing Facebook content with full team control.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Button onClick={() => navigate('/signup')}>
            Get Started
          </Button>

          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>

          <Button
            className="bg-blue-800 hover:bg-blue-900"
            onClick={handleFacebookLogin}
          >
            Connect Facebook
          </Button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <Card className="p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Collaborate</h3>
            <p className="text-gray-600">
              Teams create and manage content drafts in one secure place.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Review</h3>
            <p className="text-gray-600">
              Admins review and approve content before publishing.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Publish</h3>
            <p className="text-gray-600">
              Final posts are manually published on Facebook for full compliance.
            </p>
          </Card>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gray-100">
        <h2 className="text-3xl font-bold mb-4">
          Ready to streamline your workflow?
        </h2>

        <p className="mb-6 text-gray-600">
          Join teams using Bearer of News to manage content smarter.
        </p>

        <Button size="lg" onClick={() => navigate('/signup')}>
          Start Free
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Bearer of News. All rights reserved.
      </footer>

    </div>
  );
}
