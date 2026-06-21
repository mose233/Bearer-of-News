type VideoWorkspaceProps = {
  tool: string;
};

export default function VideoWorkspace({
  tool,
}: VideoWorkspaceProps) {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6 text-white">
      <h2 className="text-2xl font-extrabold">
        Video Workspace
      </h2>

      <p className="mt-2 text-slate-300">
        Selected Tool:
      </p>

      <div className="mt-4 rounded-xl bg-slate-800 p-4">
        <span className="font-bold text-emerald-400">
          {tool}
        </span>
      </div>
    </div>
  );
}
