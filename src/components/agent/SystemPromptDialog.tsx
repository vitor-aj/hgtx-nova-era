import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface SystemPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SystemPromptDialog = ({ open, onOpenChange }: SystemPromptDialogProps) => {
  const { toast } = useToast();
  
  const [agent1Prompt, setAgent1Prompt] = useState(
    "Você é um assistente jurídico especializado em análise de casos e elaboração de pareceres técnicos."
  );
  
  const [agent2Prompt, setAgent2Prompt] = useState(
    "Você é um revisor jurídico especializado em validação e refinamento de argumentos legais."
  );

  const handleSave = () => {
    // Aqui você pode adicionar a lógica para salvar os prompts
    toast({
      title: "Prompts salvos",
      description: "Os prompts do sistema foram atualizados com sucesso.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>System Prompts</DialogTitle>
          <DialogDescription>
            Configure os prompts do sistema para os agentes de análise jurídica.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="agent1-prompt" className="text-base font-semibold">
              Prompt do Agente 1
            </Label>
            <p className="text-sm text-muted-foreground">
              Agente especialista em elaboração de parecer jurídico, responsável por desenvolver a estrutura completa e fundamentada do documento legal
            </p>
            <Textarea
              id="agent1-prompt"
              value={agent1Prompt}
              onChange={(e) => setAgent1Prompt(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Digite o prompt do primeiro agente..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent2-prompt" className="text-base font-semibold">
              Prompt do Agente 2
            </Label>
            <p className="text-sm text-muted-foreground">
              Agente especialista em revisão e aprimoramento de parecer jurídico, focado em validar argumentos e refinar a qualidade técnica
            </p>
            <Textarea
              id="agent2-prompt"
              value={agent2Prompt}
              onChange={(e) => setAgent2Prompt(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
              placeholder="Digite o prompt do segundo agente..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
