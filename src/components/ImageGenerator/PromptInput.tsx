import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function PromptInput({ prompt, setPrompt, onGenerate, isLoading }: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        onGenerate();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Describe the image you want to create... (e.g., 'A majestic dragon flying over a medieval castle at sunset')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[120px] resize-none bg-secondary/50 border-border/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground text-base"
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          Press Enter to generate
        </div>
      </div>

      <Button
        onClick={onGenerate}
        disabled={!prompt.trim() || isLoading}
        className="w-full h-12 gradient-primary hover:opacity-90 transition-opacity text-primary-foreground font-semibold text-base glow"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Image
          </>
        )}
      </Button>
    </div>
  );
}
