import { useState } from "react";
import { toast } from "sonner";
import { PromptInput } from "./PromptInput";
import { ModelSelector } from "./ModelSelector";
import { AspectRatioSelector } from "./AspectRatioSelector";
import { AdvancedSettings } from "./AdvancedSettings";
import { ImageGallery } from "./ImageGallery";
import { generateMultipleImages, ASPECT_RATIOS } from "@/lib/pollinations";
import { Sparkles, Zap, ImageIcon } from "lucide-react";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("flux");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [imageCount, setImageCount] = useState(1);
  const [seed, setSeed] = useState("");
  const [enhance, setEnhance] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setImages([]);

    try {
      const ratio = ASPECT_RATIOS.find((r) => r.name === selectedRatio) || ASPECT_RATIOS[0];
      
      const generatedImages = await generateMultipleImages(
        {
          prompt,
          model: selectedModel,
          width: ratio.width,
          height: ratio.height,
          seed: seed ? parseInt(seed) : undefined,
          enhance,
          negative_prompt: negativePrompt || undefined,
          nologo: true,
        },
        imageCount
      );

      setImages(generatedImages);
      toast.success(`Generated ${generatedImages.length} image${generatedImages.length > 1 ? 's' : ''} successfully!`);
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">AI Image Generator</h1>
              <p className="text-xs text-muted-foreground">Powered by Pollinations AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          {/* Settings Panel */}
          <aside className="space-y-6">
            <div className="glass rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>Configure your generation</span>
              </div>
              
              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />

              <div className="border-t border-border/50 pt-6">
                <ModelSelector
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                />
              </div>

              <div className="border-t border-border/50 pt-6">
                <AspectRatioSelector
                  selectedRatio={selectedRatio}
                  setSelectedRatio={setSelectedRatio}
                />
              </div>

              <div className="border-t border-border/50 pt-6">
                <AdvancedSettings
                  imageCount={imageCount}
                  setImageCount={setImageCount}
                  seed={seed}
                  setSeed={setSeed}
                  enhance={enhance}
                  setEnhance={setEnhance}
                  negativePrompt={negativePrompt}
                  setNegativePrompt={setNegativePrompt}
                />
              </div>
            </div>

            {/* Stats Card */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Images generated</span>
                </div>
                <span className="font-mono text-lg font-bold text-foreground">{images.length}</span>
              </div>
            </div>
          </aside>

          {/* Gallery */}
          <section className="glass rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Generated Images</h2>
            </div>
            
            <ImageGallery 
              images={images} 
              isLoading={isLoading} 
              loadingCount={imageCount}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Created with Pollinations AI • Free, open-source AI image generation
          </p>
        </div>
      </footer>
    </div>
  );
}
