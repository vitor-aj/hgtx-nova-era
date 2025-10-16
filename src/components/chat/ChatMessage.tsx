import { Bot, User, Copy, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  model?: string;
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
  }>;
}

export const ChatMessage = ({ role, content, model, attachments }: ChatMessageProps) => {
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
      className={`flex gap-4 py-6 px-6 group hover:bg-muted/10 transition-colors ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isAssistant && (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary to-secondary">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          
          {model && (
            <Badge 
              variant="secondary" 
              className="text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/30"
            >
              {model}
            </Badge>
          )}
        </div>
      )}

      <div className={`flex-1 max-w-3xl space-y-2 ${isAssistant ? "" : "flex flex-col items-end"}`}>
        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm"
              >
                <File className="w-4 h-4 text-primary" />
                <span className="font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          className={`inline-block px-4 py-3 rounded-xl ${
            isAssistant
              ? "bg-card border border-border"
              : "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
          }`}
        >
          <p className={`leading-relaxed ${isAssistant ? "text-foreground" : "text-white"}`}>
            {content}
          </p>
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

      {!isAssistant && (
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent/20 border border-accent">
          <User className="w-5 h-5 text-accent" />
        </div>
      )}
    </div>
  );
};
