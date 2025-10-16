import { ChevronDown, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ChatHeaderProps {
  showModelSelector?: boolean;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  systemPrompt?: string;
  onSystemPromptChange?: (prompt: string) => void;
}

export const ChatHeader = ({ 
  showModelSelector = false,
  selectedModel = "ChatGPT 4.1",
  onModelChange,
  systemPrompt = "Você é um assistente útil e prestativo.",
  onSystemPromptChange
}: ChatHeaderProps) => {
  const [isPersonalityOpen, setIsPersonalityOpen] = useState(false);
  const [tempSystemPrompt, setTempSystemPrompt] = useState(systemPrompt);
  
  const models = [
    "ChatGPT 4.1",
    "ChatGPT 5",
    "Claude Sonnet 4.5",
    "Claude Opus 4.1",
  ];

  const handleSavePersonality = () => {
    if (onSystemPromptChange) {
      onSystemPromptChange(tempSystemPrompt);
    }
    setIsPersonalityOpen(false);
  };

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

        {showModelSelector && onSystemPromptChange && (
          <Dialog open={isPersonalityOpen} onOpenChange={setIsPersonalityOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 glass-effect"
                onClick={() => setTempSystemPrompt(systemPrompt)}
              >
                <UserCog className="w-4 h-4" />
                <span className="font-medium">Personalidade</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Personalidade da IA</DialogTitle>
                <DialogDescription>
                  Defina o estilo, tom ou função da IA nesta conversa
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={tempSystemPrompt}
                onChange={(e) => setTempSystemPrompt(e.target.value)}
                placeholder="Ex: Você é um assistente técnico especializado em programação..."
                className="min-h-[150px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsPersonalityOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSavePersonality}>
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {showModelSelector ? "Modelo de linguagem avançado" : "Sistema HGTX Codex"}
      </div>
    </header>
  );
};
