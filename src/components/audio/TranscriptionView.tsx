import { useState, useEffect } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Trash2, FileAudio, Copy, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const SUPPORTED_FORMATS = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

interface TranscriptionResult {
  id: string;
  fileName: string;
  text: string;
  timestamp: Date;
}

export const TranscriptionView = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionResult[]>([]);
  const [transcriptionSearchQuery, setTranscriptionSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedTranscriptions = localStorage.getItem('transcriptionHistory');
    if (savedTranscriptions) {
      setTranscriptionHistory(JSON.parse(savedTranscriptions));
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 25 MB",
        variant: "destructive",
      });
      return;
    }

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
    
    setTimeout(() => {
      const result: TranscriptionResult = {
        id: Date.now().toString(),
        fileName: file.name,
        text: "Esta é uma transcrição de exemplo do áudio enviado. O sistema utilizará modelos de IA avançados para converter sua fala em texto com alta precisão. O áudio foi processado com sucesso e convertido para texto.",
        timestamp: new Date(),
      };
      
      setTranscriptionResult(result);
      
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

  const filteredTranscriptions = transcriptionHistory.filter(item => 
    item.fileName.toLowerCase().includes(transcriptionSearchQuery.toLowerCase()) ||
    item.text.toLowerCase().includes(transcriptionSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full pb-16 md:pb-0">
      <ChatHeader />

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-3 md:p-6">
          <Tabs defaultValue="transcription" className="space-y-4 md:space-y-6">
            <TabsList className="grid w-full grid-cols-2 glass-effect text-xs md:text-sm">
              <TabsTrigger value="transcription" className="text-xs md:text-sm">
                Transcrição
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs md:text-sm">
                Histórico
              </TabsTrigger>
            </TabsList>

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

            <TabsContent value="history" className="space-y-6">
              <div className="glass-effect rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Histórico de Transcrições</h3>
                  <p className="text-sm text-muted-foreground">
                    {transcriptionHistory.length} {transcriptionHistory.length === 1 ? 'item' : 'itens'}
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={transcriptionSearchQuery}
                    onChange={(e) => setTranscriptionSearchQuery(e.target.value)}
                    placeholder="Buscar por nome ou conteúdo..."
                    className="pl-9"
                  />
                </div>

                {filteredTranscriptions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileAudio className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{transcriptionSearchQuery ? 'Nenhuma transcrição encontrada' : 'Nenhuma transcrição no histórico'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTranscriptions.map((item) => (
                      <div key={item.id} className="bg-muted/30 rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{item.fileName}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleDateString('pt-BR')} às{' '}
                              {new Date(item.timestamp).toLocaleTimeString('pt-BR')}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTranscriptionFromHistory(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.text}
                        </p>
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