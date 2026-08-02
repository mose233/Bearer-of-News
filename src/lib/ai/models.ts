export type PictureTool =
  | "Text to Image"
  | "AI Art Generator"
  | "Quote Image Creator"
  | "Meme Generator"
  | "Poster / Flyer"
  | "Event Poster"
  | "Business Banner"
  | "Product Ad Image"
  | "Facebook Post Image"
  | "Instagram Post Image"
  | "WhatsApp Status Image"
  | "Thumbnail Creator";

export const PictureModels: Record<PictureTool, string> = {
  "Text to Image": "fal-ai/flux/dev",
  "AI Art Generator": "fal-ai/flux/dev",
  "Quote Image Creator": "fal-ai/flux/dev",
  "Meme Generator": "fal-ai/flux/dev",
  "Poster / Flyer": "fal-ai/flux/dev",
  "Event Poster": "fal-ai/flux/dev",
  "Business Banner": "fal-ai/flux/dev",
  "Product Ad Image": "fal-ai/flux/dev",
  "Facebook Post Image": "fal-ai/flux/dev",
  "Instagram Post Image": "fal-ai/flux/dev",
  "WhatsApp Status Image": "fal-ai/flux/dev",
  "Thumbnail Creator": "fal-ai/flux/dev",
};

export function getPictureModel(tool: PictureTool) {
  return PictureModels[tool];
}
