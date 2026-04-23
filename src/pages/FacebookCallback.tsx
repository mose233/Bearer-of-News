import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FacebookCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleFacebookRedirect = async () => {
      try {
        // 1. Get "code" from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          alert("Facebook login failed (no code)");
          navigate("/login");
          return;
        }

        console.log("Facebook code:", code);

        // 2. (Temporary) Just confirm success
        alert("Facebook connected successfully!");

        // 3. Redirect user to dashboard/home
        navigate("/");

      } catch (err) {
        console.error(err);
        alert("Something went wrong");
        navigate("/login");
      }
    };

    handleFacebookRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Connecting to Facebook...</p>
    </div>
  );
}
