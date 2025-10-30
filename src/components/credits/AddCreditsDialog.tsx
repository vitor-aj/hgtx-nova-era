import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Smartphone, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const creditPackages = [
  { value: 50, bonus: 0, label: "$50" },
  { value: 100, bonus: 10, label: "$100", popular: true },
  { value: 200, bonus: 30, label: "$200" },
  { value: 500, bonus: 100, label: "$500" },
];

export const AddCreditsDialog = ({ open, onOpenChange }: AddCreditsDialogProps) => {
  const [selectedPackage, setSelectedPackage] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix">("card");

  const handlePurchase = () => {
    const pkg = creditPackages.find((p) => p.value === selectedPackage);
    const totalAmount = pkg ? pkg.value + pkg.bonus : selectedPackage;

    toast({
      title: "Compra realizada com sucesso!",
      description: `${totalAmount} créditos foram adicionados à sua conta usando ${
        paymentMethod === "card" ? "Cartão de Crédito" : "PIX"
      }.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">
            Adicionar Créditos
          </DialogTitle>
          <DialogDescription>
            Escolha o valor de créditos e a forma de pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Package Selection */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Escolha o valor</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {creditPackages.map((pkg) => {
                const isSelected = selectedPackage === pkg.value;
                return (
                  <Card
                    key={pkg.value}
                    className={`cursor-pointer transition-all hover:scale-105 relative ${
                      isSelected
                        ? "border-primary cyber-border bg-primary/5"
                        : "border-border/50 hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPackage(pkg.value)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                    <CardContent className="p-4 text-center space-y-2">
                      <div className="text-2xl font-bold gradient-text">
                        {pkg.label}
                      </div>
                      {pkg.bonus > 0 && (
                        <div className="text-xs text-primary font-semibold">
                          +${pkg.bonus} bônus
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Total: ${pkg.value + pkg.bonus}
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Forma de pagamento</h3>
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
          </div>

          {/* Summary */}
          <Card className="glass-effect border-border/50">
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor selecionado</span>
                <span className="font-semibold">${selectedPackage}</span>
              </div>
              {creditPackages.find((p) => p.value === selectedPackage)?.bonus ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bônus</span>
                  <span className="font-semibold text-primary">
                    +$
                    {creditPackages.find((p) => p.value === selectedPackage)?.bonus}
                  </span>
                </div>
              ) : null}
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold">Total de créditos</span>
                <span className="text-xl font-bold gradient-text">
                  $
                  {selectedPackage +
                    (creditPackages.find((p) => p.value === selectedPackage)
                      ?.bonus || 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePurchase} className="cyber-glow">
              Confirmar Compra
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
