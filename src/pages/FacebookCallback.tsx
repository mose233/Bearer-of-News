import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FacebookCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          alert("Facebook login failed: no code returned.");
          navigate("/creator-studio");
          return;
        }

        const response = await fetch("/api/facebook/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data?.error || "Facebook connection failed.");
          navigate("/creator-studio");
          return;
        }

        localStorage.setItem("facebook_pages", JSON.stringify(data.pages || []));

        alert(`Facebook connected. Pages found: ${data.pages?.length || 0}`);
        navigate("/creator-studio");
      } catch (error) {
        console.error(error);
        alert("Facebook callback failed.");
        navigate("/creator-studio");
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">Connecting to Facebook...</p>
    </div>
  );
}
