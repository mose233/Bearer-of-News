export type CreatorContentType =
  | "breaking"
  | "sports"
  | "entertainment"
  | "politics"
  | "business"
  | "general"
  | "promo"
  | "education"
  | "story"
  | "motivational";

export type CreatorTemplate = {
  label: string;
  caption: (prompt: string) => string;
  voice: (prompt: string) => string;
};

export const creatorTemplates: Record<CreatorContentType, CreatorTemplate> = {
  breaking: {
    label: "Breaking News",
    caption: (prompt) => `🚨 BREAKING NEWS: ${prompt}

Stay informed with XNewsApp for verified updates and developing stories.`,
    voice: (prompt) => `Breaking news from XNewsApp.

${prompt}

We are closely following this developing story. Stay with XNewsApp for trusted updates.`,
  },

  sports: {
    label: "Sports",
    caption: (prompt) => `⚽ SPORTS UPDATE: ${prompt}

Catch the latest sports action with XNewsApp.`,
    voice: (prompt) => `Sports update from XNewsApp.

${prompt}

Stay tuned for more match analysis, scores, and breaking sports news.`,
  },

  entertainment: {
    label: "Entertainment",
    caption: (prompt) => `🎬 ENTERTAINMENT UPDATE: ${prompt}

Stay connected with celebrity news and trending entertainment stories.`,
    voice: (prompt) => `Entertainment update from XNewsApp.

${prompt}

More entertainment headlines coming your way soon.`,
  },

  politics: {
    label: "Politics",
    caption: (prompt) => `🏛 POLITICAL UPDATE: ${prompt}

Stay informed with balanced political coverage from XNewsApp.`,
    voice: (prompt) => `Political news update from XNewsApp.

${prompt}

Stay with us for trusted analysis and developments.`,
  },

  business: {
    label: "Business",
    caption: (prompt) => `📈 BUSINESS UPDATE: ${prompt}

Get the latest financial and business news with XNewsApp.`,
    voice: (prompt) => `Business update from XNewsApp.

${prompt}

Stay informed on markets, finance, and economic trends.`,
  },

  general: {
    label: "General News",
    caption: (prompt) => `📰 NEWS UPDATE: ${prompt}

Stay informed with XNewsApp.`,
    voice: (prompt) => `News update from XNewsApp.

${prompt}

Stay with us for more verified updates.`,
  },

  promo: {
    label: "Promo / Advertisement",
    caption: (prompt) => `🔥 SPECIAL PROMO: ${prompt}

Create, promote, and grow with XNewsApp Creator Studio.`,
    voice: (prompt) => `Special promotion.

${prompt}

Take action today and discover what makes this offer worth your attention.`,
  },

  education: {
    label: "Educational Video",
    caption: (prompt) => `📚 LEARN SOMETHING NEW: ${prompt}

Simple, clear, and useful knowledge from XNewsApp Creator Studio.`,
    voice: (prompt) => `Today we are learning something important.

${prompt}

Let us break it down clearly and make it easy to understand.`,
  },

  story: {
    label: "Story / Short Film",
    caption: (prompt) => `🎥 STORY TIME: ${prompt}

Watch this short story created with XNewsApp Creator Studio.`,
    voice: (prompt) => `Here is a short story.

${prompt}

Follow the moment, feel the emotion, and enjoy the journey.`,
  },

  motivational: {
    label: "Motivational",
    caption: (prompt) => `💪 MOTIVATION: ${prompt}

Create your future one step at a time.`,
    voice: (prompt) => `Here is a moment of motivation.

${prompt}

Keep moving forward. Small steps can create powerful results.`,
  },
};

export function cleanCreatorPrompt(prompt: string) {
  return prompt.trim().replace(/\s+/g, " ");
}

export function generateCreatorContent(
  contentType: CreatorContentType,
  prompt: string
) {
  const cleanPrompt = cleanCreatorPrompt(prompt);
  const template = creatorTemplates[contentType] || creatorTemplates.general;

  return {
    caption: template.caption(cleanPrompt),
    voice: template.voice(cleanPrompt),
  };
}
