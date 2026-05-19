export type GenerateImageSize = "1024x1024" | "1024x1536" | "1536x1024";

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

export async function generateSceneImage(
  prompt: string,
  size: GenerateImageSize = "1024x1024"
) {
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
  gradient.addColorStop(0, "#7C3AED");
  gradient.addColorStop(0.45, "#0B1020");
  gradient.addColorStop(1, "#EC4899");

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

  ctx.fillStyle = "rgba(0,0,0,0.35)";
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
  ctx.font = `700 ${Math.round(width * 0.055)}px "Plus Jakarta Sans", Inter, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const title = "Mock AI Scene";
  ctx.fillText(title, padding * 1.35, padding * 1.35);

  ctx.fillStyle = "#CBD5E1";
  ctx.font = `500 ${Math.round(width * 0.036)}px "Plus Jakarta Sans", Inter, sans-serif`;

  const lines = wrapText(ctx, cleanPrompt, width - padding * 2.7);
  const maxLines = Math.min(lines.length, 8);
  const lineHeight = Math.round(width * 0.052);

  for (let i = 0; i < maxLines; i++) {
    ctx.fillText(
      lines[i],
      padding * 1.35,
      padding * 2.35 + i * lineHeight
    );
  }

  ctx.fillStyle = "#94A3B8";
  ctx.font = `600 ${Math.round(width * 0.024)}px "Plus Jakarta Sans", Inter, sans-serif`;
  ctx.fillText(
    "Free development placeholder — replace later with fal.ai / Stability / OpenAI",
    padding * 1.35,
    height - padding * 1.75
  );

  const blob = await canvasToBlob(canvas);
  const previewUrl = URL.createObjectURL(blob);

  const file = new File([blob], `mock-ai-scene-${Date.now()}.png`, {
    type: "image/png",
  });

  return {
    file,
    previewUrl,
    blob,
  };
}
