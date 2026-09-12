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
   * Uses fal.ai FLUX Kontext [dev].
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

    // Step 1: Submit editing request
    const queueResponse = await fetch(
      "https://queue.fal.run/fal-ai/flux-kontext/dev",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${request.falApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: request.prompt,
          image_url: request.imageData,
          resolution_mode: "match_input",
          num_images: 1,
          output_format: "png",
          safety_tolerance: "2",
        }),
      }
    );

    if (!queueResponse.ok) {
      const error = await queueResponse.text();

      console.error(
        "fal.ai Kontext request failed:",
        queueResponse.status,
        error
      );

      throw new Error(
        `fal.ai image editing request failed (${queueResponse.status}): ${
          error || "No error details returned."
        }`
      );
    }

    const queueResult = await queueResponse.json();
    const requestId = queueResult.request_id;

    if (!requestId) {
      console.error(
        "fal.ai Kontext response did not contain request_id:",
        queueResult
      );

      throw new Error(
        "fal.ai did not return an image editing request ID."
      );
    }

    console.log(
      "fal.ai Kontext request submitted:",
      requestId
    );

    // Step 2: Poll request status
    let completed = false;

    while (!completed) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const statusResponse = await fetch(
        `https://queue.fal.run/fal-ai/flux-kontext/dev/requests/${requestId}/status`,
        {
          headers: {
            Authorization: `Key ${request.falApiKey}`,
          },
        }
      );

      const statusText = await statusResponse.text();

      if (!statusResponse.ok) {
        console.error(
          "fal.ai Kontext status request failed:",
          statusResponse.status,
          statusText
        );

        throw new Error(
          `fal.ai image editing status failed (${statusResponse.status}): ${
            statusText || "No error details returned."
          }`
        );
      }

      let status: {
        status?: string;
        error?: string;
      };

      try {
        status = JSON.parse(statusText);
      } catch {
        console.error(
          "fal.ai Kontext status returned invalid JSON:",
          statusText
        );

        throw new Error(
          "fal.ai returned an invalid image editing status response."
        );
      }

      console.log(
        "fal.ai Kontext status:",
        status.status
      );

      if (status.status === "COMPLETED") {
        completed = true;
        break;
      }

      if (status.status === "FAILED") {
        throw new Error(
          status.error ?? "fal.ai image editing failed."
        );
      }
    }

    // Step 3: Retrieve the completed result
    const resultResponse = await fetch(
      `https://queue.fal.run/fal-ai/flux-kontext/dev/requests/${requestId}`,
      {
        headers: {
          Authorization: `Key ${request.falApiKey}`,
        },
      }
    );

    const resultText = await resultResponse.text();

    if (!resultResponse.ok) {
      console.error(
        "fal.ai Kontext result request failed:",
        resultResponse.status,
        resultText
      );

      throw new Error(
        `fal.ai image editing result failed (${resultResponse.status}): ${
          resultText || "No error details returned."
        }`
      );
    }

    let result: {
      images?: Array<{
        url?: string;
        content_type?: string;
      }>;
    };

    try {
      result = JSON.parse(resultText);
    } catch {
      console.error(
        "fal.ai Kontext result returned invalid JSON:",
        resultText
      );

      throw new Error(
        "fal.ai returned an invalid image editing result."
      );
    }

    console.log(
      "fal.ai Kontext result received:",
      {
        hasImages: Array.isArray(result.images),
        imageCount: result.images?.length ?? 0,
      }
    );

    const imageUrl = result.images?.[0]?.url;

    if (!imageUrl) {
      console.error(
        "fal.ai completed successfully but returned no image URL:",
        result
      );

      throw new Error(
        "fal.ai completed the image edit but returned no image URL."
      );
    }

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
  }
}
