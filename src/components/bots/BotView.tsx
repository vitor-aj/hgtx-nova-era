import { useState } from "react";
import { Bot, Edit, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Bot {
  id: string;
  name: string;
  prompt: string;
  model: string;
}

interface BotViewProps {
  onStartChat: (bot: Bot) => void;
}

export const BotView = ({ onStartChat }: BotViewProps) => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    prompt: "",
    model: "ChatGPT 4.1",
  });

  const handleCreateBot = () => {
    const newBot: Bot = {
      id: Date.now().toString(),
      name: formData.name,
      prompt: formData.prompt,
      model: formData.model,
    };
    setBots([...bots, newBot]);
    setFormData({ name: "", prompt: "", model: "ChatGPT 4.1" });
    setIsCreateDialogOpen(false);
  };

  const handleEditBot = () => {
    if (!selectedBot) return;
    setBots(bots.map(bot => 
      bot.id === selectedBot.id 
        ? { ...bot, name: formData.name, prompt: formData.prompt, model: formData.model }
        : bot
    ));
    setIsEditDialogOpen(false);
    setSelectedBot(null);
    setFormData({ name: "", prompt: "", model: "ChatGPT 4.1" });
  };

  const handleDeleteBot = () => {
    if (!selectedBot) return;
    setBots(bots.filter(bot => bot.id !== selectedBot.id));
    setIsDeleteDialogOpen(false);
    setSelectedBot(null);
  };

  const openEditDialog = (bot: Bot) => {
    setSelectedBot(bot);
    setFormData({
      name: bot.name,
      prompt: bot.prompt,
      model: bot.model,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (bot: Bot) => {
    setSelectedBot(bot);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="w-6 h-6" />
              Gerenciador de Bots
            </h2>
            <p className="text-muted-foreground mt-1">Crie e gerencie seus assistentes de IA</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Bot className="w-4 h-4 mr-2" />
                Criar Bot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Bot</DialogTitle>
                <DialogDescription>
                  Configure seu assistente de IA personalizado
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Assistente de Programação"
                  />
                </div>
                <div>
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    placeholder="Defina a personalidade e instruções do bot..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Modelo de IA</Label>
                  <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ChatGPT 4.1">ChatGPT 4.1</SelectItem>
                      <SelectItem value="ChatGPT 4.0">ChatGPT 4.0</SelectItem>
                      <SelectItem value="Claude 3.5">Claude 3.5</SelectItem>
                      <SelectItem value="Gemini Pro">Gemini Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateBot} disabled={!formData.name || !formData.prompt}>
                  Criar Bot
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {bots.length === 0 ? (
          <Card className="max-w-2xl mx-auto mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Nenhum bot criado
              </CardTitle>
              <CardDescription>
                Comece criando seu primeiro assistente de IA personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Crie bots com diferentes personalidades, instruções e modelos de IA para diferentes propósitos.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Bot className="w-4 h-4 mr-2" />
                Criar Primeiro Bot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-6xl mx-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bots.map((bot) => (
                  <TableRow key={bot.id}>
                    <TableCell className="font-medium">{bot.name}</TableCell>
                    <TableCell>{bot.model}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onStartChat(bot)}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Conversar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(bot)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDeleteDialog(bot)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Bot</DialogTitle>
            <DialogDescription>
              Atualize as configurações do seu assistente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-prompt">Prompt</Label>
              <Textarea
                id="edit-prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-model">Modelo de IA</Label>
              <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ChatGPT 4.1">ChatGPT 4.1</SelectItem>
                  <SelectItem value="ChatGPT 4.0">ChatGPT 4.0</SelectItem>
                  <SelectItem value="Claude 3.5">Claude 3.5</SelectItem>
                  <SelectItem value="Gemini Pro">Gemini Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditBot} disabled={!formData.name || !formData.prompt}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Bot</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o bot "{selectedBot?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBot}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
