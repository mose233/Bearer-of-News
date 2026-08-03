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

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 text-white">
      <h2 className="text-2xl font-extrabold">{tool}</h2>

      <p className="mt-2 text-sm text-slate-300">
        Create premium cinematic videos with AI.
      </p>
    </div>
  );
}
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
