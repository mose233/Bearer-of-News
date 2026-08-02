export type ImageGenerationRequest = {
  tool: string;
  prompt: string;
  size: "1024x1024" | "1024x1536" | "1536x1024";
};

export type ImageGenerationResult = {
  imageBase64: string;
  mimeType: string;
};

export class ImageProvider {
  static async generate(
    request: ImageGenerationRequest
  ): Promise<ImageGenerationResult> {
    throw new Error("Not implemented.");
  }
}
