import { useEffect, useState } from "react";

export function useColorExtraction(imageUrl: string | undefined) {
  const [color, setColor] = useState("rgba(16, 185, 129, 0.4)"); // Default emerald glow opacity

  useEffect(() => {
    if (!imageUrl) {
      setColor("rgba(16, 185, 129, 0.4)");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1, 1);
          const data = ctx.getImageData(0, 0, 1, 1).data;
          const r = data[0];
          const g = data[1];
          const b = data[2];

          // Use a dark alpha blend so text remains perfectly readable on top
          setColor(`rgba(${r}, ${g}, ${b}, 0.35)`);
        }
      } catch (e) {
        // Fallback color for cross-origin or load errors
        setColor("rgba(16, 185, 129, 0.4)");
      }
    };
    img.onerror = () => {
      setColor("rgba(16, 185, 129, 0.4)");
    };
  }, [imageUrl]);

  return color;
}
