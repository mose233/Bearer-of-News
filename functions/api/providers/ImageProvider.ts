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

export type ImageEditJob = {
  requestId: string;
};

export class ImageProvider {
  /**
   * Existing text-to-image generation.
   *
   * Kept on the current direct fal.ai path. This change does not alter
   * the uploaded-photo editing architecture.
   */
  static async generate(
    request: ImageGenerationRequest
  ): Promise<ImageGenerationResult> {
    try {
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

  /**
   * Start an uploaded-photo edit and return immediately with the fal.ai
   * request ID. IMPORTANT: do not wait for completion inside the Cloudflare
   * request. The browser will poll our lightweight status endpoint instead.
   */
  static async submitEdit(request: ImageEditRequest): Promise<ImageEditJob> {
    if (!request.imageData) {
      throw new Error("An uploaded image is required for image editing.");
    }

    console.log("=================================");
    console.log("FAL.AI IMAGE EDIT SUBMIT");
    console.log("Model: fal-ai/flux-kontext/dev");
    console.log("Tool:", request.tool);
    console.log("Prompt:", request.prompt);
    console.log("Image data received: YES");
    console.log("=================================");

    fal.config({
      credentials: request.falApiKey,
    });

    const submitResult = await fal.queue.submit("fal-ai/flux-kontext/dev", {
      input: {
        prompt: request.prompt,
        image_url: request.imageData,
        resolution_mode: "match_input",
        num_images: 1,
        output_format: "png",
        safety_tolerance: "2",
      },
    });

    const requestId = submitResult.request_id;

    if (!requestId) {
      console.error("fal.ai Kontext submit response:", submitResult);
      throw new Error("fal.ai did not return an image editing request ID.");
    }

    console.log("fal.ai Kontext request submitted:", requestId);

    return { requestId };
  }

  /**
   * Check one edit job. Each call is intentionally short so Cloudflare does
   * not hold one invocation open while fal.ai generates the image.
   */
  static async getEditStatus(
    requestId: string,
    falApiKey: string
  ): Promise<
    | { status: "IN_QUEUE" | "IN_PROGRESS"; queuePosition?: number; logs?: string[] }
    | { status: "COMPLETED"; imageBase64: string; mimeType: string }
    | { status: "FAILED"; error: string }
  > {
    if (!requestId) {
      throw new Error("fal.ai image editing request ID is required.");
    }

    fal.config({
      credentials: falApiKey,
    });

    const status = await fal.queue.status("fal-ai/flux-kontext/dev", {
      requestId,
      logs: true,
    });

    console.log("fal.ai Kontext status:", status.status, requestId);

    if (status.status === "IN_QUEUE") {
      return {
        status: "IN_QUEUE",
        queuePosition: status.queue_position,
      };
    }

    if (status.status === "IN_PROGRESS") {
      return {
        status: "IN_PROGRESS",
        logs: status.logs?.map((log) => log.message) ?? [],
      };
    }

    if (status.status !== "COMPLETED") {
      const failedStatus = status as typeof status & {
        error?: string;
        error_type?: string;
      };

      return {
        status: "FAILED",
        error:
          failedStatus.error ??
          `fal.ai image editing failed with status ${status.status}.`,
      };
    }

    const result = await fal.queue.result("fal-ai/flux-kontext/dev", {
      requestId,
    });

    const imageUrl = result.data?.images?.[0]?.url;

    if (!imageUrl) {
      return {
        status: "FAILED",
        error: "fal.ai completed the image edit but returned no image URL.",
      };
    }

    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      return {
        status: "FAILED",
        error: `Unable to download the edited image from fal.ai (${imageResponse.status}).`,
      };
    }

    const blob = await imageResponse.blob();
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    console.log("FAL.AI IMAGE EDIT COMPLETED:", {
      requestId,
      imageSize: blob.size,
      mimeType: blob.type || "image/png",
    });

    return {
      status: "COMPLETED",
      imageBase64: btoa(binary),
      mimeType: blob.type || "image/png",
    };
  }

  /**
   * Kept for compatibility with any code that may still call ImageProvider.edit.
   * It uses the new submit/status architecture, but the long wait happens only
   * when this compatibility method itself is called. PictureAIService does NOT
   * use this method; it uses submitEdit + getEditStatus through the API.
   */
  static async edit(
    request: ImageEditRequest
  ): Promise<ImageGenerationResult> {
    const { requestId } = await this.submitEdit(request);

    for (let attempt = 0; attempt < 45; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = await this.getEditStatus(requestId, request.falApiKey);

      if (result.status === "COMPLETED") {
        return {
          imageBase64: result.imageBase64,
          mimeType: result.mimeType,
        };
      }

      if (result.status === "FAILED") {
        throw new Error(result.error);
      }
    }

    throw new Error(
      "fal.ai image editing is taking longer than expected. Please try again."
    );
  }
}
