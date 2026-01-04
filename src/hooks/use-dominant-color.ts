import { useEffect, useState } from "react";

interface RGB {
  r: number;
  g: number;
  b: number;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function getVibrantColor(imageData: ImageData): RGB {
  const data = imageData.data;
  const colorCounts: Map<string, { count: number; r: number; g: number; b: number; saturation: number }> = new Map();

  // Sample every 5th pixel for performance
  for (let i = 0; i < data.length; i += 20) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent/near-transparent pixels
    if (a < 128) continue;

    // Calculate saturation and brightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2 / 255;
    const s = max === min ? 0 : (max - min) / (l > 0.5 ? 510 - max - min : max + min);

    // Skip very dark, very light, or very unsaturated colors
    if (l < 0.15 || l > 0.85 || s < 0.2) continue;

    // Quantize colors to reduce noise
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    const key = `${qr},${qg},${qb}`;

    const existing = colorCounts.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorCounts.set(key, { count: 1, r: qr, g: qg, b: qb, saturation: s });
    }
  }

  // Find the most vibrant color (balance between count and saturation)
  let bestColor: RGB = { r: 255, g: 120, b: 50 }; // Fallback orange
  let bestScore = 0;

  colorCounts.forEach((value) => {
    const score = value.count * (1 + value.saturation * 2);
    if (score > bestScore) {
      bestScore = score;
      bestColor = { r: value.r, g: value.g, b: value.b };
    }
  });

  return bestColor;
}

export function useDominantColor(imageUrl: string | null) {
  const [hslColor, setHslColor] = useState<{ h: number; s: number; l: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setHslColor(null);
      return;
    }

    setIsLoading(true);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsLoading(false);
        return;
      }

      // Use a smaller canvas for performance
      const scale = Math.min(1, 100 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const vibrantRgb = getVibrantColor(imageData);
      const hsl = rgbToHsl(vibrantRgb.r, vibrantRgb.g, vibrantRgb.b);

      setHslColor(hsl);
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  return { hslColor, isLoading };
}
