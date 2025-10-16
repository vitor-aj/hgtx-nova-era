import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Copy, Trash2, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ImageView = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate image generation
    setTimeout(() => {
      setImages((prev) => [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&h=512&fit=crop",
        ...prev,
      ]);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Generation Form */}
          <div className="glass-effect rounded-xl p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Descreva a imagem
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva a imagem que deseja criar..."
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Tamanho
                </label>
                <Select defaultValue="1024x1024">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="512x512">512x512</SelectItem>
                    <SelectItem value="1024x1024">1024x1024</SelectItem>
                    <SelectItem value="1792x1024">1792x1024 (Wide)</SelectItem>
                    <SelectItem value="1024x1792">1024x1792 (Tall)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="gap-2 cyber-glow"
                size="lg"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? "Gerando..." : "Gerar Imagem"}
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="glass-effect rounded-xl p-12 flex flex-col items-center justify-center space-y-4 animate-fade-in">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
                </div>
              </div>
              <p className="text-lg font-medium gradient-text">
                Gerando sua imagem...
              </p>
              <p className="text-sm text-muted-foreground">
                Isso pode levar alguns segundos
              </p>
            </div>
          )}

          {/* Generated Images Grid */}
          {images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Imagens Geradas</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="group relative glass-effect rounded-xl overflow-hidden aspect-square animate-fade-in"
                  >
                    <img
                      src={image}
                      alt={`Generated ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="flex-1 gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Baixar
                        </Button>
                        <Button size="sm" variant="secondary" className="gap-1">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
