import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  showModelSelector?: boolean;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

export const ChatHeader = ({ 
  showModelSelector = false,
  selectedModel = "ChatGPT 4.1",
  onModelChange
}: ChatHeaderProps) => {
  const models = [
    "ChatGPT 4.1",
    "ChatGPT 5",
    "Claude Sonnet 4.5",
    "Claude Opus 4.1",
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm text-muted-foreground">Online</span>
        </div>
        
        {showModelSelector && onModelChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 glass-effect">
                <span className="font-medium">{selectedModel}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass-effect bg-popover border-border z-50">
              {models.map((model) => (
                <DropdownMenuItem 
                  key={model} 
                  className="cursor-pointer"
                  onClick={() => onModelChange(model)}
                >
                  {model}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {showModelSelector ? "Modelo de linguagem avançado" : "Sistema HGTX Codex"}
      </div>
    </header>
  );
};
