import React, { useEffect, useState } from "react";

const Download = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      alert("Installation is not available on this device yet.");
      return;
    }

    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-10 text-center shadow-2xl">
        <img
          src="/favicon.png"
          alt="xnewsapp.com"
          className="mx-auto mb-6 h-24 w-24 rounded-full"
        />

        <h1 className="mb-4 text-4xl font-extrabold">
          Install xnewsapp.com
        </h1>

        <p className="mb-8 leading-7 text-slate-300">
          Download xnewsapp.com to your device and use the AI Creator Studio like a real app.
        </p>

        <button
          onClick={handleInstall}
          className="rounded-2xl bg-violet-600 px-8 py-4 text-lg font-bold transition hover:bg-violet-500"
        >
          Download / Install App
        </button>
      </div>
    </div>
  );
};

export default Download;
