import { useState, useEffect } from "react";
import axios from "axios";
import { Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { LegalOpinion } from "./AgentView";

interface OpinionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOpinion: LegalOpinion | null;
  onOpinionCreated: (opinion: LegalOpinion) => void;
}

export const OpinionDialog = ({
  open,
  onOpenChange,
  selectedOpinion,
  onOpinionCreated,
}: OpinionDialogProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [instructions, setInstructions] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedOpinion) {
      setTitle(selectedOpinion.title);
      setCategory(selectedOpinion.category || "");
      setGeneratedContent(selectedOpinion.content);
      setInstructions("");
    } else {
      setTitle("");
      setCategory("");
      setInstructions("");
      setGeneratedContent("");
    }
  }, [selectedOpinion]);

  const handleGenerate = async () => {
    if (!instructions.trim()) {
      toast({
        title: "Instruções necessárias",
        description: "Por favor, forneça instruções para gerar o parecer.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Título necessário",
        description: "Por favor, forneça um título para o parecer.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await axios.post(
        "https://prod-hgtx-intelligence-n8n.hgtx.com.br/webhook/codex/gepam/parecer-tecnico",
        {
          titulo: title,
          categoria: category,
          instrucoes: instructions,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const content = response.data.parecer || response.data.content || JSON.stringify(response.data, null, 2);

      setGeneratedContent(content);
      setIsGenerating(false);

      const newOpinion: LegalOpinion = {
        id: selectedOpinion?.id || Date.now().toString(),
        title: title,
        content: content,
        createdAt: new Date(),
        category: category || undefined,
      };
      
      onOpinionCreated(newOpinion);

      toast({
        title: "Parecer gerado com sucesso!",
        description: "O parecer está pronto para download.",
      });
    } catch (error) {
      console.error("Erro ao gerar parecer:", error);
      setIsGenerating(false);
      
      let errorMessage = "Não foi possível gerar o parecer. Tente novamente.";
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.message || `Erro do servidor: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = "Sem resposta do servidor. Verifique sua conexão.";
        }
      }
      
      toast({
        title: "Erro ao gerar parecer",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocx = () => {
    const content = generatedContent;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "parecer"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado",
      description: "O parecer está sendo baixado.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {selectedOpinion ? "Gerar Novo Modelo do Parecer" : "Novo Parecer Jurídico"}
          </DialogTitle>
          <DialogDescription>
            {selectedOpinion
              ? "Forneça instruções para gerar um novo modelo baseado neste parecer"
              : "Preencha os dados e instruções para gerar um novo parecer com IA"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Parecer *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Análise sobre Contrato de Prestação de Serviços"
                disabled={!!selectedOpinion}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Direito Civil, Trabalhista, etc."
                disabled={!!selectedOpinion}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">
                Instruções para gerar o parecer *
              </Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Descreva os detalhes, contexto e aspectos legais que devem ser considerados no parecer..."
                className="min-h-[150px]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>Gerando parecer...</>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Gerar Parecer com IA
                </>
              )}
            </Button>

            {generatedContent && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label>Parecer Gerado</Label>
                  <Button
                    onClick={handleDownloadDocx}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Baixar DOCX
                  </Button>
                </div>
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {generatedContent}
                  </pre>
                </ScrollArea>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
