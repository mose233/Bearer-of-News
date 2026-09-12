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

    // Step 1: Submit generation request
    const queueResponse = await fetch(
      "https://queue.fal.run/fal-ai/flux/dev",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${request.falApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: request.prompt,
        }),
      }
    );

    if (!queueResponse.ok) {
      const error = await queueResponse.text();
      throw new Error(`fal.ai request failed: ${error}`);
    }

    const queueResult = await queueResponse.json();

    const requestId = queueResult.request_id;

    if (!requestId) {
      throw new Error("fal.ai did not return a request ID.");
    }

    // Step 2: Poll until finished
    let imageUrl: string | undefined;

    while (!imageUrl) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const statusResponse = await fetch(
        `https://queue.fal.run/fal-ai/flux/dev/requests/${requestId}`,
        {
          headers: {
            Authorization: `Key ${request.falApiKey}`,
          },
        }
      );

      if (!statusResponse.ok) {
        const error = await statusResponse.text();
        throw new Error(error);
      }

      const status = await statusResponse.json();

      if (status.status === "COMPLETED") {
        imageUrl = status.response?.images?.[0]?.url;
      }

      if (status.status === "FAILED") {
        throw new Error(
          status.error ?? "fal.ai generation failed."
        );
      }
    }

    // Step 3: Download generated image
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error("Unable to download generated image.");
    }

    const blob = await imageResponse.blob();

    const buffer = await blob.arrayBuffer();

    const bytes = new Uint8Array(buffer);

    let binary = "";

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    const imageBase64 = btoa(binary);

    return {
      imageBase64,
      mimeType: blob.type || "image/png",
    };
  }

  /**
   * Uploaded-photo image editing.
   *
   * Uses the official fal.ai JavaScript client for:
   *
   * submit -> status -> result
   *
   * Model:
   * fal-ai/flux-kontext/dev
   *
   * The uploaded image arrives as a data URI:
   *
   * data:image/jpeg;base64,...
   *
   * This is passed directly to fal.ai as image_url.
   */
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
      /*
       * Configure the server-side fal.ai client with the API key.
       *
       * The key never reaches the browser. This code runs inside
       * the Cloudflare server function.
       */
      fal.config({
        credentials: request.falApiKey,
      });

      // Step 1: Submit editing request
      const submitResult = await fal.queue.submit(
        "fal-ai/flux-kontext/dev",
        {
          input: {
            prompt: request.prompt,
            image_url: request.imageData,
            resolution_mode: "match_input",
            num_images: 1,
            output_format: "png",
            safety_tolerance: "2",
          },
        }
      );

      const requestId = submitResult.request_id;

      if (!requestId) {
        console.error(
          "fal.ai Kontext submit response did not contain request_id:",
          submitResult
        );

        throw new Error(
          "fal.ai did not return an image editing request ID."
        );
      }

      console.log(
        "fal.ai Kontext request submitted:",
        requestId
      );

      /*
       * Step 2: Poll using the official fal.ai SDK.
       *
       * IMPORTANT:
       * Do not construct the REST /status URL ourselves.
       * The SDK handles the current queue API correctly.
       */
      let status: Awaited<
        ReturnType<typeof fal.queue.status>
      >;

      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        status = await fal.queue.status(
          "fal-ai/flux-kontext/dev",
          {
            requestId,
            logs: true,
          }
        );

        console.log(
          "fal.ai Kontext status:",
          status.status
        );

        if (status.status === "IN_QUEUE") {
          console.log(
            "fal.ai Kontext queue position:",
            status.queue_position
          );
          continue;
        }

        if (status.status === "IN_PROGRESS") {
          status.logs?.forEach((log) => {
            console.log(
              "fal.ai Kontext:",
              log.message
            );
          });
          continue;
        }

        if (status.status === "COMPLETED") {
          break;
        }

        /*
         * The queue API can report an error on a completed request.
         * Surface the actual fal.ai error instead of returning an
         * empty generic message.
         */
        const failedStatus = status as typeof status & {
          error?: string;
          error_type?: string;
        };

        throw new Error(
          failedStatus.error ??
            `fal.ai image editing failed with status ${status.status}.`
        );
      }

      // Step 3: Retrieve the completed result using the official SDK
      const result = await fal.queue.result(
        "fal-ai/flux-kontext/dev",
        {
          requestId,
        }
      );

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

      console.log(
        "fal.ai Kontext result received:",
        {
          imageUrlPresent: true,
          imageCount: result.data?.images?.length ?? 0,
        }
      );

      // Step 4: Download generated image
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
      console.error(
        "FAL.AI IMAGE EDIT ERROR:",
        error
      );

      if (error instanceof Error) {
        throw new Error(
          `fal.ai image editing failed: ${error.message}`
        );
      }

      throw new Error(
        `fal.ai image editing failed: ${String(error)}`
      );
    }
  }
}
