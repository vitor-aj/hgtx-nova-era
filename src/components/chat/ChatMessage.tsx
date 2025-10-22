import { Bot, User, Copy, File, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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

const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-lg border border-border">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyCode}
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copiar
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: "0 0 0.5rem 0.5rem",
          border: "1px solid hsl(var(--border))",
          borderTop: "none",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

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
      className={`flex gap-2 md:gap-4 py-4 md:py-6 px-3 md:px-6 group hover:bg-muted/10 transition-colors ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isAssistant && (
        <div className="flex flex-col items-center gap-1 md:gap-2">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary to-secondary">
            <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
          </div>
          
          {model && (
            <Badge 
              variant="secondary" 
              className="hidden md:block text-xs px-2 py-0.5 bg-primary/10 text-primary border border-primary/30"
            >
              {model}
            </Badge>
          )}
        </div>
      )}

      <div className={`flex-1 max-w-3xl space-y-1 md:space-y-2 ${isAssistant ? "" : "flex flex-col items-end"}`}>
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
          className={`inline-block px-3 md:px-4 py-2 md:py-3 rounded-xl ${
            isAssistant
              ? "bg-card border border-border"
              : "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
          }`}
        >
          {isAssistant ? (
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const value = String(children).replace(/\n$/, "");
                    const isInline = !className;
                    
                    return !isInline && match ? (
                      <CodeBlock language={match[1]} value={value} />
                    ) : (
                      <code
                        className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>;
                  },
                  li({ children }) {
                    return <li className="leading-relaxed">{children}</li>;
                  },
                  h1({ children }) {
                    return <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>;
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
                        {children}
                      </blockquote>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm md:text-base leading-relaxed text-white">
              {content}
            </p>
          )}
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
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent/20 border border-accent">
          <User className="w-4 h-4 md:w-5 md:h-5 text-accent" />
        </div>
      )}
    </div>
  );
};
