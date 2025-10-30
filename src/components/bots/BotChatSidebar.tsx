import { useState } from "react";
import { Search, MessageSquare, MoreVertical, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface BotConversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface BotChatSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  conversations: BotConversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const BotChatSidebar = ({
  isCollapsed,
  onToggleCollapse,
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: BotChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingConversation, setDeletingConversation] = useState<BotConversation | null>(null);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteConversation = () => {
    if (deletingConversation) {
      onDeleteConversation(deletingConversation.id);
      setDeletingConversation(null);
    }
  };

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

        <Button className="w-full gap-2 cyber-glow" variant="default" onClick={onNewConversation}>
          <Plus className="w-4 h-4" />
          Nova Conversa
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedConversationId === conv.id}
                onSelect={() => onSelectConversation(conv.id)}
                onDelete={() => setDeletingConversation(conv)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Delete Conversation Alert */}
      <AlertDialog open={!!deletingConversation} onOpenChange={(open) => !open && setDeletingConversation(null)}>
        <AlertDialogContent className="glass-effect bg-card border-border z-50">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Conversa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A conversa será permanentemente excluída.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConversation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface ConversationItemProps {
  conversation: BotConversation;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const ConversationItem = ({
  conversation,
  isSelected,
  onSelect,
  onDelete,
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
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-sm font-medium truncate">{conversation.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {conversation.lastMessage}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {conversation.timestamp}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-effect bg-popover border-border z-50">
          <DropdownMenuItem className="gap-2 text-destructive" onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}>
            <Trash2 className="w-3 h-3" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
