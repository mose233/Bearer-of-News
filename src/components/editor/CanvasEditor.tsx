import React, { useRef, useEffect } from "react";

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.font = "bold 48px Arial";
    ctx.fillText("xnewsapp.com", 100, 150);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="border rounded-xl w-full max-w-3xl"
    />
  );
}
