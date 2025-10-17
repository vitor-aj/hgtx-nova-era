import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Download, Send, Sparkles } from "lucide-react";
import { LegalOpinion } from "./AgentView";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface AgentChatProps {
  selectedOpinion: LegalOpinion | null;
  isCreatingNew: boolean;
  onOpinionCreated: (opinion: LegalOpinion) => void;
}

export const AgentChat = ({
  selectedOpinion,
  isCreatingNew,
  onOpinionCreated,
}: AgentChatProps) => {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!instructions.trim()) {
      toast({
        title: "Instruções necessárias",
        description: "Por favor, forneça instruções para gerar o parecer.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulação de chamada à IA - aqui você integraria com a API real
    setTimeout(() => {
      const mockContent = `PARECER JURÍDICO

TÍTULO: ${title || "Parecer Jurídico"}

${instructions}

ANÁLISE:

Este parecer foi gerado com base nas instruções fornecidas. A análise considera os seguintes aspectos legais:

1. Fundamentação Legal
2. Precedentes Judiciais
3. Doutrina Aplicável
4. Conclusão e Recomendações

CONCLUSÃO:

Com base na análise realizada, conclui-se que...

___________________________
Parecer gerado em ${new Date().toLocaleDateString('pt-BR')}`;

      setGeneratedContent(mockContent);
      setIsGenerating(false);

      if (isCreatingNew) {
        const newOpinion: LegalOpinion = {
          id: Date.now().toString(),
          title: title || "Novo Parecer",
          content: mockContent,
          createdAt: new Date(),
          category: category || undefined,
        };
        onOpinionCreated(newOpinion);
      }

      toast({
        title: "Parecer gerado com sucesso!",
        description: "O parecer está pronto para download.",
      });
    }, 2000);
  };

  const handleDownloadDocx = () => {
    // Aqui você implementaria a geração real do DOCX
    // Por enquanto, vamos criar um arquivo de texto
    const content = generatedContent || selectedOpinion?.content || "";
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || selectedOpinion?.title || 'parecer'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado",
      description: "O parecer está sendo baixado.",
    });
  };

  const displayContent = generatedContent || selectedOpinion?.content;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">
          {selectedOpinion ? selectedOpinion.title : "Novo Parecer Jurídico"}
        </h2>
        {selectedOpinion && (
          <p className="text-sm text-muted-foreground mt-1">
            Criado em {new Date(selectedOpinion.createdAt).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6 space-y-4">
          {(isCreatingNew || !selectedOpinion) && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Título do Parecer</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Análise sobre Contrato de Prestação de Serviços"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Categoria</label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Direito Civil, Trabalhista, etc."
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {selectedOpinion ? "Instruções para novo modelo" : "Instruções para gerar o parecer"}
            </label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Descreva os detalhes, contexto e aspectos legais que devem ser considerados no parecer..."
              className="min-h-[120px]"
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
                {selectedOpinion ? "Gerar Novo Modelo com IA" : "Gerar Parecer com IA"}
              </>
            )}
          </Button>

          {displayContent && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Parecer Gerado</label>
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
              <ScrollArea className="h-[300px] rounded-md border border-border p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                  {displayContent}
                </pre>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
