import { fal } from "@fal-ai/client";

export type ImageGenerationRequest = {
  tool: string;
  prompt: string;
  size: "1024x1024" | "1024x1536" | "1536x1024";
  falApiKey: string;
};

export type ImageEditRequest = {
  tool: string;
  prompt: string;
  imageData: string;
  falApiKey: string;
};

export type ImageGenerationResult = {
  imageBase64: string;
  mimeType: string;
};

export class ImageProvider {
  /**
   * Existing text-to-image generation.
   *
   * This remains unchanged and continues using:
   * fal-ai/flux/dev
   */
  static async generate(
    request: ImageGenerationRequest
  ): Promise<ImageGenerationResult> {
    try {
      // Use fal.ai direct synchronous inference instead of queue polling.
      // This keeps the Cloudflare Worker invocation to a small number of
      // subrequests and avoids the Workers subrequest limit.
      fal.config({
        credentials: request.falApiKey,
      });

      const result = await fal.run("fal-ai/flux/dev", {
        input: {
          prompt: request.prompt,
        },
      });

      const imageUrl = result.data?.images?.[0]?.url;

      if (!imageUrl) {
        throw new Error("fal.ai completed but returned no image URL.");
      }

      const imageResponse = await fetch(imageUrl);

      if (!imageResponse.ok) {
        throw new Error(
          `Unable to download the generated image from fal.ai (${imageResponse.status}).`
        );
      }

      const blob = await imageResponse.blob();
      const buffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      let binary = "";
      for (const byte of bytes) {
        binary += String.fromCharCode(byte);
      }

      return {
        imageBase64: btoa(binary),
        mimeType: blob.type || "image/png",
      };
    } catch (error) {
      console.error("FAL.AI IMAGE GENERATION ERROR:", error);

      if (error instanceof Error) {
        throw new Error(`fal.ai image generation failed: ${error.message}`);
      }

      throw new Error(`fal.ai image generation failed: ${String(error)}`);
    }
  }

  static async edit(
    request: ImageEditRequest
  ): Promise<ImageGenerationResult> {
    if (!request.imageData) {
      throw new Error("An uploaded image is required for image editing.");
    }

    console.log("=================================");
    console.log("FAL.AI IMAGE EDIT");
    console.log("Model: fal-ai/flux-kontext/dev");
    console.log("Tool:", request.tool);
    console.log("Prompt:", request.prompt);
    console.log("Image data received: YES");
    console.log("=================================");

    try {
      // IMPORTANT: use direct fal.ai inference here.
      // The previous implementation submitted a queue job and then polled
      // it from the same Cloudflare Worker invocation. A long generation
      // could therefore exceed Cloudflare's 50-subrequest limit.
      fal.config({
        credentials: request.falApiKey,
      });

      const result = await fal.run("fal-ai/flux-kontext/dev", {
        input: {
          prompt: request.prompt,
          image_url: request.imageData,
          resolution_mode: "match_input",
          num_images: 1,
          output_format: "png",
          safety_tolerance: "2",
        },
      });

      const imageUrl = result.data?.images?.[0]?.url;

      if (!imageUrl) {
        console.error(
          "fal.ai Kontext completed but returned no image URL:",
          result.data
        );
        throw new Error(
          "fal.ai completed the image edit but returned no image URL."
        );
      }

      console.log("fal.ai Kontext result received:", {
        imageUrlPresent: true,
        imageCount: result.data?.images?.length ?? 0,
      });

      const imageResponse = await fetch(imageUrl);

      if (!imageResponse.ok) {
        throw new Error(
          `Unable to download the edited image from fal.ai (${imageResponse.status}).`
        );
      }

      const blob = await imageResponse.blob();
      const buffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      let binary = "";
      for (const byte of bytes) {
        binary += String.fromCharCode(byte);
      }

      const imageBase64 = btoa(binary);

      console.log("=================================");
      console.log("FAL.AI IMAGE EDIT COMPLETED");
      console.log("Mime type:", blob.type || "image/png");
      console.log("Image size:", blob.size);
      console.log("=================================");

      return {
        imageBase64,
        mimeType: blob.type || "image/png",
      };
    } catch (error) {
      console.error("FAL.AI IMAGE EDIT ERROR:", error);

      if (error instanceof Error) {
        throw new Error(`fal.ai image editing failed: ${error.message}`);
      }

      throw new Error(`fal.ai image editing failed: ${String(error)}`);
    }
  }

}
