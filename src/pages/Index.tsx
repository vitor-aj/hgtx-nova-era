import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ChatView } from "@/components/chat/ChatView";
import { ImageView } from "@/components/images/ImageView";
import { AudioView } from "@/components/audio/AudioView";
import { BotView } from "@/components/bots/BotView";
import { BotChat } from "@/components/bots/BotChat";

interface Bot {
  id: string;
  name: string;
  prompt: string;
  model: string;
}

const Index = () => {
  const [activeView, setActiveView] = useState<"chat" | "images" | "audio" | "bots">("chat");
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
      {activeView === "audio" && <AudioView />}
      {activeView === "bots" && (
        activeBotChat ? (
          <BotChat bot={activeBotChat} onBack={handleBackFromBotChat} />
        ) : (
          <BotView onStartChat={handleStartBotChat} />
        )
      )}
    </Layout>
  );
};

export default Index;
