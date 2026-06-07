type GeneratedProductActionsProps = {
  productType?: "image" | "video" | "audio" | "design";
  onPublishToFacebook: () => void;
  onDownload: () => void;
  onUseInVideo?: () => void;
};

export default function GeneratedProductActions({
  productType = "image",
  onPublishToFacebook,
  onDownload,
  onUseInVideo,
}: GeneratedProductActionsProps) {
  const downloadLabel =
    productType === "video"
      ? "Download MP4"
      : productType === "audio"
      ? "Download Audio"
      : productType === "design"
      ? "Download Design"
      : "Download Image";

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <button
        type="button"
        onClick={onPublishToFacebook}
        className="rounded-2xl bg-blue-600 px-4 py-3 text-xs font-extrabold text-white transition hover:bg-blue-500"
      >
        Publish to Facebook
      </button>

      <button
        type="button"
        onClick={onDownload}
        className="rounded-2xl bg-slate-700 px-4 py-3 text-xs font-extrabold text-white transition hover:bg-slate-600"
      >
        {downloadLabel}
      </button>

      {onUseInVideo && (
        <button
          type="button"
          onClick={onUseInVideo}
          className="rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-extrabold text-white transition hover:bg-emerald-500"
        >
          Use in Video
        </button>
      )}
    </div>
  );
}
