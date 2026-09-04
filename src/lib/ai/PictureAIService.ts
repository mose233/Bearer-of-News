import { PictureTool } from "./models";

export interface PictureAIRequest {
  prompt: string;
  tool: PictureTool;
  style?: string;
  aspectRatio?: string;
  image?: File;
}

export interface PictureAIResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

interface GenerateImageResponse {
  ok: boolean;
  stage?: string;
  error?: string;
  imageBase64?: string;
  mimeType?: string;
}

export class PictureAIService {
  static async generate(
    request: PictureAIRequest
  ): Promise<PictureAIResult> {
    try {
      const prompt = request.prompt?.trim();

      if (!prompt) {
        return {
          success: false,
          error: "Image prompt is required.",
        };
      }

      console.log("=================================");
      console.log("REAL FAL.AI PICTURE GENERATION");
      console.log("Tool:", request.tool);
      console.log("Prompt:", prompt);
      console.log("Aspect Ratio:", request.aspectRatio);
      console.log("Has uploaded image:", !!request.image);
      console.log("Sending request to /api/generate-image");
      console.log("=================================");

      /*
       * Convert the application's aspect ratio into one of the
       * sizes supported by the existing text-to-image endpoint.
       *
       * This is retained for the existing Text to Image flow.
       */
      let size: "1024x1024" | "1024x1536" | "1536x1024" =
        "1024x1024";

      if (
        request.aspectRatio === "9:16" ||
        request.aspectRatio === "portrait"
      ) {
        size = "1024x1536";
      } else if (
        request.aspectRatio === "16:9" ||
        request.aspectRatio === "landscape"
      ) {
        size = "1536x1024";
      }

      /*
       * Uploaded-photo Picture AI tools use image-to-image editing.
       *
       * Convert the browser File into a data URI so the image can be
       * securely sent to Cloudflare without exposing the FAL API key.
       *
       * Cloudflare will pass this image to fal.ai FLUX Kontext.
       */
      let imageData: string | undefined;

      if (request.image) {
        imageData = await this.fileToDataUrl(request.image);

        console.log(
          "Uploaded image converted to data URI.",
          "Bytes:",
          imageData.length
        );
      }

      /*
       * Send the request to Cloudflare.
       *
       * IMPORTANT:
       * The FAL_API_KEY is NOT sent from the browser.
       *
       * Cloudflare reads:
       *
       * context.env.FAL_API_KEY
       *
       * inside /functions/api/generate-image.ts
       *
       * Existing text-to-image requests continue to use:
       *
       * {
       *   prompt,
       *   size
       * }
       *
       * Uploaded-photo requests additionally send:
       *
       * {
       *   imageData
       * }
       */
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          size,
          imageData,
        }),
      });

      console.log(
        "Cloudflare generate-image response:",
        response.status,
        response.statusText
      );

      let data: GenerateImageResponse;

      try {
        data = (await response.json()) as GenerateImageResponse;
      } catch {
        throw new Error(
          `Picture AI server returned an invalid response (${response.status}).`
        );
      }

      console.log("Picture AI server result:", data);

      /*
       * Cloudflare /api/generate-image uses:
       *
       * {
       *   ok: true,
       *   imageBase64: "...",
       *   mimeType: "image/png"
       * }
       */
      if (!response.ok || !data.ok) {
        return {
          success: false,
          error:
            data.error ||
            `Picture AI generation failed at stage: ${
              data.stage || "unknown"
            }.`,
        };
      }

      if (!data.imageBase64) {
        return {
          success: false,
          error:
            "fal.ai generated successfully but no image was returned.",
        };
      }

      /*
       * Convert the base64 image returned by Cloudflare into
       * a browser Blob URL.
       *
       * This keeps the existing Creator Studio workflow working:
       *
       * PictureAIService
       *       ↓
       * imageUrl
       *       ↓
       * picturePreview / generatedImagePreview
       *       ↓
       * File
       *       ↓
       * Timeline / Export
       */
      const mimeType = data.mimeType || "image/png";

      const binaryString = atob(data.imageBase64);
      const length = binaryString.length;
      const bytes = new Uint8Array(length);

      for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], {
        type: mimeType,
      });

      const imageUrl = URL.createObjectURL(blob);

      console.log("=================================");
      console.log("FAL.AI IMAGE RECEIVED SUCCESSFULLY");
      console.log("Mime type:", mimeType);
      console.log("Blob size:", blob.size);
      console.log("Image URL created:", imageUrl);
      console.log("=================================");

      return {
        success: true,
        imageUrl,
      };
    } catch (err) {
      console.error("=================================");
      console.error("FAL.AI PICTURE GENERATION ERROR");
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

  /**
   * Convert a browser File into a data URI.
   *
   * The data URI is sent to our Cloudflare API.
   * The FAL API key never leaves the server.
   */
  private static fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(
            new Error("Unable to convert uploaded image.")
          );
          return;
        }

        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(
          new Error("Unable to read uploaded image.")
        );
      };

      reader.readAsDataURL(file);
    });
  }
}
