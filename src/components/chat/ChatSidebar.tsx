import { useState } from "react";
import { Search, Folder, FolderPlus, MessageSquare, MoreVertical, Trash2, Edit, FolderInput, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  folderId?: string;
}

interface ChatFolder {
  id: string;
  name: string;
}

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNewChat: () => void;
}

export const ChatSidebar = ({ isCollapsed, onToggleCollapse, onNewChat }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
  const [isDeleteFolderOpen, setIsDeleteFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<ChatFolder | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<ChatFolder | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");

  const [folders, setFolders] = useState<ChatFolder[]>([
    { id: "work", name: "Trabalho" },
    { id: "personal", name: "Pessoal" },
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Conversa sobre IA",
      lastMessage: "Como funciona o machine learning?",
      timestamp: "Há 5 min",
    },
    {
      id: "2",
      title: "Projeto HGTX",
      lastMessage: "Discutindo arquitetura do sistema",
      timestamp: "Há 1 hora",
      folderId: "work",
    },
    {
      id: "3",
      title: "Ideias criativas",
      lastMessage: "Brainstorm para novo produto",
      timestamp: "Ontem",
      folderId: "personal",
    },
  ]);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["work", "personal"]));

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: ChatFolder = {
        id: Date.now().toString(),
        name: newFolderName,
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  const handleEditFolder = () => {
    if (editingFolder && newFolderName.trim()) {
      setFolders(
        folders.map((f) =>
          f.id === editingFolder.id ? { ...f, name: newFolderName } : f
        )
      );
      setNewFolderName("");
      setEditingFolder(null);
      setIsEditFolderOpen(false);
    }
  };

  const handleDeleteFolder = () => {
    if (deletingFolder) {
      // Remove folder and move conversations back to "no folder"
      setConversations(
        conversations.map((conv) =>
          conv.folderId === deletingFolder.id ? { ...conv, folderId: undefined } : conv
        )
      );
      setFolders(folders.filter((f) => f.id !== deletingFolder.id));
      setDeletingFolder(null);
      setIsDeleteFolderOpen(false);
    }
  };

  const openEditFolder = (folder: ChatFolder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setIsEditFolderOpen(true);
  };

  const openDeleteFolder = (folder: ChatFolder) => {
    setDeletingFolder(folder);
    setIsDeleteFolderOpen(true);
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const moveToFolder = (conversationId: string, folderId: string) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, folderId } : conv
      )
    );
  };

  const removeFromFolder = (conversationId: string) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, folderId: undefined } : conv
      )
    );
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const conversationsWithoutFolder = filteredConversations.filter((c) => !c.folderId);
  const conversationsByFolder = folders.reduce((acc, folder) => {
    acc[folder.id] = filteredConversations.filter((c) => c.folderId === folder.id);
    return acc;
  }, {} as Record<string, Conversation[]>);

  if (isCollapsed) {
    return (
      <div className="w-12 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col">
      {/* Header with collapse button */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Conversas</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar conversas..."
            className="pl-9 bg-muted/50"
          />
        </div>

        <Button className="w-full gap-2 cyber-glow" variant="default" onClick={onNewChat}>
          <Plus className="w-4 h-4" />
          Novo Chat
        </Button>

        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2" size="sm">
              <FolderPlus className="w-4 h-4" />
              Nova Pasta
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect bg-card border-border z-50">
            <DialogHeader>
              <DialogTitle>Criar Nova Pasta</DialogTitle>
              <DialogDescription>
                Organize suas conversas em pastas personalizadas.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Nome da Pasta</Label>
                <Input
                  id="folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ex: Projetos, Estudos..."
                  onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                Criar Pasta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Folder Dialog */}
        <Dialog open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
          <DialogContent className="glass-effect bg-card border-border z-50">
            <DialogHeader>
              <DialogTitle>Editar Pasta</DialogTitle>
              <DialogDescription>
                Renomeie sua pasta de conversas.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-folder-name">Nome da Pasta</Label>
                <Input
                  id="edit-folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Digite o novo nome..."
                  onKeyDown={(e) => e.key === "Enter" && handleEditFolder()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditFolderOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditFolder} disabled={!newFolderName.trim()}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Folder Alert */}
        <AlertDialog open={isDeleteFolderOpen} onOpenChange={setIsDeleteFolderOpen}>
          <AlertDialogContent className="glass-effect bg-card border-border z-50">
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Pasta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. As conversas dentro da pasta serão movidas para "Sem Pasta".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteFolder} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* Folders */}
          {folders.map((folder) => (
            <div key={folder.id} className="space-y-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Folder className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-sm flex-1 text-left">
                    {folder.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {conversationsByFolder[folder.id]?.length || 0}
                  </span>
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-effect bg-popover border-border z-50">
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => openEditFolder(folder)}
                    >
                      <Edit className="w-3 h-3" />
                      Editar Nome
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="gap-2 text-destructive"
                      onClick={() => openDeleteFolder(folder)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Excluir Pasta
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {expandedFolders.has(folder.id) && conversationsByFolder[folder.id]?.length > 0 && (
                <div className="ml-6 space-y-1">
                  {conversationsByFolder[folder.id].map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isSelected={selectedConversation === conv.id}
                      onSelect={() => setSelectedConversation(conv.id)}
                      folders={folders}
                      onMoveToFolder={moveToFolder}
                      onRemoveFromFolder={removeFromFolder}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Conversations without folder */}
          {conversationsWithoutFolder.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sem Pasta
              </div>
              {conversationsWithoutFolder.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedConversation === conv.id}
                  onSelect={() => setSelectedConversation(conv.id)}
                  folders={folders}
                  onMoveToFolder={moveToFolder}
                  onRemoveFromFolder={removeFromFolder}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
  folders: ChatFolder[];
  onMoveToFolder: (conversationId: string, folderId: string) => void;
  onRemoveFromFolder: (conversationId: string) => void;
}

const ConversationItem = ({
  conversation,
  isSelected,
  onSelect,
  folders,
  onMoveToFolder,
  onRemoveFromFolder,
}: ConversationItemProps) => {
  return (
    <div
      className={`group flex items-start gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "bg-sidebar-accent cyber-border"
          : "hover:bg-muted/50"
      }`}
      onClick={onSelect}
    >
      <MessageSquare className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{conversation.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {conversation.lastMessage}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {conversation.timestamp}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-effect bg-popover border-border z-50">
          <DropdownMenuItem className="gap-2">
            <Edit className="w-3 h-3" />
            Renomear
          </DropdownMenuItem>
          
          {conversation.folderId && (
            <DropdownMenuItem
              className="gap-2"
              onClick={() => onRemoveFromFolder(conversation.id)}
            >
              <FolderInput className="w-3 h-3" />
              Remover da Pasta
            </DropdownMenuItem>
          )}

          {folders.map((folder) => (
            <DropdownMenuItem
              key={folder.id}
              className="gap-2"
              onClick={() => onMoveToFolder(conversation.id, folder.id)}
            >
              <Folder className="w-3 h-3" />
              Mover para {folder.name}
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem className="gap-2 text-destructive">
            <Trash2 className="w-3 h-3" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
