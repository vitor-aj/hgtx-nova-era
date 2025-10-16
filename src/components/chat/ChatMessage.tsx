import { Bot, User, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  model?: string;
}

export const ChatMessage = ({ role, content, model }: ChatMessageProps) => {
  const [showActions, setShowActions] = useState(false);
  const { toast } = useToast();
  const isAssistant = role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Mensagem copiada para a área de transferência",
    });
  };

  return (
    <div
      className={`flex gap-4 py-6 px-6 group ${
        isAssistant ? "bg-muted/30" : ""
      } hover:bg-muted/20 transition-colors`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isAssistant
              ? "bg-gradient-to-br from-primary to-secondary"
              : "bg-accent/20 border border-accent"
          }`}
        >
          {isAssistant ? (
            <Bot className="w-5 h-5 text-primary-foreground" />
          ) : (
            <User className="w-5 h-5 text-accent" />
          )}
        </div>
        
        {isAssistant && model && (
          <Badge 
            variant="secondary" 
            className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/30"
          >
            {model}
          </Badge>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground leading-relaxed">{content}</p>
        </div>

        {showActions && (
          <div className="flex gap-1 animate-fade-in">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copiar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
