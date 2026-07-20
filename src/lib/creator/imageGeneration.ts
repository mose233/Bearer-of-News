import { FEATURE_FLAGS } from "@/config/featureFlags";
export type GenerateImageSize = "1024x1024" | "1024x1536" | "1536x1024";

export type GeneratedSceneImage = {
  file: File;
  previewUrl: string;
  blob: Blob;
  title: string;
  prompt: string;
};

function getCanvasSize(size: GenerateImageSize) {
  if (size === "1024x1536") {
    return { width: 1024, height: 1536 };
  }

  if (size === "1536x1024") {
    return { width: 1536, height: 1024 };
  }

  return { width: 1024, height: 1024 };
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create mock image."));
        return;
      }

      resolve(blob);
    }, "image/png");
  });
}

const sceneThemes = [
  {
    title: "Opening Scene",
    colors: ["#7C3AED", "#0B1020", "#EC4899"],
    angle: "start",
  },
  {
    title: "Main Moment",
    colors: ["#2563EB", "#0B1020", "#10B981"],
    angle: "main action",
  },
  {
    title: "Detail Scene",
    colors: ["#F59E0B", "#111827", "#7C3AED"],
    angle: "important detail",
  },
  {
    title: "Closing Scene",
    colors: ["#10B981", "#0B1020", "#2563EB"],
    angle: "final message",
  },
];

function buildScenePrompt(basePrompt: string, index: number) {
  const theme = sceneThemes[index % sceneThemes.length];

  return `${theme.title}: ${basePrompt}

Visual direction: ${theme.angle}. Make it suitable for a short social video scene.`;
}

async function drawMockScene({
  prompt,
  title,
  size,
  colors,
  sceneNumber,
}: {
  prompt: string;
  title: string;
  size: GenerateImageSize;
  colors: string[];
  sceneNumber: number;
}): Promise<GeneratedSceneImage> {
  const cleanPrompt = prompt.trim();

  if (!cleanPrompt) {
    throw new Error("Prompt is required.");
  }

  const { width, height } = getCanvasSize(size);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas is not supported in this browser.");
  }

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.5, colors[1]);
  gradient.addColorStop(1, colors[2]);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 40 + Math.random() * 160;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.fillRect(0, 0, width, height);

  const padding = Math.round(width * 0.08);

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.roundRect(
    padding,
    padding,
    width - padding * 2,
    height - padding * 2,
    40
  );
  ctx.fill();

  ctx.fillStyle = "#F8FAFC";
  ctx.font = `800 ${Math.round(width * 0.05)}px "Plus Jakarta Sans", Inter, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillText(`Scene ${sceneNumber}`, padding * 1.35, padding * 1.25);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 ${Math.round(width * 0.055)}px "Plus Jakarta Sans", Inter, sans-serif`;
  ctx.fillText(title, padding * 1.35, padding * 1.85);

  ctx.fillStyle = "#CBD5E1";
  ctx.font = `500 ${Math.round(width * 0.034)}px "Plus Jakarta Sans", Inter, sans-serif`;

  const lines = wrapText(ctx, cleanPrompt, width - padding * 2.7);
  const maxLines = Math.min(lines.length, 8);
  const lineHeight = Math.round(width * 0.05);

  for (let i = 0; i < maxLines; i++) {
    ctx.fillText(
      lines[i],
      padding * 1.35,
      padding * 2.75 + i * lineHeight
    );
  }

  ctx.fillStyle = "#94A3B8";
  ctx.font = `700 ${Math.round(width * 0.023)}px "Plus Jakarta Sans", Inter, sans-serif`;
  ctx.fillText(
    "Free mock scene — replace later with fal.ai / Stability / OpenAI",
    padding * 1.35,
    height - padding * 1.7
  );

  const blob = await canvasToBlob(canvas);
  const previewUrl = URL.createObjectURL(blob);

  const file = new File([blob], `mock-ai-scene-${sceneNumber}-${Date.now()}.png`, {
    type: "image/png",
  });

  return {
    file,
    previewUrl,
    blob,
    title,
    prompt: cleanPrompt,
  };
}

export async function generateSceneImage(
  prompt: string,
  size: GenerateImageSize = "1024x1024"
) {
 
  const theme = sceneThemes[0];

  return drawMockScene({
    prompt,
    title: "Mock AI Scene",
    size,
    colors: theme.colors,
    sceneNumber: 1,
  });
}

export async function generateMultipleSceneImages(
  prompt: string,
  count = 4,
  size: GenerateImageSize = "1024x1024"
) {

  const cleanPrompt = prompt.trim();

  if (!cleanPrompt) {
    throw new Error("Prompt is required.");
  }
  const safeCount = Math.min(Math.max(count, 1), 8);

  const scenes: GeneratedSceneImage[] = [];

  for (let i = 0; i < safeCount; i++) {
    const theme = sceneThemes[i % sceneThemes.length];

    const scene = await drawMockScene({
      prompt: buildScenePrompt(cleanPrompt, i),
      title: theme.title,
      size,
      colors: theme.colors,
      sceneNumber: i + 1,
    });

    scenes.push(scene);
  }

  return scenes;
}
