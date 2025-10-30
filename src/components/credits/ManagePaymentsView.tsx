import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Trash2, Shield, Plus } from "lucide-react";
import { format } from "date-fns";
import InputMask from "react-input-mask";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Mock data para cartões salvos
const mockSavedCards = [
  { id: 1, brand: "Visa", lastFour: "4532", expiryDate: "12/2025", holder: "João Silva" },
  { id: 2, brand: "Mastercard", lastFour: "5412", expiryDate: "08/2026", holder: "João Silva" },
];

// Mock data para histórico de pagamentos
const mockPaymentHistory = [
  { 
    id: 1, 
    date: new Date(2025, 9, 15), 
    description: "Recarga de créditos - $50", 
    card: "**** 4532", 
    amount: 50, 
    status: "approved" 
  },
  { 
    id: 2, 
    date: new Date(2025, 9, 10), 
    description: "Recarga de créditos - $100", 
    card: "**** 5412", 
    amount: 100, 
    status: "approved" 
  },
  { 
    id: 3, 
    date: new Date(2025, 9, 5), 
    description: "Recarga de créditos - $20", 
    card: "**** 4532", 
    amount: 20, 
    status: "pending" 
  },
  { 
    id: 4, 
    date: new Date(2025, 8, 28), 
    description: "Recarga de créditos - $30", 
    card: "**** 5412", 
    amount: 30, 
    status: "approved" 
  },
  { 
    id: 5, 
    date: new Date(2025, 8, 20), 
    description: "Recarga de créditos - $10", 
    card: "**** 4532", 
    amount: 10, 
    status: "failed" 
  },
];

interface ManagePaymentsViewProps {
  onBack: () => void;
}

const cardSchema = z.object({
  cardHolder: z.string().min(3, "Nome muito curto"),
  cardNumber: z.string().min(19, "Número do cartão inválido"),
  cvv: z.string().min(3, "CVV inválido"),
  expiryDate: z.string().min(7, "Data de validade inválida"),
  cpf: z.string().min(14, "CPF inválido"),
});

