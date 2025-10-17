import { useState } from "react";
import { MessageSquare, Image, Mic, ArrowLeft, Plus, ChevronLeft, ChevronRight, Bot, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: "chat" | "images" | "audio" | "bots" | "agent";
  onTabChange: (tab: "chat" | "images" | "audio" | "bots" | "agent") => void;
}

type TabType = "chat" | "images" | "audio" | "bots" | "agent";

export const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const tabs = [
    { id: "chat" as TabType, label: "Bate-papo", icon: MessageSquare },
    { id: "images" as TabType, label: "Imagens", icon: Image },
    { id: "audio" as TabType, label: "Áudio", icon: Mic },
    { id: "bots" as TabType, label: "Bots", icon: Bot },
    { id: "agent" as TabType, label: "Agente de Parecer", icon: FileText },
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

          {/* Settings & Theme */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <div className="flex items-center justify-between px-3">
              <span className="text-sm font-medium text-sidebar-foreground">Tema</span>
              <ThemeToggle />
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </aside>
      ) : (
        <aside className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col">
          {/* Collapsed Header with Expand Button */}
          <div className="p-3 border-b border-sidebar-border space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(false)}
              className="w-full text-muted-foreground hover:text-foreground"
              title="Expandir"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xs font-bold text-white">HX</span>
              </div>
            </div>
          </div>

          {/* Navigation Icons */}
          <nav className="flex-1 px-2 py-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full p-3 rounded-lg transition-all flex items-center justify-center ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground cyber-border"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                  title={tab.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </nav>

          <Separator className="bg-sidebar-border" />

          {/* Theme & Settings Icons */}
          <div className="p-3 border-t border-sidebar-border space-y-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="w-full text-sidebar-foreground" title="Voltar">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
};
