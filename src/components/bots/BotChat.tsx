import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BotChatSidebar, BotConversation } from "./BotChatSidebar";

interface Bot {
  id: string;
  name: string;
  prompt: string;
  model: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
  }>;
}

interface BotChatProps {
  bot: Bot;
  onBack: () => void;
}

export const BotChat = ({ bot, onBack }: BotChatProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState<BotConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize first conversation
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, []);

  const createNewConversation = () => {
    const newConversation: BotConversation = {
      id: Date.now().toString(),
      title: "Nova Conversa",
      lastMessage: "Inicie uma conversa...",
      timestamp: "Agora",
    };

    const initialMessage: Message = {
      id: "1",
      role: "assistant",
      content: "Envie sua mensagem",
      model: bot.model,
    };

    setConversations(prev => [newConversation, ...prev]);
    setConversationMessages(prev => ({
      ...prev,
      [newConversation.id]: [initialMessage],
    }));
    setSelectedConversationId(newConversation.id);
  };

  const currentMessages = selectedConversationId 
    ? conversationMessages[selectedConversationId] || [] 
    : [];

  const handleSendMessage = (content: string, files?: File[]) => {
    if (!selectedConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      attachments: files?.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
    };

    // Update messages
    setConversationMessages(prev => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage],
    }));

    // Update conversation title and last message
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversationId) {
        const title = conv.title === "Nova Conversa" 
          ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
          : conv.title;
        return {
          ...conv,
          title,
          lastMessage: content,
          timestamp: "Agora",
        };
      }
      return conv;
    }));

    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Resposta do ${bot.name} usando ${bot.model}. Esta é uma resposta simulada considerando as instruções: "${bot.prompt}"`,
        model: bot.model,
      };
      
      setConversationMessages(prev => ({
        ...prev,
        [selectedConversationId]: [...(prev[selectedConversationId] || []), aiResponse],
      }));

      // Update last message in conversation
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversationId) {
          return {
            ...conv,
            lastMessage: aiResponse.content.slice(0, 50) + "...",
            timestamp: "Agora",
          };
        }
        return conv;
      }));

      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    setConversationMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[id];
      return newMessages;
    });

    // If deleting current conversation, select the first available one
    if (selectedConversationId === id) {
      const remainingConversations = conversations.filter(conv => conv.id !== id);
      if (remainingConversations.length > 0) {
        setSelectedConversationId(remainingConversations[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  return (
    <div className="flex-1 flex h-full">
      <BotChatSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
        onNewConversation={createNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">{bot.name}</h2>
          <p className="text-sm text-muted-foreground">{bot.model}</p>
        </div>
      </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto">
            {currentMessages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              model={message.model}
              attachments={message.attachments}
            />
              ))}

            {isLoading && (
            <div className="flex gap-4 py-6 px-6 bg-muted/30">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
              </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
