import { useMemo } from "react";
import {
  creatorFonts,
  fontCategories,
  getRecommendedFonts,
} from "@/lib/creator/fontLibrary";

type TextFontStudioProps = {
  tool: string;
  selectedFont: string;
  onFontChange: (font: string) => void;
};

export default function TextFontStudio({
  tool,
  selectedFont,
  onFontChange,
}: TextFontStudioProps) {
  const recommended = useMemo(() => getRecommendedFonts(tool), [tool]);

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-extrabold text-white">
          Text & Font Studio
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-300">
          Choose a font style for posters, quote graphics, Facebook posts,
          videos and cinematic content.
        </p>
      </div>

      {recommended.length > 0 && (
        <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
          <div className="mb-2 text-xs font-extrabold uppercase tracking-wide text-emerald-300">
            Recommended Fonts
          </div>

          <div className="flex flex-wrap gap-2">
            {recommended.map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => onFontChange(font)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                  selectedFont === font
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
      )}

      {fontCategories.map((category) => {
        const fonts = creatorFonts.filter(
          (font) => font.category === category
        );

        return (
          <details
            key={category}
            className="mb-3 rounded-2xl border border-white/10 bg-white/5"
          >
            <summary className="cursor-pointer px-4 py-3 text-sm font-extrabold text-white">
              {category}
            </summary>

            <div className="space-y-2 p-3">
              {fonts.map((font) => (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => onFontChange(font.name)}
                  className={`w-full rounded-2xl border p-3 text-left transition ${
                    selectedFont === font.name
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div
                    className="text-lg font-bold text-white"
                    style={{
                      fontFamily: font.cssFamily,
                    }}
                  >
                    {font.sample}
                  </div>

                  <div className="mt-1 text-xs font-semibold text-slate-300">
                    {font.name}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    {font.useFor}
                  </div>
                </button>
              ))}
            </div>
          </details>
        );
      })}
    </div>
  );
}
