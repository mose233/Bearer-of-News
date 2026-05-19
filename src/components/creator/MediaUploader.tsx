import { Upload, ImageIcon, Video } from "lucide-react";
import { Input } from "@/components/ui/input";

type MediaUploaderProps = {
  onMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MediaUploader({ onMediaUpload }: MediaUploaderProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/40 p-4 text-white">
      <div>
        <label className="text-sm font-extrabold text-white">
          Upload Images or Video
        </label>

        <p className="mt-1 text-sm font-medium leading-6 text-slate-300">
          Upload your own photos or videos to combine with AI-generated scenes.
        </p>
      </div>

      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/20 bg-slate-900/40 px-6 py-10 text-center transition hover:border-cyan-400/50 hover:bg-slate-900/70">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/15 transition group-hover:scale-105">
          <Upload className="h-8 w-8 text-cyan-300" />
        </div>

        <span className="text-base font-extrabold text-white">
          Click to Upload
        </span>

        <span className="mt-2 max-w-sm text-sm font-medium leading-6 text-slate-300">
          Upload multiple images or videos to build your Facebook-ready story.
        </span>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200">
            <ImageIcon className="h-4 w-4 text-cyan-300" />
            Images
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-200">
            <Video className="h-4 w-4 text-violet-300" />
            Videos
          </div>
        </div>

        <Input
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={onMediaUpload}
        />
      </label>
    </div>
  );
}
