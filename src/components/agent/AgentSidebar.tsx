import { Plus, Search, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LegalOpinion } from "./AgentView";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AgentSidebarProps {
  opinions: LegalOpinion[];
  onCreateNew: () => void;
  onSelectOpinion: (opinion: LegalOpinion) => void;
  onDeleteOpinion: (id: string) => void;
  onSearch: () => void;
  selectedOpinionId?: string;
}

export const AgentSidebar = ({
  opinions,
  onCreateNew,
  onSelectOpinion,
  onDeleteOpinion,
  onSearch,
  selectedOpinionId,
}: AgentSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOpinions = opinions.filter(op =>
    op.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-80 border-r border-border bg-sidebar flex flex-col h-full">
      <div className="p-4 border-b border-border space-y-3">
        <h2 className="text-xl font-bold text-sidebar-foreground">Agente de Parecer</h2>
        <Button onClick={onCreateNew} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Novo Parecer
        </Button>
        <Button onClick={onSearch} variant="outline" className="w-full gap-2">
          <Search className="w-4 h-4" />
          Pesquisar Base de Pareceres
        </Button>
        <Input
          placeholder="Buscar pareceres..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredOpinions.map((opinion) => (
            <div
              key={opinion.id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                selectedOpinionId === opinion.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
              }`}
              onClick={() => onSelectOpinion(opinion)}
            >
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{opinion.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(opinion.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  {opinion.category && (
                    <p className="text-xs text-muted-foreground mt-1">{opinion.category}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteOpinion(opinion.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
