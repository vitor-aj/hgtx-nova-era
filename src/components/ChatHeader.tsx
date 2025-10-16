import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ChatHeader = () => {
  const models = [
    "ChatGPT 4.1",
    "GPT-5 Mini",
    "Claude 3.5 Sonnet",
    "Gemini 2.5 Flash",
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm text-muted-foreground">Online</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 glass-effect">
              <span className="font-medium">ChatGPT 4.1</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="glass-effect">
            {models.map((model) => (
              <DropdownMenuItem key={model} className="cursor-pointer">
                {model}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-sm text-muted-foreground">
        Modelo de linguagem avançado
      </div>
    </header>
  );
};
