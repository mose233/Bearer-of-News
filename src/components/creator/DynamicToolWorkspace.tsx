import React from "react";

type Props = {
  selectedTool: { category: string; tool: string } | null;
};

function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 text-white">
      <h3 className="text-xl font-extrabold">{title}</h3>
      <p className="mt-2 text-slate-300">{description}</p>
    </div>
  );
}

export default function DynamicToolWorkspace({ selectedTool }: Props) {
  if (!selectedTool) return null;
  const tool = selectedTool.tool;

  if (selectedTool.category === "Video AI") {
    switch (tool) {
      case "Text to Video Studio":
        return <Placeholder title="Text to Video Studio" description="Choose video type, write prompt, generate scenes, upload media, preview, and publish." />;
      case "Photo to Video":
        return <Placeholder title="Photo to Video" description="Upload photos, choose transitions, music, duration, and generate animated videos." />;
      case "Photo Music Video":
        return <Placeholder title="Photo Music Video" description="Create slideshow-style music videos from your photos." />;
      case "Talking Avatars":
        return <Placeholder title="Talking Avatars" description="Upload a photo, add script, choose voice and language, then generate a talking avatar." />;
      case "AI News Presenter":
        return <Placeholder title="AI News Presenter" description="Create AI presenter news videos from your scripts." />;
      case "Product Ad Generator":
        return <Placeholder title="Product Ad Generator" description="Upload product images, add product details, and generate ad videos." />;
      case "Dance Animation":
        return <Placeholder title="Dance Animation" description="Animate photos into dance videos." />;
      case "AI Music Video Studio":
        return <Placeholder title="AI Music Video Studio" description="Use AI Song Studio songs or upload MP3/WAV to create music videos." />;
      case "Story Generator":
        return <Placeholder title="Story Generator" description="Turn story ideas into short narrative videos." />;
      case "Birthday Video":
        return <Placeholder title="Birthday Video" description="Create birthday celebration videos with photos, messages, and music." />;
    }
  }
  return <Placeholder title={tool} description="Workspace ready." />;
}

