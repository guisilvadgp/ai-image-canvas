import { Download, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  isLoading: boolean;
  loadingCount: number;
}

export function ImageGallery({ images, isLoading, loadingCount }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-image-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (!isLoading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
        <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-6 animate-float">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No images yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Enter a prompt and click generate to create stunning AI images
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: loadingCount }).map((_, i) => (
            <div
              key={`loading-${i}`}
              className="aspect-square rounded-lg bg-secondary/50 animate-pulse relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" 
                   style={{ backgroundSize: "200% 100%" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Generating...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generated Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative rounded-lg overflow-hidden bg-secondary/30 border border-border/50 hover:border-primary/50 transition-all"
            >
              <img
                src={image}
                alt={`Generated image ${index + 1}`}
                className="w-full h-auto object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 bg-secondary/80 hover:bg-secondary"
                        onClick={() => setSelectedImage(image)}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                      <img
                        src={image}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-auto rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 bg-secondary/80 hover:bg-secondary"
                    onClick={() => handleDownload(image, index)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
