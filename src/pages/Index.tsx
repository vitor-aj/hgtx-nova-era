import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ChatView } from "@/components/chat/ChatView";
import { ImageView } from "@/components/images/ImageView";
import { TranscriptionView } from "@/components/audio/TranscriptionView";
import { GenerationView } from "@/components/audio/GenerationView";
import { BotView } from "@/components/bots/BotView";
import { BotChat } from "@/components/bots/BotChat";
import { AgentView } from "@/components/agent/AgentView";
import { CreditsView } from "@/components/credits/CreditsView";
import { AddCreditsView } from "@/components/credits/AddCreditsView";

interface Bot {
  id: string;
  name: string;
  prompt: string;
  model: string;
}

const Index = () => {
  const [activeView, setActiveView] = useState<"chat" | "images" | "transcription" | "generation" | "bots" | "agent" | "credits">("chat");
  const [activeBotChat, setActiveBotChat] = useState<Bot | null>(null);
  const [isAddingCredits, setIsAddingCredits] = useState(false);

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
      {activeView === "credits" && (
        isAddingCredits ? (
          <AddCreditsView onBack={() => setIsAddingCredits(false)} />
        ) : (
          <CreditsView onAddCredits={() => setIsAddingCredits(true)} />
        )
      )}
    </Layout>
  );
};

export default Index;
