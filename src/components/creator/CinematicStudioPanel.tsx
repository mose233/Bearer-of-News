import { useState } from "react";

type CinematicStudioPanelProps = {
  tool: string;
  requestGeneration?: (
    amount: string,
    generate: () => void
  ) => void;
};

export default function CinematicStudioPanel({
  tool,
  requestGeneration,
}: CinematicStudioPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("10 Seconds");
  const [status, setStatus] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert("Please describe the cinematic video you want to create.");
      return;
    }

    setStatus(
      `${tool} (${duration}) prepared successfully. Mock cinematic generation completed.`
    );
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 text-white">
      <h2 className="text-2xl font-extrabold">{tool}</h2>

      <p className="mt-2 text-sm text-slate-300">
        Create premium cinematic videos with AI.
      </p>

      {/* Duration */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-extrabold">
          Video Duration
        </label>

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-slate-900 p-3 text-white"
        >
          <option>10 Seconds</option>
          <option>20 Seconds</option>
          <option>30 Seconds</option>
          <option>40 Seconds</option>
          <option>50 Seconds</option>
          <option>60 Seconds</option>
        </select>
      </div>

      {/* Prompt */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-extrabold">
          Describe what you want AI to create
        </label>

        <textarea
          rows={6}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Example: ${
            tool === "Talking Avatar"
              ? "Create a talking business presenter introducing our company."
              : tool === "Photo to Video"
              ? "Animate this photo into a smooth cinematic video."
              : tool === "Image to Video"
              ? "Turn this image into a dramatic cinematic scene."
              : tool === "Text to Video"
              ? "Create a cinematic sunset scene over Mount Kilimanjaro."
              : tool === "Movie Scene Generator"
              ? "Generate an action movie scene inside a futuristic city."
              : tool === "Trailer Generator"
              ? "Create a dramatic trailer for an African adventure movie."
              : "Describe the cinematic video you want AI to create."
          }`}
          className="w-full rounded-2xl border border-white/10 bg-slate-900 p-4 text-white outline-none"
        />
      </div>

      {/* Generate */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            if (requestGeneration) {
              requestGeneration("$0.72", handleGenerate);
            } else {
              handleGenerate();
            }
          }}
          className="h-12 rounded-2xl bg-amber-600 px-6 font-extrabold text-white transition hover:bg-amber-500"
        >
          Generate Cinematic Video
        </button>
      </div>

      {/* Status */}
      {status && (
        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-100">
          {status}
        </div>
      )}
    </div>
  );
}
