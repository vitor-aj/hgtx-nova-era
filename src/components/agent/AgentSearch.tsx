import { useState } from "react";
import { Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LegalOpinion } from "./AgentView";

interface AgentSearchProps {
  onSelectOpinion: (opinion: LegalOpinion) => void;
}

// Simulação de base de pareceres
const mockOpinionsDatabase: LegalOpinion[] = [
  {
    id: "base-1",
    title: "Análise Contratual - Prestação de Serviços Continuados",
    content: "Parecer completo sobre prestação de serviços...",
    createdAt: new Date("2024-01-15"),
    category: "Direito Civil",
  },
  {
    id: "base-2",
    title: "Rescisão de Contrato de Trabalho - Justa Causa",
    content: "Análise jurídica sobre rescisão contratual...",
    createdAt: new Date("2024-02-20"),
    category: "Direito Trabalhista",
  },
  {
    id: "base-3",
    title: "Responsabilidade Civil - Acidente de Trânsito",
    content: "Parecer sobre responsabilidade civil em acidentes...",
    createdAt: new Date("2024-03-10"),
    category: "Direito Civil",
  },
  {
    id: "base-4",
    title: "Dissolução de Sociedade - Procedimentos e Requisitos",
    content: "Análise completa sobre dissolução societária...",
    createdAt: new Date("2024-01-25"),
    category: "Direito Empresarial",
  },
  {
    id: "base-5",
    title: "Direitos do Consumidor - Vícios em Produtos",
    content: "Parecer sobre direitos do consumidor e garantias...",
    createdAt: new Date("2024-02-05"),
    category: "Direito do Consumidor",
  },
];

export const AgentSearch = ({ onSelectOpinion }: AgentSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<LegalOpinion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const results = mockOpinionsDatabase.filter(
      (opinion) =>
        opinion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opinion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opinion.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(results);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = searchResults.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 border-b border-border space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Pesquisar Base de Pareceres</h2>
        <div className="flex gap-2">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite título, frase ou categoria..."
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} className="gap-2">
            <Search className="w-4 h-4" />
            Buscar
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Base com {mockOpinionsDatabase.length} pareceres disponíveis
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-6">
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {paginatedResults.map((opinion) => (
                <div
                  key={opinion.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onSelectOpinion(opinion)}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{opinion.title}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{opinion.category}</span>
                        <span>{new Date(opinion.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {opinion.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center text-muted-foreground py-12">
              <p>Nenhum parecer encontrado para "{searchTerm}"</p>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p>Digite um termo para pesquisar na base de pareceres</p>
            </div>
          )}
        </ScrollArea>

        {searchResults.length > 0 && (
          <div className="p-4 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
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
              <span className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, searchResults.length)} de {searchResults.length}
              </span>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};
