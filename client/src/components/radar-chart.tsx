"use client";

import { useRef, useEffect } from "react";

interface RadarChartProps {
  data: Record<string, number>;
}

export default function RadarChart({ data }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animationDuration = 500; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set canvas dimensions
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;

      // Draw the hexagon outline
      const categories = Object.keys(data);
      const angleStep = (Math.PI * 2) / categories.length;

      // Draw axis lines and labels
      ctx.strokeStyle = "#888";
      ctx.fillStyle = "#000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";

      categories.forEach((category, i) => {
        const angle = i * angleStep - Math.PI / 2;

        // Draw axis line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + radius * Math.cos(angle),
          centerY + radius * Math.sin(angle)
        );
        ctx.stroke();

        // Draw category label
        const labelX = centerX + (radius + 20) * Math.cos(angle);
        const labelY = centerY + (radius + 20) * Math.sin(angle);

        ctx.fillStyle = "#0077b6"; // Red color for labels
        ctx.fillText(category, labelX, labelY);
      });

      // Draw concentric hexagons (grid lines)
      for (let r = 0.2; r <= 1; r += 0.2) {
        ctx.beginPath();
        categories.forEach((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = centerX + radius * r * Math.cos(angle);
          const y = centerY + radius * r * Math.sin(angle);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
      }

      // Draw data polygon
      ctx.beginPath();
      categories.forEach((category, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const value = data[category] * progress;
        const x = centerX + radius * value * Math.cos(angle);
        const y = centerY + radius * value * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();

      // Fill with semi-transparent green
      ctx.fillStyle = "#0077b6";
      ctx.fill();

      // Stroke the data polygon
      ctx.strokeStyle = "#0077b6";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={280}
      
    />
  );
}
