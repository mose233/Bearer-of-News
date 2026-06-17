export const MUSIC_VIDEO_PRICING = [
  {
    duration: "10 Seconds",
    price: "$0.70",
  },
  {
    duration: "20 Seconds",
    price: "$1.20",
  },
  {
    duration: "30 Seconds",
    price: "$1.70",
  },
  {
    duration: "40 Seconds",
    price: "$2.20",
  },
  {
    duration: "50 Seconds",
    price: "$2.70",
  },
  {
    duration: "60 Seconds",
    price: "$3.20",
  },
];

export const DEFAULT_MUSIC_VIDEO_DURATION =
  MUSIC_VIDEO_PRICING[0].duration;

export function getMusicVideoPrice(duration: string) {
  return (
    MUSIC_VIDEO_PRICING.find((item) => item.duration === duration)?.price ??
    MUSIC_VIDEO_PRICING[0].price
  );
}
