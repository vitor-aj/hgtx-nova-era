import { useState } from "react";
import { AgentSidebar } from "./AgentSidebar";
import { AgentChat } from "./AgentChat";
import { AgentSearch } from "./AgentSearch";

export interface LegalOpinion {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  category?: string;
}

export const AgentView = () => {
  const [opinions, setOpinions] = useState<LegalOpinion[]>([]);
  const [selectedOpinion, setSelectedOpinion] = useState<LegalOpinion | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedOpinion(null);
    setShowSearch(false);
  };

  const handleSelectOpinion = (opinion: LegalOpinion) => {
    setSelectedOpinion(opinion);
    setIsCreatingNew(false);
    setShowSearch(false);
  };

  const handleSearch = () => {
    setShowSearch(true);
    setIsCreatingNew(false);
    setSelectedOpinion(null);
  };

  const handleOpinionCreated = (newOpinion: LegalOpinion) => {
    setOpinions([newOpinion, ...opinions]);
    setSelectedOpinion(newOpinion);
    setIsCreatingNew(false);
  };

  const handleDeleteOpinion = (id: string) => {
    setOpinions(opinions.filter(op => op.id !== id));
    if (selectedOpinion?.id === id) {
      setSelectedOpinion(null);
    }
  };

  return (
    <div className="flex h-full">
      <AgentSidebar
        opinions={opinions}
        onCreateNew={handleCreateNew}
        onSelectOpinion={handleSelectOpinion}
        onDeleteOpinion={handleDeleteOpinion}
        onSearch={handleSearch}
        selectedOpinionId={selectedOpinion?.id}
      />
      <div className="flex-1">
        {showSearch ? (
          <AgentSearch onSelectOpinion={handleSelectOpinion} />
        ) : (
          <AgentChat
            selectedOpinion={selectedOpinion}
            isCreatingNew={isCreatingNew}
            onOpinionCreated={handleOpinionCreated}
          />
        )}
      </div>
    </div>
  );
};
