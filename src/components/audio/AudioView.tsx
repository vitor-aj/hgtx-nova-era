import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Mic, Play, Download, Trash2, FileAudio } from "lucide-react";
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

export const AudioView = () => {
  const [textToSpeech, setTextToSpeech] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleGenerateAudio = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
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
      setIsTranscribing(false);
      
      toast({
        title: "Transcrição concluída",
        description: "Seu áudio foi transcrito com sucesso!",
      });
    }, 2000);
  };

  const handleDeleteTranscription = () => {
    setTranscriptionResult(null);
    setSelectedFile(null);
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
            <TabsList className="grid w-full grid-cols-2 glass-effect">
              <TabsTrigger value="transcription">
                Transcrição de Áudio
              </TabsTrigger>
              <TabsTrigger value="generation">Geração de Voz</TabsTrigger>
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

                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">Tipo de Voz</label>
                    <Select defaultValue="neutral">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neutral">Neutra</SelectItem>
                        <SelectItem value="masculine">Masculina</SelectItem>
                        <SelectItem value="feminine">Feminina</SelectItem>
                        <SelectItem value="child">Infantil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGenerateAudio}
                    disabled={!textToSpeech.trim() || isProcessing}
                    className="gap-2 cyber-glow"
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

              {/* Sample Generated Audio */}
              <div className="glass-effect rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Áudio Gerado</h4>
                    <p className="text-xs text-muted-foreground">
                      Há 2 minutos · Voz Neutra
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="w-3 h-3" />
                      Baixar
                    </Button>
                    <Button size="sm" variant="destructive" className="gap-1">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 flex items-center gap-4">
                  <Button size="icon" variant="outline" className="rounded-full">
                    <Play className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary rounded-full" />
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    0:12 / 0:35
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* History Section */}
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Histórico Recente</h3>
            <div className="grid gap-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="glass-effect rounded-lg p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">audio_file_{i}.mp3</p>
                      <p className="text-xs text-muted-foreground">
                        Processado há {i} hora{i > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
