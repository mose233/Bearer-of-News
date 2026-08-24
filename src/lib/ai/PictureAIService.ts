export interface PictureAIRequest {
  prompt: string;
  tool: string;
  style?: string;
  aspectRatio?: string;
  image?: File;
}

export interface PictureAIResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export class PictureAIService {
  static async generate(
    request: PictureAIRequest
  ): Promise<PictureAIResult> {
    try {
      console.log("=================================");
      console.log("REAL FAL.AI PICTURE AI GENERATION");
      console.log("Tool:", request.tool);
      console.log("Prompt:", request.prompt);
      console.log("Aspect Ratio:", request.aspectRatio);
      console.log("Calling /api/generate-image...");
      console.log("=================================");

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: request.prompt,
          size: "1024x1024",
        }),
      });

      console.log(
        "Picture AI backend response status:",
        response.status
      );

      const data = await response.json();

      console.log("Picture AI backend response:", data);

      if (!response.ok || !data.ok) {
        return {
          success: false,
          error:
            data?.error ||
            `Picture AI generation failed (${response.status}).`,
        };
      }

      if (!data.imageBase64) {
        return {
          success: false,
          error: "Picture AI server returned no image.",
        };
      }

      const mimeType = data.mimeType || "image/png";

      // Convert the server-returned Base64 image into a
      // browser object URL so the existing preview workflow
      // can continue using result.imageUrl.
      const binaryString = atob(data.imageBase64);

      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], {
        type: mimeType,
      });

      const imageUrl = URL.createObjectURL(blob);

      console.log("REAL FAL.AI IMAGE URL CREATED:", imageUrl);

      return {
        success: true,
        imageUrl,
      };
    } catch (err) {
      console.error("=================================");
      console.error("FAL PICTURE AI GENERATION ERROR");
      console.error(err);
      console.error("=================================");

      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : String(err),
      };
    }
  }
}
