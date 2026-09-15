import { useState } from "react";
import type { ElementType } from "react";
import { Image, Music, Sparkles, Video, Clapperboard } from "lucide-react";

export type AiToolCategoryTitle =
  | "Picture AI"
  | "Video AI"
  | "Music AI"
  | "Cinematic AI";

export type AiToolSelection = {
  category: AiToolCategoryTitle;
  tool: string;
};

type AiToolCategory = {
  title: AiToolCategoryTitle;
  description: string;
  icon: ElementType;
  accent: string;
  tools: string[];
};

type AiToolLauncherProps = {
  selectedTool: AiToolSelection | null;
  onSelectTool: (selection: AiToolSelection) => void;
};

const categories: AiToolCategory[] = [
  {
    title: "Picture AI",
    description: "Images, photos & designs",
    icon: Image,
    accent: "from-pink-500 to-fuchsia-600",
    tools: [
          
      "Running",
      "Swimming",
      "Dancing",
      "Mountain Climbing",
      "Hiking",
      "Cycling",
      "Fitness",
      "Boxing",
      "Playing Football",
      "Basketball",
      "Tennis",
      "Horse Riding",
      "Skydiving",
      "Surfing",
      "Scuba Diving",
      "Kayaking",

      "Safari",
      "Camping",
      "Campfire",
      "Waterfall",
      "Forest",
      "Desert",
      "Snow Adventure",

      "In the Plane",
      "At Airport",
      "Luxury Train",
      "Luxury Car",
      "Yacht",
      "Helicopter Ride",
      "Luxury Hotel",
      "Fine Dining",
      "Concert",
      "On Stage",
      "Party",
      "Red Carpet",

      "Beach",
      "Tropical Island",
      "Sunset",

      "Nairobi",
      "Mombasa",
      "Diani Beach",
      "Maasai Mara",
      "Mount Kenya",

      "London",
      "Paris",
      "New York",
      "Dubai",
      "Tokyo",
      "Singapore",
      "Sydney",
      "Rome",
      "Barcelona",
      "Santorini",

      "Washington DC",
      "White House",
      "Great Wall of China",
      "Pyramids of Egypt",
      "Colosseum",
      "Taj Mahal",
      "Buckingham Palace",
      "Eiffel Tower",
      "Statue of Liberty",
      "Times Square",
      "Golden Gate Bridge",
      "Mount Fuji",

      "Wedding",
      "Graduation",
      "Birthday",
      "Celebration",
      "Political Rally",
      "Family Gathering",
      "Fashion Photoshoot",
      "Magazine Photoshoot",
      "Café",
      "Restaurant",
      "Shopping",
      "City Night",
      "Rooftop",
      "Garden",
      "Ocean",
      "Dream Destination",
      "Movie Scene",
    ],
  },
  {
    title: "Video AI",
    description: "Social videos",
    icon: Video,
    accent: "from-violet-500 to-purple-600",
    tools: [
      "AI Greeting Video Studio",
      "Birthday Video",
      "Wedding Video",
      "Dance Animation",
      "Photo to Video",
      "Text to Video",
      "Image to Video",
      "Talking Photo",
      "AI Talking Avatar",
      "Lip Sync Video",
      "Singing Photo",
      "WhatsApp Status Maker",
      "Facebook Reel Maker",
      "TikTok Video Maker",
      "Instagram Reel Maker",
      "YouTube Shorts Maker",
      "Photo Music Video",
      "AI Music Video Studio",
      "Business Promo Video",
      "Product Ad Generator",
      "Real Estate Video",
      "Event Promotion Video",
      "Motivational Video",
      "Story Generator",
      "News Summary Video",
      "News Slideshow Video",
      "Educational Explainer Video",
      "Quote Video",
      "Graduation Video",
      "Baby Shower Video",
      "Dancing",
      "Playing Football",
      "Running",
      "Walking",
      "Exercising",
      "Boxing",
      "Basketball",
      "Tennis",
      "Swimming",
      "Cycling",
      "Jumping",
      "Cooking",
      "Eating",
      "Shopping",
      "Driving",
      "Playing Music",
      "Singing",
      "Working Out",
      "Horse Riding",
      "Skateboarding",
      "Football Match Fan",
      "Football Stadium Celebration",
      "Football Fan Celebration",
      "Football Training",
      "Football Match",
      "Fan at Football Match",
      "Manchester United Fan",
      "Arsenal Fan",
      "Liverpool Fan",
      "Chelsea Fan",
      "Manchester City Fan",
      "Real Madrid Fan",
      "Barcelona Fan",
      "Bayern Munich Fan",
      "Paris Saint-Germain Fan",
      "Juventus Fan",
      "AC Milan Fan",
      "Inter Milan Fan",
      "Premier League Fan",
      "Champions League Fan",
      "Political Rally",
      "Political Rally Crowd",
      "Political Campaign",
      "Campaign Event",
      "Political Speech",
      "Fan at Political Rally",
      "Political Rally in Nairobi",
      "Political Rally in Washington DC",
      "Election Campaign",
      "Election Rally",
      "Public Demonstration",
      "Street Crowd",
      "Public Event",
      "Celebration Crowd",
      "Concert",
      "On Stage",
      "Party",
      "Red Carpet",
      "Fashion Show",
      "Model Photoshoot",
      "Wedding Celebration",
      "Birthday Party",
      "Family Celebration",
      "Graduation Celebration",
      "Beach Party",
      "Yacht Party",
      "Nightlife",
      "Restaurant",
      "Café",
      "Fine Dining",
      "Luxury Hotel",
      "Safari",
      "At the Beach",
      "Tropical Island",
      "Travel Reel",
      "Tourist in Nairobi",
      "Tourist in London",
      "Tourist in Paris",
      "Tourist in New York",
      "Tourist in Dubai",
      "Tourist in Tokyo",
      "Tourist in Singapore",
      "Tourist in Rome",
      "Tourist in Barcelona",
      "Tourist in Sydney",
      "Tourist in Washington DC",
      "Tourist at Eiffel Tower",
      "Tourist at Times Square",
      "Tourist at Great Wall of China",
      "Tourist at Pyramids of Egypt",
      "Tourist at White House",
      "Tourist at Buckingham Palace",
      "Tourist at Statue of Liberty",
      "Tourist at Colosseum",
      "Tourist at Taj Mahal",
      "Tourist at Mount Fuji",
      "Camping",
      "Campfire",
      "Waterfall Adventure",
      "Forest Adventure",
      "Desert Adventure",
      "Snow Adventure",
      "Hiking",
      "Mountain Climbing",
      "At the Airport",
      "Inside an Airplane",
      "Luxury Train",
      "Luxury Car",
      "Yacht",
      "Helicopter Ride",
      "AI News Presenter",
      "AI Spokesperson",
      "Virtual Influencer",
      "AI Presenter",
      "Talking News Anchor",
      "Business Presenter",
      "Product Presenter",
      "Virtual Teacher",
      "Virtual Tour Guide",
      "Cinematic Video",
      "Cinematic Slow Motion",
      "Camera Zoom",
      "Camera Pan",
      "Camera Orbit",
      "Drone Shot",
      "Close-Up Shot",
      "Action Scene",
      "Movie Scene",
      "Short Film",
      "Trailer Video",
      "Transformation Video",
      "Skydiving",
      "Surfing",
      "Scuba Diving",
      "Kayaking",
      "Skiing",
      "Snowboarding",
      "Wakeboarding",
      "Rock Climbing",
      "Paragliding",
      "Bungee Jumping",
      "Obituary / Tribute Studio",
      "Funeral Program Video",
      "Church Announcement Video",
      "Bible Verse Video",
      "Crusade Promo Video",
      "Youth Service Promo Video",
      "Conference Promo Video",
    ],
  },
  {
    title: "Music AI",
    description: "Songs & audio",
    icon: Music,
    accent: "from-cyan-500 to-blue-600",
    tools: [
      "AI Song Studio",
      "Birthday Song Creator",
      "Wedding Song Creator",
      "Love Song Creator",
      "Baby Dedication Song Creator",
      "Gospel Song Creator",
      "Praise & Worship Song Creator",
      "Bible Verse Song Creator",
      "Choir Song Creator",
      "Afrobeats Song Creator",
      "Amapiano Song Creator",
      "Bongo Flava Song Creator",
      "Hip Hop Song Creator",
      "Dancehall Song Creator",
      "Business Jingle Creator",
      "Political Campaign Song Creator",
      "School Anthem Creator",
      "Lyrics Generator",
      "Song Writer",
      "Background Music Generator",
      "Beat Generator",
    ],
  },
  {
    title: "Cinematic AI",
    description: "Premium motion",
    icon: Clapperboard,
    accent: "from-amber-500 to-orange-600",
    tools: [
      "Talking Avatar",
      "Singing Animation",
      
      "Lip Sync Video",
      
      "Photo to Video",
      "Image to Video",
      "AI News Presenter",
      "AI Spokesperson",
      "Virtual Influencer",
      "Story-to-Video Generator",
      "Short Film Generator",
      "Movie Scene Generator",
      "Trailer Generator",
      "Text to Video",
      "Wedding Cinematic Film",
      "Travel Cinematic Film",
      "Real Estate Cinematic Tour",
      "Product Commercial Generator",
      "Church Sermon Cinematic",
      "Motivational Cinematic Video",
      "Documentary Generator",
    ],
  },
];

