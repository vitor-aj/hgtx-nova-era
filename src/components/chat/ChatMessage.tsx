import { Bot, User, Copy, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const [showActions, setShowActions] = useState(false);
  const isAssistant = role === "assistant";

  return (
    <div
      className={`flex gap-4 py-6 px-6 group ${
        isAssistant ? "bg-muted/30" : ""
      } hover:bg-muted/20 transition-colors`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
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

      <div className="flex-1 space-y-2">
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground leading-relaxed">{content}</p>
        </div>

        {showActions && (
          <div className="flex gap-1 animate-fade-in">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copiar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Excluir
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
