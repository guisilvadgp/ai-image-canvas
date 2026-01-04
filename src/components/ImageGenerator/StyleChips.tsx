import { Sparkles } from "lucide-react";

interface StyleChipsProps {
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  onSuggest: () => void;
}

const STYLES = [
  { id: "none", label: "None" },
  { id: "35mm film", label: "35mm film" },
  { id: "minimal", label: "Minimal" },
  { id: "cinematic", label: "Cinematic" },
  { id: "anime", label: "Anime" },
  { id: "watercolor", label: "Watercolor" },
  { id: "oil painting", label: "Oil painting" },
  { id: "digital art", label: "Digital art" },
  { id: "photography", label: "Photography" },
];

export function StyleChips({ selectedStyle, setSelectedStyle, onSuggest }: StyleChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onSuggest}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Sugerir
      </button>
      
      {STYLES.map((style) => (
        <button
          key={style.id}
          onClick={() => setSelectedStyle(style.id === selectedStyle ? "none" : style.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            style.id === selectedStyle
              ? "bg-foreground text-background"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {style.label}
        </button>
      ))}
    </div>
  );
}
