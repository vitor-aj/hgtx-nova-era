import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BotChatSidebar, BotConversation } from "./BotChatSidebar";

interface Bot {
  id: string;
  name: string;
  prompt: string;
  model: string;
}

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

interface BotChatProps {
  bot: Bot;
  onBack: () => void;
}

export const BotChat = ({ bot, onBack }: BotChatProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState<BotConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize first conversation
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, []);

  const createNewConversation = () => {
    const newConversation: BotConversation = {
      id: Date.now().toString(),
      title: "Exemplo de Conversa",
      lastMessage: "Como criar uma API REST?",
      timestamp: "Agora",
    };

    const initialMessages: Message[] = [
      {
        id: "1",
        role: "user",
        content: "Como criar uma API REST simples em Node.js?",
      },
      {
        id: "2",
        role: "assistant",
        content: `Vou te mostrar como criar uma **API REST** básica usando **Express.js**:

## 1. Instalação

Primeiro, instale as dependências necessárias:

\`\`\`bash
npm init -y
npm install express
\`\`\`

## 2. Código da API

Crie um arquivo \`server.js\`:

\`\`\`javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(express.json());

// Dados de exemplo
let users = [
  { id: 1, name: 'João Silva', email: 'joao@email.com' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com' }
];

// GET - Listar todos os usuários
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET - Buscar usuário por ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
});

// POST - Criar novo usuário
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT - Atualizar usuário
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  res.json(user);
});

// DELETE - Remover usuário
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
  
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(\`Servidor rodando em http://localhost:\${PORT}\`);
});
\`\`\`

## 3. Executar o servidor

\`\`\`bash
node server.js
\`\`\`

### Principais endpoints:

- **GET** \`/api/users\` - Lista todos os usuários
- **GET** \`/api/users/:id\` - Busca usuário específico
- **POST** \`/api/users\` - Cria novo usuário
- **PUT** \`/api/users/:id\` - Atualiza usuário
- **DELETE** \`/api/users/:id\` - Remove usuário

> 💡 **Dica**: Use ferramentas como **Postman** ou **Insomnia** para testar sua API!`,
        model: bot.model,
      },
      {
        id: "3",
        role: "user",
        content: "E como adiciono autenticação JWT?",
      },
      {
        id: "4",
        role: "assistant",
        content: `Excelente pergunta! Vou mostrar como adicionar **autenticação JWT** à sua API:

## 1. Instalar dependências

\`\`\`bash
npm install jsonwebtoken bcrypt
\`\`\`

## 2. Criar middleware de autenticação

Crie \`middleware/auth.js\`:

\`\`\`javascript
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'sua-chave-secreta-aqui';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, SECRET_KEY };
\`\`\`

## 3. Adicionar rotas de autenticação

\`\`\`javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, authenticateToken } = require('./middleware/auth');

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Buscar usuário (em produção, use banco de dados)
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Verificar senha
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Gerar token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Proteger rotas com middleware
app.get('/api/users', authenticateToken, (req, res) => {
  res.json(users);
});
\`\`\`

### Como usar:

1. **Fazer login** e obter o token
2. **Enviar o token** no header: \`Authorization: Bearer SEU_TOKEN_AQUI\`
3. **Acessar rotas protegidas** com o token válido

Isso garante que apenas usuários autenticados acessem suas rotas! 🔐`,
        model: bot.model,
      },
    ];

    setConversations(prev => [newConversation, ...prev]);
    setConversationMessages(prev => ({
      ...prev,
      [newConversation.id]: initialMessages,
    }));
    setSelectedConversationId(newConversation.id);
  };

  const currentMessages = selectedConversationId 
    ? conversationMessages[selectedConversationId] || [] 
    : [];

  const handleSendMessage = (content: string, files?: File[]) => {
    if (!selectedConversationId) return;

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

    // Update messages
    setConversationMessages(prev => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage],
    }));

    // Update conversation title and last message
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversationId) {
        const title = conv.title === "Nova Conversa" 
          ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
          : conv.title;
        return {
          ...conv,
          title,
          lastMessage: content,
          timestamp: "Agora",
        };
      }
      return conv;
    }));

    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Resposta do ${bot.name} usando ${bot.model}. Esta é uma resposta simulada considerando as instruções: "${bot.prompt}"`,
        model: bot.model,
      };
      
      setConversationMessages(prev => ({
        ...prev,
        [selectedConversationId]: [...(prev[selectedConversationId] || []), aiResponse],
      }));

      // Update last message in conversation
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversationId) {
          return {
            ...conv,
            lastMessage: aiResponse.content.slice(0, 50) + "...",
            timestamp: "Agora",
          };
        }
        return conv;
      }));

      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    setConversationMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[id];
      return newMessages;
    });

    // If deleting current conversation, select the first available one
    if (selectedConversationId === id) {
      const remainingConversations = conversations.filter(conv => conv.id !== id);
      if (remainingConversations.length > 0) {
        setSelectedConversationId(remainingConversations[0].id);
      } else {
        createNewConversation();
      }
    }
  };

  return (
    <div className="flex-1 flex h-full">
      <BotChatSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
        onNewConversation={createNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">{bot.name}</h2>
          <p className="text-sm text-muted-foreground">{bot.model}</p>
        </div>
      </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto">
            {currentMessages.map((message) => (
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

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
