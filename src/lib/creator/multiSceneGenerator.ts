export type MultiScenePlan = {
  title: string;
  prompt: string;
  duration: number;
};

const sceneTitles = [
  "Opening Scene",
  "Main Story",
  "Challenge Moment",
  "Success Ending",
];

function cleanPrompt(prompt: string) {
  return prompt.trim().replace(/\s+/g, " ");
}

export function generateMultiScenePlan(
  prompt: string,
  count = 4
): MultiScenePlan[] {
  const basePrompt = cleanPrompt(prompt);

  if (!basePrompt) {
    throw new Error("Prompt is required.");
  }

  const safeCount = Math.min(Math.max(count, 1), 8);

  return Array.from({ length: safeCount }).map((_, index) => {
    const title = sceneTitles[index] || `Scene ${index + 1}`;

    if (index === 0) {
      return {
        title,
        duration: 5,
        prompt: `Opening scene for: ${basePrompt}. Show the beginning clearly and make it suitable for a vertical social video.`,
      };
    }

    if (index === 1) {
      return {
        title,
        duration: 5,
        prompt: `Main action scene for: ${basePrompt}. Show the most important moment with strong visual impact.`,
      };
    }

    if (index === 2) {
      return {
        title,
        duration: 5,
        prompt: `Challenge or emotional moment for: ${basePrompt}. Show tension, effort, or transformation.`,
      };
    }

    return {
      title,
      duration: 5,
      prompt: `Final closing scene for: ${basePrompt}. Show success, hope, result, or a strong ending for social media.`,
    };
  });
}
