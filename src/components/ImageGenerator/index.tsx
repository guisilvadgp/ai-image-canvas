import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StyleChips } from "./StyleChips";
import { SettingsPopover } from "./SettingsPopover";
import { ImageViewer } from "./ImageViewer";
import { generateMultipleImages, ASPECT_RATIOS } from "@/lib/pollinations";
import { Sparkles, Loader2, Copy, RefreshCw, HelpCircle, MoreVertical } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDominantColor } from "@/hooks/use-dominant-color";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("flux");
  const [selectedRatio, setSelectedRatio] = useState("16:9");
  const [seed, setSeed] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("none");
  const [imageCount, setImageCount] = useState(4);
  const [enhance, setEnhance] = useState(true);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const currentImage = images.length > 0 ? images[selectedImageIndex] : null;
  const { hslColor } = useDominantColor(currentImage);

  // Apply dynamic primary color based on the selected image
  useEffect(() => {
    if (hslColor) {
      const root = document.documentElement;
      root.style.setProperty("--primary", `${hslColor.h} ${Math.max(hslColor.s, 60)}% ${Math.min(Math.max(hslColor.l, 40), 55)}%`);
      root.style.setProperty("--accent", `${hslColor.h} ${Math.max(hslColor.s - 10, 50)}% ${Math.min(Math.max(hslColor.l + 5, 45), 60)}%`);
      root.style.setProperty("--ring", `${hslColor.h} ${Math.max(hslColor.s, 60)}% ${Math.min(Math.max(hslColor.l, 40), 55)}%`);
    }
  }, [hslColor]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Digite um prompt primeiro");
      return;
    }

    setIsLoading(true);
    setImages([]);
    setSelectedImageIndex(0);

    try {
      const ratio = ASPECT_RATIOS.find((r) => r.name === selectedRatio) || ASPECT_RATIOS[1];
      
      const finalPrompt = selectedStyle !== "none" 
        ? `${prompt}, ${selectedStyle} style`
        : prompt;
      
      const generatedImages = await generateMultipleImages(
        {
          prompt: finalPrompt,
          model: selectedModel,
          width: ratio.width,
          height: ratio.height,
          seed: seed ? parseInt(seed) : undefined,
          enhance: enhance,
          negative_prompt: negativePrompt || undefined,
          nologo: true,
          safe: false,
        },
        imageCount
      );

      setImages(generatedImages);
      
      if (!seed) {
        setSeed(Math.floor(Math.random() * 1000000).toString());
      }
      
      toast.success("Imagens geradas com sucesso!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Falha ao gerar imagens. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        handleGenerate();
      }
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copiado!");
  };

  const clearPrompt = () => {
    setPrompt("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold text-foreground">Palazia</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <HelpCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Left Panel - Prompt & Settings */}
        <div className="w-[480px] flex flex-col relative">
          {/* Background image preview */}
          {images.length > 0 && (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={images[selectedImageIndex]}
                alt="Background preview"
                className="w-full h-full object-cover opacity-30 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
            </div>
          )}
          
          <div className="relative z-10 flex flex-col h-full p-4">
            {/* Prompt Card */}
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden flex-shrink-0">
              <div className="p-4">
                <Textarea
                  placeholder="Descreva a imagem que você quer criar..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[120px] resize-none bg-transparent border-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/70 p-0"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyPrompt}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                    title="Copiar prompt"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={clearPrompt}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                    title="Limpar prompt"
                  >
                    <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isLoading}
                  className="bg-primary hover:bg-primary/90 rounded-full px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Criar
                    </>
                  )}
                </Button>
              </div>

              {/* Style Chips */}
              <div className="px-4 pb-4">
                <StyleChips
                  selectedStyle={selectedStyle}
                  setSelectedStyle={setSelectedStyle}
                  onSuggest={() => {}}
                />
              </div>

              {/* Settings Panel */}
              <SettingsPopover
                seed={seed}
                setSeed={setSeed}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                selectedRatio={selectedRatio}
                setSelectedRatio={setSelectedRatio}
                imageCount={imageCount}
                setImageCount={setImageCount}
                enhance={enhance}
                setEnhance={setEnhance}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Image Viewer */}
        <div className="flex-1 p-4">
          <ImageViewer
            images={images}
            isLoading={isLoading}
            loadingCount={imageCount}
            selectedIndex={selectedImageIndex}
            onSelectIndex={setSelectedImageIndex}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-4 py-3 border-t border-border/30 text-xs text-muted-foreground">
        <p>Exoneração de responsabilidade: as ferramentas IA podem cometer erros. Por isso, cheque os resultados</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
          <a href="#" className="hover:text-foreground transition-colors">Termos de Serviço</a>
        </div>
      </footer>
    </div>
  );
}
