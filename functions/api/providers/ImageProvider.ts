export type ImageGenerationRequest = {
  tool: string;
  prompt: string;
  size: "1024x1024" | "1024x1536" | "1536x1024";
  falApiKey: string;
};

export type ImageGenerationResult = {
  imageBase64: string;
  mimeType: string;
};

export class ImageProvider {
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
}
