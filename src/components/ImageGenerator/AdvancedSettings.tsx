import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Settings, ChevronDown } from "lucide-react";
import { useState } from "react";

interface AdvancedSettingsProps {
  imageCount: number;
  setImageCount: (count: number) => void;
  seed: string;
  setSeed: (seed: string) => void;
  enhance: boolean;
  setEnhance: (enhance: boolean) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
}

export function AdvancedSettings({
  imageCount,
  setImageCount,
  seed,
  setSeed,
  enhance,
  setEnhance,
  negativePrompt,
  setNegativePrompt,
}: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-all">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          <span className="font-medium text-foreground">Advanced Settings</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-4 space-y-6">
        {/* Image Count */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">Number of Images</Label>
            <span className="text-sm text-primary font-mono">{imageCount}</span>
          </div>
          <Slider
            value={[imageCount]}
            onValueChange={([value]) => setImageCount(value)}
            min={1}
            max={4}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>4</span>
          </div>
        </div>

        {/* Seed */}
        <div className="space-y-2">
          <Label htmlFor="seed" className="text-sm font-medium text-foreground">
            Seed (optional)
          </Label>
          <Input
            id="seed"
            type="number"
            placeholder="Random seed for reproducibility"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="bg-secondary/50 border-border/50 focus:border-primary/50"
          />
          <p className="text-xs text-muted-foreground">Use the same seed to reproduce similar results</p>
        </div>

        {/* Enhance */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium text-foreground">AI Prompt Enhancement</Label>
            <p className="text-xs text-muted-foreground">Let AI improve your prompt for better results</p>
          </div>
          <Switch checked={enhance} onCheckedChange={setEnhance} />
        </div>

        {/* Negative Prompt */}
        <div className="space-y-2">
          <Label htmlFor="negative" className="text-sm font-medium text-foreground">
            Negative Prompt
          </Label>
          <Input
            id="negative"
            placeholder="What to avoid (e.g., blurry, low quality)"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            className="bg-secondary/50 border-border/50 focus:border-primary/50"
          />
          <p className="text-xs text-muted-foreground">Describe what you don't want in the image</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
