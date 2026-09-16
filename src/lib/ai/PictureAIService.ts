export type PictureAIRequest = {
  prompt: string;
  tool: string;
  style?: string;
  aspectRatio?: "1:1" | "4:5" | "16:9" | "9:16";
  image?: File | null;
};

type PictureAIResponse = {
  ok?: boolean;
  pending?: boolean;
  requestId?: string;
  status?: string;
  queuePosition?: number | null;
  logs?: string[];
  imageBase64?: string;
  mimeType?: string;
  stage?: string;
  error?: string;
};

function aspectRatioToSize(
  aspectRatio: PictureAIRequest["aspectRatio"]
): "1024x1024" | "1024x1536" | "1536x1024" {
  switch (aspectRatio) {
    case "9:16":
    case "4:5":
      return "1024x1536";
    case "16:9":
      return "1536x1024";
    default:
      return "1024x1024";
  }
}

async function fileToDataUri(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let binary = "";
  const chunkSize = 0x8000;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const chunk = bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length));
    binary += String.fromCharCode(...chunk);
  }

  const base64 = btoa(binary);
  return `data:${file.type || "image/jpeg"};base64,${base64}`;
}

function responseToImageUrl(data: PictureAIResponse): string {
  if (!data.imageBase64) {
    throw new Error("fal.ai generated successfully but no image was returned.");
  }

  const mimeType = data.mimeType || "image/png";
  const binary = atob(data.imageBase64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

export class PictureAIService {
  static async generate(request: PictureAIRequest) {
    try {
      const prompt = request.prompt?.trim();

      if (!prompt) {
        return {
          success: false,
          error: "Picture AI prompt is required.",
        };
      }

      console.log("=================================");
      console.log("REAL FAL.AI PICTURE GENERATION");
      console.log("Tool:", request.tool);
      console.log("Prompt:", prompt);
      console.log("Aspect ratio:", request.aspectRatio || "1:1");
      console.log("Uploaded image:", Boolean(request.image));
      console.log("=================================");

      const imageData = request.image
        ? await fileToDataUri(request.image)
        : undefined;

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          size: aspectRatioToSize(request.aspectRatio),
          imageData,
          tool: request.tool,
          style: request.style,
        }),
      });

      let data: PictureAIResponse;

      try {
        data = (await response.json()) as PictureAIResponse;
      } catch {
        throw new Error(
          `Picture AI server returned an invalid response (${response.status}).`
        );
      }

      console.log("Cloudflare generate-image response:", response.status, data);

      if (!response.ok || !data.ok) {
        return {
          success: false,
          error:
            data.error ||
            `Picture AI generation failed at stage: ${data.stage || "unknown"}.`,
        };
      }

      // Uploaded-photo editing is asynchronous. Poll our own short-lived
      // Cloudflare status endpoint rather than keeping one Worker invocation
      // open while fal.ai works.
      if (data.pending && data.requestId) {
        const requestId = data.requestId;
        const maxAttempts = 100;
        const delayMs = 3000;

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));

          const statusResponse = await fetch(
            `/api/generate-image-status?requestId=${encodeURIComponent(requestId)}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

          let statusData: PictureAIResponse;

          try {
            statusData = (await statusResponse.json()) as PictureAIResponse;
          } catch {
            throw new Error(
              `Picture AI status server returned an invalid response (${statusResponse.status}).`
            );
          }

          console.log("Picture AI status:", {
            attempt,
            status: statusResponse.status,
            falStatus: statusData.status,
          });

          if (!statusResponse.ok || !statusData.ok) {
            throw new Error(
              statusData.error ||
                `Picture AI status check failed (${statusResponse.status}).`
            );
          }

          if (statusData.pending) {
            continue;
          }

          if (statusData.status === "COMPLETED" && statusData.imageBase64) {
            const imageUrl = responseToImageUrl(statusData);

            console.log("=================================");
            console.log("FAL.AI IMAGE RECEIVED SUCCESSFULLY");
            console.log("Image URL created:", imageUrl);
            console.log("=================================");

            return {
              success: true,
              imageUrl,
            };
          }

          throw new Error(
            statusData.error ||
              "fal.ai image editing finished without a usable image."
          );
        }

        throw new Error(
          "Picture AI is taking longer than expected. Please try again."
        );
      }

      if (!data.imageBase64) {
        return {
          success: false,
          error: "fal.ai generated successfully but no image was returned.",
        };
      }

      const imageUrl = responseToImageUrl(data);

      console.log("=================================");
      console.log("FAL.AI IMAGE RECEIVED SUCCESSFULLY");
      console.log("Image URL created:", imageUrl);
      console.log("=================================");

      return {
        success: true,
        imageUrl,
      };
    } catch (error) {
      console.error("=================================");
      console.error("FAL.AI PICTURE GENERATION ERROR");
      console.error(error);
      console.error("=================================");

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

export default PictureAIService;
