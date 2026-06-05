import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FacebookCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);

        const code = params.get("code");
        const state = params.get("state");
        const savedState = sessionStorage.getItem("facebook_oauth_state");

        if (!code) {
          alert("Facebook login failed: no code returned.");
          navigate("/creator-studio");
          return;
        }

        if (!state || state !== savedState) {
          alert("Facebook login failed: invalid state.");
          navigate("/creator-studio");
          return;
        }

        const response = await fetch("/api/facebook/exchange-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(data);

          alert(
            data?.error ||
              "Facebook connection failed while exchanging token."
          );

          navigate("/creator-studio");
          return;
        }

        localStorage.setItem(
          "facebook_user_access_token",
          data.userAccessToken || ""
        );

        localStorage.setItem(
          "facebook_pages",
          JSON.stringify(data.pages || [])
        );

        sessionStorage.removeItem("facebook_oauth_state");

        alert(
          `Facebook connected successfully.\n\nPages found: ${
            data.pages?.length || 0
          }`
        );

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
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          Connecting to Facebook...
        </h2>

        <p className="text-gray-500">
          Please wait while we complete Facebook authentication.
        </p>
      </div>
    </div>
  );
}
