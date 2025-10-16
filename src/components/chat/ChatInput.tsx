import { Send, Paperclip, X, GripHorizontal, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

export const ChatInput = ({ onSendMessage, systemPrompt, onSystemPromptChange }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [textareaHeight, setTextareaHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [isPersonalityOpen, setIsPersonalityOpen] = useState(false);
  const [tempSystemPrompt, setTempSystemPrompt] = useState(systemPrompt);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragStartY = useRef<number>(0);
  const dragStartHeight = useRef<number>(0);
  const { toast } = useToast();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = textareaHeight;
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaY = dragStartY.current - e.clientY; // Inverted: moving up = positive
      const newHeight = Math.min(400, Math.max(60, dragStartHeight.current + deltaY));
      setTextareaHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, textareaHeight]);

  const handleSend = () => {
    if (message.trim() || attachedFiles.length > 0) {
      onSendMessage(message, attachedFiles);
      setMessage("");
      setAttachedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file size (max 10MB per file)
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 10MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setAttachedFiles([...attachedFiles, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSavePersonality = () => {
    onSystemPromptChange(tempSystemPrompt);
    setIsPersonalityOpen(false);
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-sm"
              >
                <Paperclip className="w-3 h-3 text-primary" />
                <span className="font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Message Input and Buttons */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 glass-effect rounded-xl overflow-hidden">
            {/* Resize Handle */}
            <div
              onMouseDown={handleMouseDown}
              className={`w-full h-6 flex items-center justify-center cursor-ns-resize hover:bg-primary/10 transition-colors ${
                isDragging ? 'bg-primary/20' : ''
              }`}
              title="Arraste para cima para aumentar"
            >
              <GripHorizontal className="w-5 h-5 text-muted-foreground" />
            </div>
            
            {/* Textarea */}
            <div className="px-3 pb-3">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                style={{ height: `${textareaHeight}px` }}
                className="resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full p-0 overflow-y-auto"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.txt,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.gif,.webp"
            />
            <Dialog open={isPersonalityOpen} onOpenChange={setIsPersonalityOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 glass-effect"
                  onClick={() => setTempSystemPrompt(systemPrompt)}
                  title="Personalidade"
                >
                  <UserCog className="w-5 h-5" />
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
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 glass-effect"
              onClick={() => fileInputRef.current?.click()}
              title="Anexar arquivo"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleSend}
              size="icon"
              className="h-11 w-11 cyber-glow"
              disabled={!message.trim() && attachedFiles.length === 0}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Pressione Enter para enviar, Shift + Enter para nova linha • Máx. 10MB por arquivo
        </p>
      </div>
    </div>
  );
};
