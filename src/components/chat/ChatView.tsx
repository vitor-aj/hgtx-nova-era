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
  const [systemPrompt, setSystemPrompt] = useState("Você é um assistente útil e prestativo.");
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
          `Resposta com base na personalidade: "${systemPrompt}". Esta é uma resposta simulada que considera as instruções de sistema definidas.`,
        model: selectedModel,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full pb-16 md:pb-0">
      {/* Chat Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <ChatSidebar 
          isCollapsed={isChatSidebarCollapsed}
          onToggleCollapse={() => setIsChatSidebarCollapsed(!isChatSidebarCollapsed)}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full">
        <ChatHeader 
          showModelSelector={true}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
        />

        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto px-2 md:px-4">
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
