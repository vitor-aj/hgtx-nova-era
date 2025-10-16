import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSidebar } from "./ChatSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export const ChatView = () => {
  const [isChatSidebarCollapsed, setIsChatSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState("ChatGPT 4.1");
  const [currentChatId, setCurrentChatId] = useState("1");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! Sou o assistente HGTX Codex. Como posso ajudá-lo hoje?",
      model: "ChatGPT 4.1",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Olá! Sou o assistente HGTX Codex. Como posso ajudá-lo hoje?",
        model: selectedModel,
      },
    ]);
  };

  const handleSendMessage = (content: string, files?: File[]) => {
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

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Esta é uma resposta simulada. Em breve, estarei conectado a modelos de IA reais para fornecer respostas inteligentes e úteis.",
        model: selectedModel,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-full">
      {/* Chat Sidebar */}
      <ChatSidebar 
        isCollapsed={isChatSidebarCollapsed}
        onToggleCollapse={() => setIsChatSidebarCollapsed(!isChatSidebarCollapsed)}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          showModelSelector={true}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />

        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
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

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
