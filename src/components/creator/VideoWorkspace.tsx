import PricingPanel from "./PricingPanel";
import { videoPricing } from "@/lib/pricing";
type VideoWorkspaceProps = {
  tool: string;
};

export default function VideoWorkspace({
  tool,
}: VideoWorkspaceProps) {
  return (
  <div className="space-y-6">

    <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6 text-white">
      <h2 className="text-2xl font-extrabold">
        {tool}
      </h2>

      <p className="mt-2 text-slate-300">
        Video AI Workspace
      </p>
    </div>

    <PricingPanel
      pricing={videoPricing}
      defaultOpen={false}
    />

  </div>
);
}
