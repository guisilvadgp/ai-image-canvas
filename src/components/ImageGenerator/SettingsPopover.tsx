import { ChevronUp, Copy, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { IMAGE_MODELS, ASPECT_RATIOS } from "@/lib/pollinations";
import { useState } from "react";
import { toast } from "sonner";

interface SettingsPopoverProps {
  seed: string;
  setSeed: (seed: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedRatio: string;
  setSelectedRatio: (ratio: string) => void;
  imageCount: number;
  setImageCount: (count: number) => void;
  enhance: boolean;
  setEnhance: (enhance: boolean) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
}

export function SettingsPopover({
  seed,
  setSeed,
  selectedModel,
  setSelectedModel,
  selectedRatio,
  setSelectedRatio,
  imageCount,
  setImageCount,
  enhance,
  setEnhance,
  negativePrompt,
  setNegativePrompt,
}: SettingsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const randomizeSeed = () => {
    const newSeed = Math.floor(Math.random() * 1000000).toString();
    setSeed(newSeed);
  };

  const copySeed = () => {
    navigator.clipboard.writeText(seed);
    toast.success("Seed copiada!");
  };

  return (
    <div className="w-full">
      {/* Seed Display */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
        <div className="flex-1">
          <span className="text-xs text-muted-foreground">Sugestão</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-foreground">{seed || "Aleatória"}</span>
          </div>
        </div>
        <button
          onClick={copySeed}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          title="Copiar seed"
        >
          <Copy className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <p className="px-4 pb-3 text-xs text-muted-foreground">
        A sugestão é desbloqueada para aumentar a variedade das saídas
      </p>

      {/* Model and Ratio Selection */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Modelo</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="bg-muted/30 border-border/50 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {IMAGE_MODELS.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  <span className="capitalize">{model.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Proporção</Label>
          <Select value={selectedRatio} onValueChange={setSelectedRatio}>
            <SelectTrigger className="bg-muted/30 border-border/50 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASPECT_RATIOS.map((ratio) => (
                <SelectItem key={ratio.name} value={ratio.name}>
                  {ratio.label} ({ratio.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Image Count Slider */}
      <div className="px-4 pb-3 space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Quantidade de imagens</Label>
          <span className="text-sm font-medium text-foreground">{imageCount}</span>
        </div>
        <Slider
          value={[imageCount]}
          onValueChange={(value) => setImageCount(value[0])}
          min={1}
          max={8}
          step={1}
          className="w-full"
        />
      </div>

      {/* AI Enhancement Toggle */}
      <div className="flex items-center justify-between px-4 pb-3">
        <div>
          <Label className="text-sm text-foreground">AI Enhancement</Label>
          <p className="text-xs text-muted-foreground">Melhora a qualidade das imagens</p>
        </div>
        <Switch checked={enhance} onCheckedChange={setEnhance} />
      </div>

      <p className="px-4 pb-3 text-xs text-muted-foreground flex items-center gap-1">
        <span className="inline-block w-3 h-3 rounded-full bg-primary/50" />
        Powered by Pollinations AI
      </p>

      {/* Expandable Settings */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 border-t border-border/30 hover:bg-muted/30 transition-colors">
          <span className="text-sm font-medium text-primary">Configurações avançadas</span>
          <ChevronUp className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "" : "rotate-180"}`} />
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Seed personalizada</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Deixe vazio para aleatória"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="bg-muted/30 border-border/50"
              />
              <button
                onClick={randomizeSeed}
                className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                title="Gerar seed aleatória"
              >
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Prompt negativo</Label>
            <Textarea
              placeholder="O que você NÃO quer na imagem..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="bg-muted/30 border-border/50 min-h-[80px] resize-none"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
