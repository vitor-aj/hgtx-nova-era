import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSidebar } from "./ChatSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export const ChatView = () => {
  const [isChatSidebarCollapsed, setIsChatSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState("ChatGPT 4.1");
  const [currentChatId, setCurrentChatId] = useState("1");
  const [systemPrompt, setSystemPrompt] = useState("Você é um assistente útil e prestativo.");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: "Como posso criar uma função em Python que calcula o fatorial de um número?",
    },
    {
      id: "2",
      role: "assistant",
      content: `Claro! Vou te mostrar **duas formas** de criar uma função para calcular o fatorial:

## 1. Versão Iterativa

\`\`\`python
def fatorial_iterativo(n):
    if n < 0:
        return None
    resultado = 1
    for i in range(1, n + 1):
        resultado *= i
    return resultado

# Exemplo de uso
print(fatorial_iterativo(5))  # Saída: 120
\`\`\`

## 2. Versão Recursiva

\`\`\`python
def fatorial_recursivo(n):
    if n < 0:
        return None
    if n == 0 or n == 1:
        return 1
    return n * fatorial_recursivo(n - 1)

# Exemplo de uso
print(fatorial_recursivo(5))  # Saída: 120
\`\`\`

### Principais diferenças:

- **Iterativa**: Usa um loop \`for\`, mais eficiente em termos de memória
- **Recursiva**: Mais elegante, mas pode causar *stack overflow* para números grandes

> 💡 **Dica**: Para valores grandes, prefira a versão iterativa ou use \`math.factorial()\`

Você também pode importar direto do módulo \`math\`:

\`\`\`python
import math
resultado = math.factorial(5)
\`\`\``,
      model: "ChatGPT 4.1",
    },
    {
      id: "3",
      role: "user",
      content: "E como ficaria em JavaScript?",
    },
    {
      id: "4",
      role: "assistant",
      content: `Em **JavaScript**, ficaria bem similar! Aqui estão as duas versões:

## Versão com Arrow Function

\`\`\`javascript
const fatorial = (n) => {
  if (n < 0) return null;
  if (n === 0 || n === 1) return 1;
  
  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
};

console.log(fatorial(5)); // 120
\`\`\`

## Versão Recursiva

\`\`\`javascript
const fatorialRecursivo = (n) => {
  if (n < 0) return null;
  if (n === 0 || n === 1) return 1;
  return n * fatorialRecursivo(n - 1);
};

console.log(fatorialRecursivo(5)); // 120
\`\`\`

### Características do JavaScript:

1. Usa \`const\` para declarar funções
2. Arrow functions (\`=>\`) são mais concisas
3. Operador \`===\` para comparação estrita
4. \`let\` para variáveis que mudam de valor

Você também pode usar **reduce** para uma solução funcional:

\`\`\`javascript
const fatorialFuncional = (n) => 
  n < 0 ? null : 
  [...Array(n).keys()]
    .map(i => i + 1)
    .reduce((acc, val) => acc * val, 1);
\`\`\`

Qual versão você prefere? 🚀`,
      model: "ChatGPT 4.1",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Olá! Sou o assistente HGTX Codex. Como posso ajudá-lo hoje?",
        model: selectedModel,
      },
    ]);
  };

  const handleSendMessage = (content: string, files?: File[]) => {
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

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          `Resposta com base na personalidade: "${systemPrompt}". Esta é uma resposta simulada que considera as instruções de sistema definidas.`,
        model: selectedModel,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full pb-16 md:pb-0">
      {/* Chat Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <ChatSidebar 
          isCollapsed={isChatSidebarCollapsed}
          onToggleCollapse={() => setIsChatSidebarCollapsed(!isChatSidebarCollapsed)}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full">
        <ChatHeader 
          showModelSelector={true}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
        />

        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto px-2 md:px-4">
            {messages.map((message) => (
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

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};
