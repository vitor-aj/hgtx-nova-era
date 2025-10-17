import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Mic, Play, Download, Trash2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface GeneratedAudio {
  id: string;
  text: string;
  voice: string;
  voiceLabel: string;
  audioUrl: string;
  timestamp: Date;
}

const VOICE_OPTIONS = {
  alloy: {
    label: "Alloy",
    gender: "Masculina",
    style: "Neutra, equilibrada, tom corporativo",
    description: "Boa para tutoriais e comunicações institucionais."
  },
  echo: {
    label: "Echo",
    gender: "Masculina",
    style: "Forte e profissional, mais grave",
    description: "Ideal para voz de autoridade ou locução firme."
  },
  fable: {
    label: "Fable",
    gender: "Feminina",
    style: "Narrativa, calorosa e envolvente",
    description: "Ótima para storytelling e áudios empáticos."
  },
  onyx: {
    label: "Onyx",
    gender: "Masculina",
    style: "Grave, autoritária, impactante",
    description: "Excelente para trailers, mensagens sérias ou institucionais."
  },
  nova: {
    label: "Nova",
    gender: "Feminina",
    style: "Brilhante, animada, energética",
    description: "Boa para vídeos curtos, marketing ou conteúdos leves."
  },
  shimmer: {
    label: "Shimmer",
    gender: "Feminina",
    style: "Suave, otimista, clara",
    description: "Boa para mensagens acolhedoras, explicações e IA conversacional."
  }
};

export const GenerationView = () => {
  const [textToSpeech, setTextToSpeech] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<keyof typeof VOICE_OPTIONS>("alloy");
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(null);
  const [audioHistory, setAudioHistory] = useState<GeneratedAudio[]>([]);
  const [audioSearchQuery, setAudioSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedAudios = localStorage.getItem('audioHistory');
    if (savedAudios) {
      setAudioHistory(JSON.parse(savedAudios));
    }
  }, []);

  const handleGenerateAudio = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      const audio: GeneratedAudio = {
        id: Date.now().toString(),
        text: textToSpeech,
        voice: selectedVoice,
        voiceLabel: VOICE_OPTIONS[selectedVoice].label,
        audioUrl: "data:audio/mp3;base64,//sample",
        timestamp: new Date(),
      };
      
      setGeneratedAudio(audio);
      
      const newHistory = [audio, ...audioHistory].slice(0, 10);
      setAudioHistory(newHistory);
      localStorage.setItem('audioHistory', JSON.stringify(newHistory));
      
      setIsProcessing(false);
      
      toast({
        title: "Áudio gerado com sucesso",
        description: `Voz: ${VOICE_OPTIONS[selectedVoice].label}`,
      });
    }, 2000);
  };

  const handleDownloadAudio = (audio: GeneratedAudio) => {
    const a = document.createElement('a');
    a.href = audio.audioUrl;
    a.download = `audio_${audio.voiceLabel}_${new Date(audio.timestamp).getTime()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download iniciado",
      description: "O arquivo de áudio está sendo baixado.",
    });
  };

  const handleDeleteAudio = (audioId: string) => {
    if (generatedAudio?.id === audioId) {
      setGeneratedAudio(null);
    }
    const newHistory = audioHistory.filter(a => a.id !== audioId);
    setAudioHistory(newHistory);
    localStorage.setItem('audioHistory', JSON.stringify(newHistory));
    
    toast({
      title: "Áudio removido",
      description: "O áudio foi removido do histórico.",
    });
  };

  const filteredAudios = audioHistory.filter(item =>
    item.voiceLabel.toLowerCase().includes(audioSearchQuery.toLowerCase()) ||
    item.text.toLowerCase().includes(audioSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full pb-16 md:pb-0">
      <ChatHeader />

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-3 md:p-6">
          <Tabs defaultValue="generation" className="space-y-4 md:space-y-6">
            <TabsList className="grid w-full grid-cols-2 glass-effect text-xs md:text-sm">
              <TabsTrigger value="generation" className="text-xs md:text-sm">
                Geração
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs md:text-sm">
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generation" className="space-y-6">
              <div className="glass-effect rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  Converter Texto em Voz
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Digite o texto para converter
                  </label>
                  <Textarea
                    value={textToSpeech}
                    onChange={(e) => setTextToSpeech(e.target.value)}
                    placeholder="Digite o texto que deseja converter em fala..."
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Voz</label>
                    <Select value={selectedVoice} onValueChange={(value) => setSelectedVoice(value as keyof typeof VOICE_OPTIONS)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(VOICE_OPTIONS).map(([key, voice]) => (
                          <SelectItem key={key} value={key}>
                            {voice.label} - {voice.gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{VOICE_OPTIONS[selectedVoice].label}</p>
                      <span className="text-xs text-muted-foreground">Modelo: OpenAI TTS-1</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong>Estilo:</strong> {VOICE_OPTIONS[selectedVoice].style}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {VOICE_OPTIONS[selectedVoice].description}
                    </p>
                  </div>

                  <Button
                    onClick={handleGenerateAudio}
                    disabled={!textToSpeech.trim() || isProcessing}
                    className="gap-2 cyber-glow w-full"
                    size="lg"
                  >
                    <Mic className="w-4 h-4" />
                    {isProcessing ? "Gerando..." : "Gerar Áudio"}
                  </Button>
                </div>

                {isProcessing && (
                  <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-medium">
                      Gerando áudio...
                    </p>
                  </div>
                )}
              </div>

              {generatedAudio && (
                <div className="glass-effect rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Áudio Gerado</h4>
                      <p className="text-sm text-muted-foreground">
                        Voz: {generatedAudio.voiceLabel}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1"
                        onClick={() => handleDownloadAudio(generatedAudio)}
                      >
                        <Download className="w-3 h-3" />
                        Baixar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="gap-1"
                        onClick={() => handleDeleteAudio(generatedAudio.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                        Excluir
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm mb-3">{generatedAudio.text}</p>
                    <audio controls className="w-full">
                      <source src={generatedAudio.audioUrl} type="audio/mpeg" />
                      Seu navegador não suporta o elemento de áudio.
                    </audio>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="glass-effect rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Histórico de Áudios</h3>
                  <p className="text-sm text-muted-foreground">
                    {audioHistory.length} {audioHistory.length === 1 ? 'item' : 'itens'}
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={audioSearchQuery}
                    onChange={(e) => setAudioSearchQuery(e.target.value)}
                    placeholder="Buscar por voz ou conteúdo..."
                    className="pl-9"
                  />
                </div>

                {filteredAudios.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{audioSearchQuery ? 'Nenhum áudio encontrado' : 'Nenhum áudio no histórico'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAudios.map((audio) => (
                      <div key={audio.id} className="bg-muted/30 rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">Voz: {audio.voiceLabel}</h4>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(audio.timestamp).toLocaleDateString('pt-BR')} às{' '}
                              {new Date(audio.timestamp).toLocaleTimeString('pt-BR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadAudio(audio)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAudio(audio.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {audio.text}
                        </p>
                        <audio controls className="w-full">
                          <source src={audio.audioUrl} type="audio/mpeg" />
                        </audio>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};