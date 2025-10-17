import { useState } from "react";
import { Plus, Search, Eye, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OpinionDialog } from "./OpinionDialog";
import { AgentSearch } from "./AgentSearch";

export interface LegalOpinion {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  category?: string;
}

type SortField = "title" | "createdAt" | "category";
type SortOrder = "asc" | "desc";

export const AgentView = () => {
  const [opinions, setOpinions] = useState<LegalOpinion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState<LegalOpinion | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredOpinions = opinions.filter(
    (op) =>
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedOpinions = [...filteredOpinions].sort((a, b) => {
    const multiplier = sortOrder === "asc" ? 1 : -1;
    
    if (sortField === "createdAt") {
      return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    
    const aValue = a[sortField] || "";
    const bValue = b[sortField] || "";
    return multiplier * aValue.toString().localeCompare(bValue.toString());
  });

  const totalPages = Math.ceil(sortedOpinions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOpinions = sortedOpinions.slice(startIndex, startIndex + itemsPerPage);

  const handleOpinionCreated = (newOpinion: LegalOpinion) => {
    setOpinions([newOpinion, ...opinions]);
    setIsDialogOpen(false);
    setSelectedOpinion(null);
  };

  const handleDeleteOpinion = (id: string) => {
    setOpinions(opinions.filter(op => op.id !== id));
  };

  const handleViewOpinion = (opinion: LegalOpinion) => {
    setSelectedOpinion(opinion);
    setIsDialogOpen(true);
  };

  const handleNewOpinion = () => {
    setSelectedOpinion(null);
    setIsDialogOpen(true);
  };

  const handleSelectFromSearch = (opinion: LegalOpinion) => {
    setSelectedOpinion(opinion);
    setShowSearch(false);
    setIsDialogOpen(true);
  };

  if (showSearch) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-border">
          <Button variant="outline" onClick={() => setShowSearch(false)}>
            Voltar para Pareceres
          </Button>
        </div>
        <AgentSearch onSelectOpinion={handleSelectFromSearch} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">Agente de Parecer Jurídico</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowSearch(true)} variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Pesquisar Base de Pareceres
            </Button>
            <Button onClick={handleNewOpinion} className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Parecer
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Input
            placeholder="Buscar pareceres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Itens por página:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1 font-semibold"
                  >
                    Título
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("category")}
                    className="flex items-center gap-1 font-semibold"
                  >
                    Categoria
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-1 font-semibold"
                  >
                    Data de Criação
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOpinions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    {searchTerm
                      ? "Nenhum parecer encontrado"
                      : "Nenhum parecer criado ainda. Clique em 'Novo Parecer' para começar."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOpinions.map((opinion) => (
                  <TableRow key={opinion.id}>
                    <TableCell className="font-medium">{opinion.title}</TableCell>
                    <TableCell>{opinion.category || "-"}</TableCell>
                    <TableCell>
                      {new Date(opinion.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOpinion(opinion)}
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOpinion(opinion.id)}
                          className="text-destructive hover:text-destructive"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, sortedOpinions.length)} de{" "}
              {sortedOpinions.length} pareceres
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>

      <OpinionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedOpinion={selectedOpinion}
        onOpinionCreated={handleOpinionCreated}
      />
    </div>
  );
};