export const ManagePaymentsView = ({ onBack }: ManagePaymentsViewProps) => {
  const [savedCards, setSavedCards] = useState(mockSavedCards);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cardData, setCardData] = useState({
    cardHolder: "",
    cardNumber: "",
    cvv: "",
    expiryDate: "",
    cpf: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleDeleteCard = (cardId: number) => {
    setSavedCards(savedCards.filter(card => card.id !== cardId));
  };

  const handleAddCard = () => {
    try {
      cardSchema.parse(cardData);
      setErrors({});

      // Determinar a bandeira do cartão pelo primeiro dígito
      const firstDigit = cardData.cardNumber.replace(/\s/g, "")[0];
      let brand = "Visa";
      if (firstDigit === "5") brand = "Mastercard";
      if (firstDigit === "3") brand = "Amex";

      const newCard = {
        id: savedCards.length + 1,
        brand,
        lastFour: cardData.cardNumber.slice(-4),
        expiryDate: cardData.expiryDate,
        holder: cardData.cardHolder,
      };

      setSavedCards([...savedCards, newCard]);
      setIsAddCardOpen(false);
      setCardData({
        cardHolder: "",
        cardNumber: "",
        cvv: "",
        expiryDate: "",
        cpf: "",
      });

      toast({
        title: "Cartão adicionado",
        description: "Seu cartão foi cadastrado com sucesso.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Aprovado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pendente</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Falhou</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCardBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "from-blue-500 to-blue-700";
      case "mastercard":
        return "from-orange-500 to-red-600";
      case "amex":
        return "from-blue-400 to-blue-600";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Gerenciar Pagamentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus cartões e visualize o histórico de transações
          </p>
        </div>
      </div>

      {/* Security Alert */}
      <Alert className="glass-effect border-primary/20 bg-primary/5">
        <Shield className="h-5 w-5 text-primary" />
        <AlertDescription className="ml-2">
          <span className="font-semibold text-foreground">Pagamentos 100% Seguros</span>
          <br />
          <span className="text-sm text-muted-foreground">
            Todos os dados são criptografados com TLS 1.3 e armazenados de acordo com os padrões PCI-DSS. 
            Nunca armazenamos o CVV do seu cartão.
          </span>
        </AlertDescription>
      </Alert>

      {/* Saved Cards Section */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Meus Cartões</CardTitle>
              <CardDescription>
                Gerencie seus cartões de crédito salvos
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAddCardOpen(true)}
              className="cyber-glow gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Cartão
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCards.map((card) => (
              <div
                key={card.id}
                className={`relative p-6 rounded-xl bg-gradient-to-br ${getCardBrandColor(card.brand)} text-white shadow-lg`}
              >
                <div className="flex justify-between items-start mb-8">
                  <CreditCard className="w-8 h-8 opacity-80" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCard(card.id)}
                    className="hover:bg-white/20 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="text-2xl font-bold tracking-wider">
                    •••• •••• •••• {card.lastFour}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-70 uppercase">Titular</p>
                      <p className="font-medium">{card.holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-70 uppercase">Validade</p>
                      <p className="font-medium">{card.expiryDate}</p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold uppercase tracking-wide">
                    {card.brand}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {savedCards.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum cartão cadastrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History Table */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Histórico de Pagamentos</CardTitle>
          <CardDescription>
            Acompanhe todas as suas transações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Descrição</TableHead>
                  <TableHead className="font-semibold">Cartão</TableHead>
                  <TableHead className="text-right font-semibold">Valor</TableHead>
                  <TableHead className="text-right font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPaymentHistory.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {format(payment.date, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        {payment.card}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      ${payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {getStatusBadge(payment.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Card Dialog */}
      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cartão</DialogTitle>
            <DialogDescription>
              Preencha os dados do seu cartão de crédito
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Nome do Titular</Label>
              <Input
                id="cardHolder"
                placeholder="Nome impresso no cartão"
                value={cardData.cardHolder}
                onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value })}
                className={errors.cardHolder ? "border-red-500" : ""}
              />
              {errors.cardHolder && (
                <p className="text-sm text-red-500">{errors.cardHolder}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <InputMask
                mask="9999 9999 9999 9999"
                value={cardData.cardNumber}
                onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
              >
                {/* @ts-ignore */}
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                )}
              </InputMask>
              {errors.cardNumber && (
                <p className="text-sm text-red-500">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Data de Validade</Label>
                <InputMask
                  mask="99/9999"
                  value={cardData.expiryDate}
                  onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                >
                  {/* @ts-ignore */}
                  {(inputProps) => (
                    <Input
                      {...inputProps}
                      id="expiryDate"
                      placeholder="MM/AAAA"
                      className={errors.expiryDate ? "border-red-500" : ""}
                    />
                  )}
                </InputMask>
                {errors.expiryDate && (
                  <p className="text-sm text-red-500">{errors.expiryDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <InputMask
                  mask="999"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                >
                  {/* @ts-ignore */}
                  {(inputProps) => (
                    <Input
                      {...inputProps}
                      id="cvv"
                      placeholder="000"
                      type="password"
                      className={errors.cvv ? "border-red-500" : ""}
                    />
                  )}
                </InputMask>
                {errors.cvv && (
                  <p className="text-sm text-red-500">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF do Titular</Label>
              <InputMask
                mask="999.999.999-99"
                value={cardData.cpf}
                onChange={(e) => setCardData({ ...cardData, cpf: e.target.value })}
              >
                {/* @ts-ignore */}
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    id="cpf"
                    placeholder="000.000.000-00"
                    className={errors.cpf ? "border-red-500" : ""}
                  />
                )}
              </InputMask>
              {errors.cpf && (
                <p className="text-sm text-red-500">{errors.cpf}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCard} className="cyber-glow">
              Adicionar Cartão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
