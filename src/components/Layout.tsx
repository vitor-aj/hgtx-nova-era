import { useState } from "react";
import { MessageSquare, Image, Mic, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: "chat" | "images" | "audio";
  onTabChange: (tab: "chat" | "images" | "audio") => void;
}

type TabType = "chat" | "images" | "audio";

export const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const tabs = [
    { id: "chat" as TabType, label: "Bate-papo", icon: MessageSquare },
    { id: "images" as TabType, label: "Imagens", icon: Image },
    { id: "audio" as TabType, label: "Áudio", icon: Mic },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      {!isSidebarCollapsed ? (
        <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">HGTX Codex</h1>
              <p className="text-xs text-muted-foreground mt-1">AI Interface System</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(true)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button className="w-full gap-2 cyber-glow" variant="default">
            <Plus className="w-4 h-4" />
            Novo Chat
          </Button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground cyber-border"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <Separator className="bg-sidebar-border" />

        {/* Settings */}
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground">
            <Settings className="w-4 h-4" />
            Configurações
          </Button>
        </div>
      </aside>
      ) : (
        <aside className="w-12 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};
