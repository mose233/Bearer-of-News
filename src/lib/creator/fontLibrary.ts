export type FontCategory =
  | "AI / Futuristic"
  | "Business / Headlines"
  | "Premium / Luxury"
  | "Music / Street"
  | "Historical / Fantasy";

export type CreatorFont = {
  name: string;
  category: FontCategory;
  sample: string;
  useFor: string;
  cssFamily: string;
};

export const creatorFonts: CreatorFont[] = [
  {
    name: "Bruno Ace",
    category: "AI / Futuristic",
    sample: "AI FUTURE",
    useFor: "AI, tech, cinematic covers",
    cssFamily: "'Bruno Ace', sans-serif",
  },
  {
    name: "Orbitron",
    category: "AI / Futuristic",
    sample: "CYBER NEWS",
    useFor: "Gaming, AI, futuristic titles",
    cssFamily: "'Orbitron', sans-serif",
  },
  {
    name: "Iceberg",
    category: "AI / Futuristic",
    sample: "DIGITAL ERA",
    useFor: "Modern AI graphics",
    cssFamily: "'Iceberg', sans-serif",
  },
  {
    name: "Bebas Neue",
    category: "Business / Headlines",
    sample: "BIG SALE",
    useFor: "Posters, ads, thumbnails",
    cssFamily: "'Bebas Neue', sans-serif",
  },
  {
    name: "Franklin Gothic",
    category: "Business / Headlines",
    sample: "BREAKING NEWS",
    useFor: "News, business, professional posts",
    cssFamily: "'Franklin Gothic Medium', Arial, sans-serif",
  },
  {
    name: "Stencil",
    category: "Business / Headlines",
    sample: "URBAN DROP",
    useFor: "Street, military, bold posters",
    cssFamily: "Stencil, Impact, sans-serif",
  },
  {
    name: "Felix Titling",
    category: "Premium / Luxury",
    sample: "LUXURY EVENT",
    useFor: "Weddings, premium flyers, certificates",
    cssFamily: "'Felix Titling', serif",
  },
  {
    name: "TypoGraphica",
    category: "Premium / Luxury",
    sample: "DESIGN POSTER",
    useFor: "Designer posters and premium branding",
    cssFamily: "TypoGraphica, serif",
  },
  {
    name: "New Rocker",
    category: "Music / Street",
    sample: "ROCK FEST",
    useFor: "Music, concerts, street events",
    cssFamily: "'New Rocker', cursive",
  },
  {
    name: "Metamorphous",
    category: "Historical / Fantasy",
    sample: "ANCIENT POWER",
    useFor: "Fantasy, historical, faith graphics",
    cssFamily: "'Metamorphous', serif",
  },
];

export const fontCategories: FontCategory[] = [
  "AI / Futuristic",
  "Business / Headlines",
  "Premium / Luxury",
  "Music / Street",
  "Historical / Fantasy",
];

export function getRecommendedFonts(tool: string): string[] {
  if (
    [
      "Text to Video",
      "Cinematic AI",
      "AI Music Video Studio",
      "Dance Animation",
    ].includes(tool)
  ) {
    return ["Bruno Ace", "Orbitron", "Iceberg"];
  }

  if (
    [
      "Product Ad Image",
      "Poster / Flyer",
      "Business Promo Video",
      "Facebook Reel Maker",
    ].includes(tool)
  ) {
    return ["Bebas Neue", "Franklin Gothic", "Stencil"];
  }

  if (
    [
      "News Slideshow Video",
      "AI News Presenter",
      "Facebook Post Image",
    ].includes(tool)
  ) {
    return ["Franklin Gothic", "Bebas Neue", "Orbitron"];
  }

  if (["Birthday Video", "Wedding Video"].includes(tool)) {
    return ["Felix Titling", "Metamorphous", "Bebas Neue"];
  }

  if (["Quote Image Creator"].includes(tool)) {
    return ["Metamorphous", "Felix Titling", "Bruno Ace"];
  }

  return ["Bebas Neue", "Bruno Ace", "Franklin Gothic"];
}

export function getFontByName(name: string): CreatorFont {
  return creatorFonts.find((font) => font.name === name) || creatorFonts[0];
}
