import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IMAGE_MODELS } from "@/lib/pollinations";
import { Cpu } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export function ModelSelector({ selectedModel, setSelectedModel }: ModelSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4 text-primary" />
        <Label className="text-sm font-medium text-foreground">Model</Label>
      </div>
      
      <RadioGroup
        value={selectedModel}
        onValueChange={setSelectedModel}
        className="grid grid-cols-2 gap-2"
      >
        {IMAGE_MODELS.map((model) => (
          <div key={model.name}>
            <RadioGroupItem
              value={model.name}
              id={model.name}
              className="peer sr-only"
            />
            <Label
              htmlFor={model.name}
              className="flex flex-col items-start p-3 rounded-lg border border-border/50 bg-secondary/30 cursor-pointer transition-all hover:border-primary/50 hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
            >
              <span className="font-medium text-foreground capitalize">{model.name}</span>
              <span className="text-xs text-muted-foreground">{model.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