export default function AiToolLauncher({
  selectedTool,
  onSelectTool,
}: AiToolLauncherProps) {
  const [openCategory, setOpenCategory] =
    useState<AiToolCategoryTitle | null>(null);

  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-[#111827] p-3 text-white shadow-creator sm:p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-1 text-[11px] font-bold text-violet-100">
            <Sparkles className="h-3.5 w-3.5" />
            Creator Tools
          </div>

          <h2 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
            Choose a tool
          </h2>
        </div>

        {selectedTool && (
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-200">
            {selectedTool.category}: {selectedTool.tool}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 [&>div:nth-child(4)]:hidden">
        {categories.map((category) => {
          const Icon = category.icon;
          const isOpen = openCategory === category.title;
          const selectedInCategory =
            selectedTool?.category === category.title ? selectedTool.tool : "";

          return (
            <div
              key={category.title}
              className={`rounded-2xl border p-3 transition ${
                selectedInCategory
                  ? "border-violet-300/50 bg-violet-500/10"
                  : "border-white/10 bg-slate-950/50 hover:border-white/20 hover:bg-slate-950/80"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenCategory(isOpen ? null : category.title)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div className="min-w-0">
                  <div
                    className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r ${category.accent}`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>

                  <h3 className="text-sm font-extrabold text-white">
                    {category.title}
                  </h3>

                  <p className="mt-1 truncate text-[11px] font-medium leading-4 text-slate-300">
                    {selectedInCategory || category.description}
                  </p>
                </div>

                <span
                  className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="mt-3 max-h-[300px] space-y-1.5 overflow-y-auto pr-1">
                  {category.tools.map((tool) => {
                    const active =
                      selectedTool?.category === category.title &&
                      selectedTool?.tool === tool;

                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => {
                          onSelectTool({
                            category: category.title,
                            tool,
                          });

                          setOpenCategory(null);
                        }}
                        className={`w-full rounded-xl border px-3 py-2.5 text-left text-[11px] font-bold transition ${
                          active
                            ? "border-violet-300 bg-violet-500/25 text-white"
                            : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {tool}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
