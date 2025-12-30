import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ASPECT_RATIOS } from "@/lib/pollinations";
import { RatioIcon } from "lucide-react";

interface AspectRatioSelectorProps {
  selectedRatio: string;
  setSelectedRatio: (ratio: string) => void;
}

export function AspectRatioSelector({ selectedRatio, setSelectedRatio }: AspectRatioSelectorProps) {
  const getIconStyle = (ratio: string) => {
    const [w, h] = ratio.split(":").map(Number);
    const maxSize = 24;
    const aspectRatio = w / h;
    
    if (aspectRatio > 1) {
      return { width: maxSize, height: Math.round(maxSize / aspectRatio) };
    } else {
      return { width: Math.round(maxSize * aspectRatio), height: maxSize };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <RatioIcon className="w-4 h-4 text-primary" />
        <Label className="text-sm font-medium text-foreground">Aspect Ratio</Label>
      </div>
      
      <RadioGroup
        value={selectedRatio}
        onValueChange={setSelectedRatio}
        className="grid grid-cols-3 gap-2"
      >
        {ASPECT_RATIOS.map((ratio) => {
          const iconStyle = getIconStyle(ratio.name);
          return (
            <div key={ratio.name}>
              <RadioGroupItem
                value={ratio.name}
                id={`ratio-${ratio.name}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`ratio-${ratio.name}`}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer transition-all hover:border-primary/50 hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 gap-2"
              >
                <div
                  className="border-2 border-current rounded-sm"
                  style={{ width: iconStyle.width, height: iconStyle.height }}
                />
                <div className="text-center">
                  <span className="font-medium text-foreground text-sm">{ratio.name}</span>
                  <p className="text-xs text-muted-foreground">{ratio.label}</p>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
