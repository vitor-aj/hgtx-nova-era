import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Smartphone, Check, ArrowLeft, Copy, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import InputMask from "react-input-mask";
import { z } from "zod";

interface AddCreditsViewProps {
  onBack: () => void;
  onManageCards: () => void;
}

const creditPackages = [
  { value: 10, label: "$10" },
  { value: 20, label: "$20" },
  { value: 30, label: "$30" },
  { value: 40, label: "$40" },
  { value: 50, label: "$50" },
  { value: 100, label: "$100" },
  { value: 500, label: "$500" },
];

const mockSavedCards = [
  { id: 1, brand: "Visa", lastFour: "4532", expiryDate: "12/2025", holder: "João Silva" },
  { id: 2, brand: "Mastercard", lastFour: "5412", expiryDate: "08/2026", holder: "João Silva" },
];

const cardSchema = z.object({
  cardHolder: z.string().min(3, "Nome do titular deve ter no mínimo 3 caracteres").max(100, "Nome muito longo"),
  cardNumber: z.string().regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Número do cartão inválido"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Data de validade inválida"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
});

export const AddCreditsView = ({ onBack, onManageCards }: AddCreditsViewProps) => {
  const [selectedPackage, setSelectedPackage] = useState(50);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSavedCardId, setSelectedSavedCardId] = useState<number | null>(
    mockSavedCards.length > 0 ? mockSavedCards[0].id : null
  );

  // PIX state
  const [pixCode, setPixCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [pixGenerated, setPixGenerated] = useState(false);

  // PIX Timer
  useEffect(() => {
    if (pixGenerated && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [pixGenerated, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const generatePixCode = () => {
    // Simulate PIX code generation
    const code = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15)}52040000530398654${selectedPackage.toFixed(2)}5802BR5925HGTX CODEX SYSTEM6009SAO PAULO62070503***6304`;
    setPixCode(code);
    setPixGenerated(true);
    setTimeRemaining(600);
  };

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: "Código copiado!",
      description: "O código PIX foi copiado para a área de transferência.",
    });
  };

  const handleCardPayment = async () => {
    if (!selectedSavedCardId) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um cartão.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Pagamento aprovado!",
        description: `$${selectedPackage} foram adicionados à sua conta.`,
      });
      setIsProcessing(false);
      onBack();
    }, 2000);
  };

  const handlePixPayment = () => {
    if (!pixGenerated) {
      generatePixCode();
    } else {
      toast({
        title: "Aguardando pagamento",
        description: "Assim que o pagamento for confirmado, os créditos serão adicionados automaticamente.",
      });
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
          className="h-10 w-10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Adicionar Créditos</h1>
          <p className="text-muted-foreground mt-1">
            Escolha o valor e a forma de pagamento
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Package Selection */}
        <Card className="glass-effect border-border/50">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Escolha o valor</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {creditPackages.map((pkg) => {
                const isSelected = selectedPackage === pkg.value;
                return (
                  <Card
                    key={pkg.value}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      isSelected
                        ? "border-primary cyber-border bg-primary/5"
                        : "border-border/50 hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPackage(pkg.value)}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <div className="text-2xl font-bold gradient-text">
                        {pkg.label}
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="glass-effect border-border/50">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Forma de pagamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-all hover:scale-105 ${
                  paymentMethod === "card"
                    ? "border-primary cyber-border bg-primary/5"
                    : "border-border/50 hover:border-primary/50"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentMethod === "card"
                        ? "bg-gradient-to-br from-primary to-secondary"
                        : "bg-muted"
                    }`}
                  >
                    <CreditCard
                      className={`w-6 h-6 ${
                        paymentMethod === "card"
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Cartão de Crédito</div>
                    <div className="text-xs text-muted-foreground">
                      Aprovação instantânea
                    </div>
                  </div>
                  {paymentMethod === "card" && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:scale-105 ${
                  paymentMethod === "pix"
                    ? "border-primary cyber-border bg-primary/5"
                    : "border-border/50 hover:border-primary/50"
                }`}
                onClick={() => setPaymentMethod("pix")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paymentMethod === "pix"
                        ? "bg-gradient-to-br from-primary to-secondary"
                        : "bg-muted"
                    }`}
                  >
                    <Smartphone
                      className={`w-6 h-6 ${
                        paymentMethod === "pix"
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">PIX</div>
                    <div className="text-xs text-muted-foreground">
                      Pagamento via QR Code
                    </div>
                  </div>
                  {paymentMethod === "pix" && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        {paymentMethod === "card" ? (
          <Card className="glass-effect border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Selecione o cartão</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onManageCards}
                  className="gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Cadastrar novo cartão
                </Button>
              </div>

              {mockSavedCards.length > 0 ? (
                <div className="space-y-3">
                  <Label htmlFor="savedCard">Cartão de Crédito</Label>
                  <Select 
                    value={selectedSavedCardId?.toString()} 
                    onValueChange={(value) => setSelectedSavedCardId(parseInt(value))}
                  >
                    <SelectTrigger id="savedCard">
                      <SelectValue placeholder="Selecione um cartão" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSavedCards.map((card) => (
                        <SelectItem key={card.id} value={card.id.toString()}>
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-4 h-4" />
                            <span>
                              {card.brand} •••• {card.lastFour} - {card.holder}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <p className="text-muted-foreground">
                    Nenhum cartão cadastrado
                  </p>
                  <Button
                    variant="outline"
                    onClick={onManageCards}
                    className="gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Cadastrar cartão
                  </Button>
                </div>
              )}

              {mockSavedCards.length > 0 && (
                <div className="pt-4">
                  <Button
                    onClick={handleCardPayment}
                    disabled={isProcessing}
                    className="w-full cyber-glow"
                    size="lg"
                  >
                    {isProcessing ? "Processando..." : `Pagar $${selectedPackage}`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-effect border-border/50">
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Pagamento via PIX</h3>
                {!pixGenerated ? (
                  <p className="text-sm text-muted-foreground">
                    Clique no botão abaixo para gerar o código PIX
                  </p>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono text-lg font-bold">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}
              </div>

              {pixGenerated && (
                <>
                  <div className="flex justify-center p-6 bg-white rounded-lg">
                    <QRCode value={pixCode} size={200} />
                  </div>

                  <div className="space-y-3">
                    <Label>Código PIX Copia e Cola</Label>
                    <div className="flex gap-2">
                      <Input
                        value={pixCode}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyPixCode}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Escaneie o QR Code ou copie o código acima</p>
                    <p>Os créditos serão adicionados automaticamente após a confirmação</p>
                  </div>
                </>
              )}

              <Button
                onClick={handlePixPayment}
                className="w-full cyber-glow"
                size="lg"
              >
                {pixGenerated ? "Aguardando Pagamento..." : `Gerar PIX de $${selectedPackage}`}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card className="glass-effect border-border/50 sticky bottom-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold gradient-text">${selectedPackage}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Créditos a receber</p>
                <p className="text-2xl font-semibold">${selectedPackage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
