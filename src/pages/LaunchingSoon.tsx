const LaunchingSoon = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">

        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight">
            🚀 XNewsApp
          </h1>

          <p className="mt-4 text-2xl font-semibold">
            Launching Soon
          </p>

          <p className="mt-4 text-muted-foreground text-lg">
            We're putting the finishing touches on Creator Studio to give you
            the best experience from day one.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-8 shadow-sm">

          <h2 className="text-xl font-semibold mb-6">
            Currently Completing
          </h2>

          <div className="space-y-4 text-lg">

            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">🇰🇪</span>
              <span>M-Pesa Integration</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">💳</span>
              <span>Visa Integration</span>
            </div>

          </div>

          <div className="mt-8 border-t pt-6">

            <p className="text-muted-foreground">
              Creator Studio will open as soon as secure payments are fully
              integrated and tested.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LaunchingSoon;
