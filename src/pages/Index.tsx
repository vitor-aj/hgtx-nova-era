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
import { ManagePaymentsView } from "@/components/credits/ManagePaymentsView";

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
  const [isManagingPayments, setIsManagingPayments] = useState(false);

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
      {activeView === "credits" && !isAddingCredits && !isManagingPayments && (
        <CreditsView 
          onAddCredits={() => setIsAddingCredits(true)} 
          onManagePayments={() => setIsManagingPayments(true)}
        />
      )}
      {activeView === "credits" && isAddingCredits && (
        <AddCreditsView 
          onBack={() => setIsAddingCredits(false)}
          onManageCards={() => {
            setIsAddingCredits(false);
            setIsManagingPayments(true);
          }}
        />
      )}
      {activeView === "credits" && isManagingPayments && (
        <ManagePaymentsView onBack={() => setIsManagingPayments(false)} />
      )}
    </Layout>
  );
};

export default Index;
