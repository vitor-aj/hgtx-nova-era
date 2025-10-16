import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Trash2, Sparkles, Clock, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  size: string;
  timestamp: string;
}

export const ImageView = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSize, setSelectedSize] = useState("1024x1024");
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&h=512&fit=crop",
      prompt: "Paisagem futurista com cidades voadoras",
      size: "1024x1024",
      timestamp: "Há 2 horas",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=512&h=512&fit=crop",
      prompt: "Robô humanoide em estilo cyberpunk",
      size: "1024x1536",
      timestamp: "Há 5 horas",
    },
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate image generation
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&h=512&fit=crop",
        prompt: prompt,
        size: selectedSize,
        timestamp: "Agora",
      };
      setImages([newImage, ...images]);
      setIsGenerating(false);
      setPrompt("");
    }, 3000);
  };

  const handleDelete = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const filteredImages = images.filter((img) =>
    img.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-5xl mx-auto p-6">
            <Tabs defaultValue="generate" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 glass-effect">
                <TabsTrigger value="generate">Gerar Imagem</TabsTrigger>
                <TabsTrigger value="history">
                  <Clock className="w-4 h-4 mr-2" />
                  Histórico
                </TabsTrigger>
              </TabsList>

              {/* Generate Tab */}
              <TabsContent value="generate" className="space-y-6">
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
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-effect bg-popover border-border z-50">
                          <SelectItem value="1024x1024">1024x1024 (Quadrado)</SelectItem>
                          <SelectItem value="1024x1536">1024x1536 (Retrato)</SelectItem>
                          <SelectItem value="1536x1024">1536x1024 (Paisagem)</SelectItem>
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

                {/* Recent Images Preview */}
                {!isGenerating && images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Última Geração</h3>
                    <ImageCard 
                      image={images[0]} 
                      onDelete={handleDelete}
                    />
                  </div>
                )}
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por descrição..."
                    className="pl-9"
                  />
                </div>

                {/* Images Grid */}
                {filteredImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredImages.map((image) => (
                      <ImageCard 
                        key={image.id} 
                        image={image}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="glass-effect rounded-xl p-12 text-center">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchQuery ? "Nenhuma imagem encontrada" : "Nenhuma imagem gerada ainda"}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

interface ImageCardProps {
  image: GeneratedImage;
  onDelete: (id: string) => void;
}

const ImageCard = ({ image, onDelete }: ImageCardProps) => {
  return (
    <div className="group glass-effect rounded-xl overflow-hidden animate-fade-in">
      <div className="relative aspect-square">
        <img
          src={image.url}
          alt={image.prompt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <p className="text-sm text-white line-clamp-2">{image.prompt}</p>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>{image.size}</span>
              <span>{image.timestamp}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 gap-1"
              >
                <Download className="w-3 h-3" />
                Baixar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="gap-1"
                onClick={() => onDelete(image.id)}
              >
                <Trash2 className="w-3 h-3" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
