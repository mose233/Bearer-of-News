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
  return (
    <div>
      <h2>Cinematic AI</h2>
      <p>{tool}</p>
    </div>
  );
}
