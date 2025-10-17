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
    <div className="flex flex-col h-full bg-background pb-16 md:pb-0">
      <div className="p-3 md:p-6 border-b border-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
          <h1 className="text-xl md:text-3xl font-bold text-foreground">Agente de Parecer Jurídico</h1>
          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={() => setShowSearch(true)} variant="outline" className="gap-1 md:gap-2 flex-1 md:flex-none text-xs md:text-sm">
              <Search className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Pesquisar Base</span>
              <span className="sm:hidden">Base</span>
            </Button>
            <Button onClick={handleNewOpinion} className="gap-1 md:gap-2 flex-1 md:flex-none text-xs md:text-sm">
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Novo Parecer</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4">
          <Input
            placeholder="Buscar pareceres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-sm text-sm"
          />
          <div className="flex items-center gap-2 justify-between md:justify-start">
            <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">Itens:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-16 md:w-20">
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

      <div className="flex-1 overflow-auto p-3 md:p-6">
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("title")}
                    className="flex items-center gap-1 font-semibold text-xs md:text-sm p-1 md:p-2"
                  >
                    Título
                    <ArrowUpDown className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("category")}
                    className="flex items-center gap-1 font-semibold text-sm"
                  >
                    Categoria
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center gap-1 font-semibold text-xs md:text-sm p-1 md:p-2"
                  >
                    Data
                    <ArrowUpDown className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center text-xs md:text-sm">Ações</TableHead>
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
                    <TableCell className="font-medium text-xs md:text-sm">{opinion.title}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{opinion.category || "-"}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs md:text-sm">
                      {new Date(opinion.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOpinion(opinion)}
                          title="Visualizar"
                          className="h-7 w-7 md:h-9 md:w-9"
                        >
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOpinion(opinion.id)}
                          className="text-destructive hover:text-destructive h-7 w-7 md:h-9 md:w-9"
                          title="Excluir"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mt-4">
            <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedOpinions.length)} de {sortedOpinions.length}
            </p>
            <div className="flex gap-1 md:gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-xs md:text-sm px-2 md:px-4"
              >
                <span className="hidden sm:inline">Anterior</span>
                <span className="sm:hidden">Ant</span>
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 md:w-10 md:h-9 p-0 text-xs md:text-sm"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="text-xs md:text-sm px-2 md:px-4"
              >
                <span className="hidden sm:inline">Próxima</span>
                <span className="sm:hidden">Prox</span>
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
