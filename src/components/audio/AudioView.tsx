import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, Mic, Play, Download, Trash2, FileAudio, Copy, Search } from "lucide-react";
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

const SUPPORTED_FORMATS = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

interface TranscriptionResult {
  id: string;
  fileName: string;
  text: string;
  timestamp: Date;
}

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

export const AudioView = () => {
  const [textToSpeech, setTextToSpeech] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<keyof typeof VOICE_OPTIONS>("alloy");
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(null);
  const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionResult[]>([]);
  const [audioHistory, setAudioHistory] = useState<GeneratedAudio[]>([]);
  const [transcriptionSearchQuery, setTranscriptionSearchQuery] = useState("");
  const [audioSearchQuery, setAudioSearchQuery] = useState("");
  const { toast } = useToast();

  // Load history from localStorage
  useEffect(() => {
    const savedTranscriptions = localStorage.getItem('transcriptionHistory');
    const savedAudios = localStorage.getItem('audioHistory');
    if (savedTranscriptions) {
      setTranscriptionHistory(JSON.parse(savedTranscriptions));
    }
    if (savedAudios) {
      setAudioHistory(JSON.parse(savedAudios));
    }
  }, []);

  const handleGenerateAudio = () => {
    setIsProcessing(true);
    
    // Simulate audio generation - replace with actual API call
    setTimeout(() => {
      const audio: GeneratedAudio = {
        id: Date.now().toString(),
        text: textToSpeech,
        voice: selectedVoice,
        voiceLabel: VOICE_OPTIONS[selectedVoice].label,
        audioUrl: "data:audio/mp3;base64,//sample", // Placeholder
        timestamp: new Date(),
      };
      
      setGeneratedAudio(audio);
      
      // Add to history
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 25 MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file format
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
      toast({
        title: "Formato não suportado",
        description: `Formatos suportados: ${SUPPORTED_FORMATS.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    handleTranscription(file);
  };

  const handleTranscription = async (file: File) => {
    setIsTranscribing(true);
    
    // Simulate transcription - replace with actual API call
    setTimeout(() => {
      const result: TranscriptionResult = {
        id: Date.now().toString(),
        fileName: file.name,
        text: "Esta é uma transcrição de exemplo do áudio enviado. O sistema utilizará modelos de IA avançados para converter sua fala em texto com alta precisão. O áudio foi processado com sucesso e convertido para texto.",
        timestamp: new Date(),
      };
      
      setTranscriptionResult(result);
      
      // Add to history
      const newHistory = [result, ...transcriptionHistory].slice(0, 10);
      setTranscriptionHistory(newHistory);
      localStorage.setItem('transcriptionHistory', JSON.stringify(newHistory));
      
      setIsTranscribing(false);
      
      toast({
        title: "Transcrição concluída",
        description: "Seu áudio foi transcrito com sucesso!",
      });
    }, 2000);
  };

  const handleDownloadAudio = (audio: GeneratedAudio) => {
    // In real implementation, download the actual audio file
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

  const handleDeleteTranscription = () => {
    setTranscriptionResult(null);
    setSelectedFile(null);
  };

  const handleDeleteTranscriptionFromHistory = (transcriptionId: string) => {
    if (transcriptionResult?.id === transcriptionId) {
      setTranscriptionResult(null);
    }
    const newHistory = transcriptionHistory.filter(t => t.id !== transcriptionId);
    setTranscriptionHistory(newHistory);
    localStorage.setItem('transcriptionHistory', JSON.stringify(newHistory));
    
    toast({
      title: "Transcrição removida",
      description: "A transcrição foi removida do histórico.",
    });
  };

  const handleCopyTranscription = () => {
    if (transcriptionResult) {
      navigator.clipboard.writeText(transcriptionResult.text);
      toast({
        title: "Texto copiado",
        description: "A transcrição foi copiada para a área de transferência",
      });
    }
  };

  // Filter functions
  const filteredTranscriptions = transcriptionHistory.filter(item => 
    item.fileName.toLowerCase().includes(transcriptionSearchQuery.toLowerCase()) ||
    item.text.toLowerCase().includes(transcriptionSearchQuery.toLowerCase())
  );

  const filteredAudios = audioHistory.filter(item =>
    item.voiceLabel.toLowerCase().includes(audioSearchQuery.toLowerCase()) ||
    item.text.toLowerCase().includes(audioSearchQuery.toLowerCase())
  );

  const handleDownloadTranscription = () => {
    if (transcriptionResult) {
      const blob = new Blob([transcriptionResult.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcricao_${transcriptionResult.fileName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <Tabs defaultValue="transcription" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 glass-effect">
              <TabsTrigger value="transcription">
                Transcrição
              </TabsTrigger>
              <TabsTrigger value="generation">Geração de Voz</TabsTrigger>
              <TabsTrigger value="transcription-history">
                Histórico Transcrições
              </TabsTrigger>
              <TabsTrigger value="audio-history">
                Histórico Áudios
              </TabsTrigger>
            </TabsList>

            {/* Transcription Tab */}
            <TabsContent value="transcription" className="space-y-6">
              <div className="glass-effect rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  Converter Áudio em Texto
                </h3>
                <p className="text-sm text-muted-foreground">
                  Envie um arquivo de áudio para transcrição (máx. 25MB)
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos: {SUPPORTED_FORMATS.join(', ')}
                </p>

                <input
                  type="file"
                  id="audio-upload"
                  className="hidden"
                  accept={SUPPORTED_FORMATS.map(f => `.${f}`).join(',')}
                  onChange={handleFileSelect}
                />

                <label
                  htmlFor="audio-upload"
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer block"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    {selectedFile ? (
                      <FileAudio className="w-8 h-8 text-primary" />
                    ) : (
                      <Upload className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {selectedFile ? selectedFile.name : "Clique para selecionar ou arraste o arquivo"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedFile 
                        ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                        : "Máximo 25 MB"
                      }
                    </p>
                  </div>
                  {!selectedFile && (
                    <Button variant="outline" className="gap-2" type="button">
                      <Upload className="w-4 h-4" />
                      Selecionar Arquivo
                    </Button>
                  )}
                </label>

                {isTranscribing && (
                  <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-medium">
                      Transcrevendo áudio...
                    </p>
                  </div>
                )}
              </div>

              {/* Transcription Result */}
              {transcriptionResult && (
                <div className="glass-effect rounded-xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{transcriptionResult.fileName}</h4>
                      <p className="text-xs text-muted-foreground">
                        Transcrito {new Date(transcriptionResult.timestamp).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1"
                        onClick={handleCopyTranscription}
                      >
                        <Copy className="w-3 h-3" />
                        Copiar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1"
                        onClick={handleDownloadTranscription}
                      >
                        <Download className="w-3 h-3" />
                        Baixar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="gap-1"
                        onClick={handleDeleteTranscription}
                      >
                        <Trash2 className="w-3 h-3" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {transcriptionResult.text}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Generation Tab */}
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

                  {/* Voice Details */}
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
                      Processando áudio...
                    </p>
                  </div>
                )}
              </div>

              {/* Generated Audio Result */}
              {generatedAudio && (
                <div className="glass-effect rounded-xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Áudio Gerado - {generatedAudio.voiceLabel}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(generatedAudio.timestamp).toLocaleString('pt-BR')}
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
                        Baixar MP3
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
                    <p className="text-sm leading-relaxed line-clamp-3">
                      {generatedAudio.text}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 flex items-center gap-4">
                    <Button size="icon" variant="outline" className="rounded-full">
                      <Play className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-primary rounded-full" />
                    </div>
                    <span className="text-sm text-muted-foreground tabular-nums">
                      0:00
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Transcription History Tab */}
            <TabsContent value="transcription-history" className="space-y-6">
              <div className="glass-effect rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Histórico de Transcrições</h3>
                  <p className="text-sm text-muted-foreground">
                    {transcriptionHistory.length} {transcriptionHistory.length === 1 ? 'transcrição' : 'transcrições'}
                  </p>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por nome ou conteúdo..."
                    value={transcriptionSearchQuery}
                    onChange={(e) => setTranscriptionSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {filteredTranscriptions.length > 0 ? (
                <div className="grid gap-3">
                  {filteredTranscriptions.map((item) => (
                    <div
                      key={item.id}
                      className="glass-effect rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileAudio className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{item.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(item.text);
                              toast({ title: "Texto copiado" });
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              const blob = new Blob([item.text], { type: 'text/plain' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `transcricao_${item.fileName}.txt`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteTranscriptionFromHistory(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-sm leading-relaxed line-clamp-3">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-effect rounded-xl p-12 text-center">
                  <FileAudio className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {transcriptionSearchQuery 
                      ? "Nenhuma transcrição encontrada com este termo"
                      : "Nenhuma transcrição no histórico"}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Audio History Tab */}
            <TabsContent value="audio-history" className="space-y-6">
              <div className="glass-effect rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Histórico de Áudios Gerados</h3>
                  <p className="text-sm text-muted-foreground">
                    {audioHistory.length} {audioHistory.length === 1 ? 'áudio' : 'áudios'}
                  </p>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por voz ou conteúdo..."
                    value={audioSearchQuery}
                    onChange={(e) => setAudioSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {filteredAudios.length > 0 ? (
                <div className="grid gap-3">
                  {filteredAudios.map((item) => (
                    <div
                      key={item.id}
                      className="glass-effect rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Mic className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm">{item.voiceLabel}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadAudio(item)}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteAudio(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-sm leading-relaxed line-clamp-2">
                          {item.text}
                        </p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
                        <Button size="icon" variant="outline" className="rounded-full h-8 w-8">
                          <Play className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-0 bg-primary rounded-full" />
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          0:00
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-effect rounded-xl p-12 text-center">
                  <Mic className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {audioSearchQuery 
                      ? "Nenhum áudio encontrado com este termo"
                      : "Nenhum áudio no histórico"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};
