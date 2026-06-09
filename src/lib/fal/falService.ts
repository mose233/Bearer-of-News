import { falModelByTool } from "./falModels";
import { FalVideoRequest, FalVideoResult } from "./falTypes";

export async function generateFalVideoMock(
  request: FalVideoRequest
): Promise<FalVideoResult> {
  const model = falModelByTool[request.tool];

  console.log("fal.ai mock request prepared:", {
    model,
    request,
  });

  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()),
    status: "completed",
    videoUrl: "",
  };
}
