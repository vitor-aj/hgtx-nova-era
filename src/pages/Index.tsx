import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ChatView } from "@/components/chat/ChatView";
import { ImageView } from "@/components/images/ImageView";
import { TranscriptionView } from "@/components/audio/TranscriptionView";
import { GenerationView } from "@/components/audio/GenerationView";
import { BotView } from "@/components/bots/BotView";
import { BotChat } from "@/components/bots/BotChat";
import { AgentView } from "@/components/agent/AgentView";

interface Bot {
  id: string;
  name: string;
  prompt: string;
  model: string;
}

const Index = () => {
  const [activeView, setActiveView] = useState<"chat" | "images" | "transcription" | "generation" | "bots" | "agent">("chat");
  const [activeBotChat, setActiveBotChat] = useState<Bot | null>(null);

  const handleStartBotChat = (bot: Bot) => {
    setActiveBotChat(bot);
  };

  const handleBackFromBotChat = () => {
    setActiveBotChat(null);
  };

  return (
    <Layout activeTab={activeView} onTabChange={setActiveView}>
      {activeView === "chat" && <ChatView />}
      {activeView === "images" && <ImageView />}
      {activeView === "transcription" && <TranscriptionView />}
      {activeView === "generation" && <GenerationView />}
      {activeView === "bots" && (
        activeBotChat ? (
          <BotChat bot={activeBotChat} onBack={handleBackFromBotChat} />
        ) : (
          <BotView onStartChat={handleStartBotChat} />
        )
      )}
      {activeView === "agent" && <AgentView />}
    </Layout>
  );
};

export default Index;
