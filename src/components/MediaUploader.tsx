import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

type MediaUploaderProps = {
  onMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MediaUploader({ onMediaUpload }: MediaUploaderProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload Images or Video</label>

      <label className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
        <Upload className="w-10 h-10 text-gray-400 mb-3" />

        <span className="font-medium">Click to Upload</span>

        <span className="text-sm text-gray-500 mt-1">
          Upload multiple images or videos
        </span>

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
