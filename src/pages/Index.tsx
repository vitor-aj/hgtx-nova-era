import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ChatView } from "@/components/chat/ChatView";
import { ImageView } from "@/components/images/ImageView";
import { AudioView } from "@/components/audio/AudioView";

const Index = () => {
  const [activeView, setActiveView] = useState<"chat" | "images" | "audio">("chat");

  return (
    <Layout activeTab={activeView} onTabChange={setActiveView}>
      {activeView === "chat" && <ChatView />}
      {activeView === "images" && <ImageView />}
      {activeView === "audio" && <AudioView />}
    </Layout>
  );
};

export default Index;
