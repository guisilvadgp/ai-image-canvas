import { ChevronLeft, ChevronRight, Download, Grid, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ImageViewerProps {
  images: string[];
  isLoading: boolean;
  loadingCount: number;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
}

export function ImageViewer({ images, isLoading, loadingCount, selectedIndex, onSelectIndex }: ImageViewerProps) {
  const [viewMode, setViewMode] = useState<"single" | "grid">("single");

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `palazia-image-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  const goToPrevious = () => {
    onSelectIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
  };

  const goToNext = () => {
    onSelectIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
  };

  // Empty State
  if (!isLoading && images.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-2xl">
        <div className="text-center p-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-muted/30 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-muted-foreground/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-muted-foreground text-lg">Suas imagens aparecerão aqui</p>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-2xl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Gerando {loadingCount} {loadingCount > 1 ? 'imagens' : 'imagem'}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="h-8 w-8 rounded-full"
            disabled={images.length <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground font-mono">
            {selectedIndex + 1} / {images.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="h-8 w-8 rounded-full"
            disabled={images.length <= 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("single")}
            className={`p-2 rounded-md transition-colors ${
              viewMode === "single" ? "bg-muted" : "hover:bg-muted/50"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image or Grid */}
      {viewMode === "single" ? (
        <div className="flex-1 relative group">
          <img
            src={images[selectedIndex]}
            alt={`Generated image ${selectedIndex + 1}`}
            className="w-full h-full object-contain rounded-2xl"
          />
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleDownload(images[selectedIndex], selectedIndex)}
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 bg-background/80 hover:bg-background"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => {
                onSelectIndex(index);
                setViewMode("single");
              }}
              className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                index === selectedIndex ? "border-primary" : "border-transparent hover:border-muted"
              }`}
            >
              <img
                src={image}
                alt={`Generated image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {images.length > 1 && viewMode === "single" && (
        <div className="flex gap-2 justify-center">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelectIndex(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedIndex
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-muted opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
