import { useState } from "react";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { PricingCategory } from "@/lib/pricing";

type PricingPanelProps = {
  pricing: PricingCategory;
  defaultOpen?: boolean;
};

export default function PricingPanel({
  pricing,
  defaultOpen = false,
}: PricingPanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  const lowestPrice = Math.min(
    ...pricing.items.map((item) => item.price)
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 to-slate-950 shadow-lg">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/5"
      >
        <div>
          <h3 className="text-base font-extrabold text-white">
            {pricing.title}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            {pricing.subtitle}
          </p>

          <div className="mt-2 inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1">
            <DollarSign className="mr-1 h-3 w-3 text-emerald-400" />

            <span className="text-xs font-bold text-emerald-300">
              Starting from ${lowestPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="rounded-full bg-white/5 p-2">
          {open ? (
            <ChevronUp className="h-5 w-5 text-white" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white" />
          )}
        </div>
      </button>

      {/* Pricing Table */}
      {open && (
        <div className="border-t border-white/10 px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-400">
            <span>Generation</span>
            <span>Price (USD)</span>
          </div>

          <div className="space-y-2">
            {pricing.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition hover:border-emerald-400/30 hover:bg-emerald-500/10"
              >
                <span className="text-sm font-semibold text-slate-200">
                  {item.label}
                </span>

                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-extrabold text-emerald-300">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
            <p className="text-xs font-semibold leading-5 text-blue-100">
              💡 Prices shown are generation costs per request.
              Downloaded content is royalty-free for use within
              XNewsApp's Terms of Service.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
