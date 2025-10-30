import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, Check, X } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

export interface Category {
  id: string;
  name: string;
}

interface CategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

export const CategoriesDialog = ({
  open,
  onOpenChange,
  categories,
  onCategoriesChange,
}: CategoriesDialogProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    const updatedCategories = categories.map((cat) =>
      cat.id === editingId ? { ...cat, name: editValue.trim() } : cat
    );
    onCategoriesChange(updatedCategories);
    setEditingId(null);
    setEditValue("");
    
    toast({
      title: "Categoria atualizada",
      description: "A categoria foi atualizada com sucesso.",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCategory.trim(),
    };

    onCategoriesChange([...categories, newCat]);
    setNewCategory("");
    
    toast({
      title: "Categoria adicionada",
      description: "A nova categoria foi criada com sucesso.",
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteId) return;

    const updatedCategories = categories.filter((cat) => cat.id !== deleteId);
    onCategoriesChange(updatedCategories);
    setDeleteId(null);
    
    toast({
      title: "Categoria excluída",
      description: "A categoria foi removida com sucesso.",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Gerenciar Categorias</DialogTitle>
            <DialogDescription>
              Adicione, edite ou exclua categorias de pareceres
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Add New Category */}
            <div className="flex gap-2">
              <Input
                placeholder="Nova categoria..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <Button onClick={handleAddCategory} className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </Button>
            </div>

            {/* Categories Table */}
            <div className="border rounded-lg overflow-auto flex-1">
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="font-semibold">Nome da Categoria</TableHead>
                    <TableHead className="text-right font-semibold w-[120px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                        Nenhuma categoria cadastrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id} className="hover:bg-muted/30">
                        <TableCell>
                          {editingId === category.id ? (
                            <div className="flex gap-2 items-center">
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveEdit();
                                  if (e.key === "Escape") handleCancelEdit();
                                }}
                                autoFocus
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleSaveEdit}
                                className="h-8 w-8 text-green-600 hover:text-green-700"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                className="h-8 w-8"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="font-medium">{category.name}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId !== category.id && (
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStartEdit(category)}
                                className="h-8 w-8"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteId(category.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
