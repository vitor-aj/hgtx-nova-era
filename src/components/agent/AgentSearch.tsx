import { useState, useRef } from "react";
import { Search, FileText, Upload, X, File, Trash2, Edit } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { LegalOpinion } from "./AgentView";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

interface AgentSearchProps {
  onSelectOpinion: (opinion: LegalOpinion) => void;
}

// Simulação de base de pareceres
let mockOpinionsDatabase: LegalOpinion[] = [
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOpinionForEdit, setSelectedOpinionForEdit] = useState<LegalOpinion | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension === "pdf" || extension === "docx") {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Arquivos não suportados",
        description: `Apenas arquivos PDF e DOCX são permitidos. Rejeitados: ${invalidFiles.join(", ")}`,
        variant: "destructive",
      });
    }

    if (validFiles.length > 0) {
      setUploadedFiles([...uploadedFiles, ...validFiles]);
      toast({
        title: "Arquivos adicionados",
        description: `${validFiles.length} arquivo(s) adicionado(s) com sucesso.`,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleEditOpinion = (opinion: LegalOpinion, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOpinionForEdit(opinion);
    setEditTitle(opinion.title);
    setEditCategory(opinion.category || "");
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedOpinionForEdit) return;

    const index = mockOpinionsDatabase.findIndex(op => op.id === selectedOpinionForEdit.id);
    if (index !== -1) {
      mockOpinionsDatabase[index] = {
        ...mockOpinionsDatabase[index],
        title: editTitle,
        category: editCategory,
      };

      // Atualizar resultados da busca se houver
      if (searchResults.length > 0) {
        handleSearch();
      }

      toast({
        title: "Parecer atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    }

    setIsEditDialogOpen(false);
    setSelectedOpinionForEdit(null);
  };

  const handleDeleteOpinion = (opinion: LegalOpinion, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOpinionForEdit(opinion);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedOpinionForEdit) return;

    const index = mockOpinionsDatabase.findIndex(op => op.id === selectedOpinionForEdit.id);
    if (index !== -1) {
      mockOpinionsDatabase.splice(index, 1);

      // Atualizar resultados da busca
      if (searchResults.length > 0) {
        handleSearch();
      }

      toast({
        title: "Parecer excluído",
        description: "O parecer foi removido da base.",
      });
    }

    setIsDeleteDialogOpen(false);
    setSelectedOpinionForEdit(null);
  };

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
        <h2 className="text-2xl font-bold text-foreground">Base de Pareceres</h2>
        
        {/* Upload Section */}
        <Card className="glass-effect border-border/50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Upload de Documentos</h3>
                  <p className="text-sm text-muted-foreground">Apenas arquivos PDF e DOCX</p>
                </div>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Selecionar Arquivos
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Arquivos carregados ({uploadedFiles.length})
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border"
                      >
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-primary" />
                          <span className="text-sm truncate max-w-xs">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(index)}
                          className="h-7 w-7 text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Section */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Pesquisar na Base</h3>
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
                    <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{opinion.title}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{opinion.category}</span>
                        <span>{new Date(opinion.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {opinion.content}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleEditOpinion(opinion, e)}
                        className="h-8 w-8"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteOpinion(opinion, e)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Parecer</DialogTitle>
            <DialogDescription>
              Atualize o título e a categoria do parecer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título do parecer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoria</Label>
              <Input
                id="edit-category"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="Categoria do parecer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o parecer "{selectedOpinionForEdit?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
