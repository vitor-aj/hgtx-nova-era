import { Plus, Search, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LegalOpinion } from "./AgentView";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <div className="p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="w-[120px]">Data</TableHead>
                <TableHead className="w-[100px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpinions.map((opinion) => (
                <TableRow
                  key={opinion.id}
                  className={selectedOpinionId === opinion.id ? "bg-sidebar-accent" : ""}
                >
                  <TableCell className="font-medium">
                    <div>
                      <p className="truncate">{opinion.title}</p>
                      {opinion.category && (
                        <p className="text-xs text-muted-foreground mt-1">{opinion.category}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(opinion.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onSelectOpinion(opinion)}
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDeleteOpinion(opinion.id)}
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredOpinions.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">Nenhum parecer encontrado</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
