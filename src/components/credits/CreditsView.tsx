import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Plus, Zap, DollarSign, Activity, TrendingUp } from "lucide-react";
import { AddCreditsDialog } from "./AddCreditsDialog";
import { PeriodFilter } from "./PeriodFilter";
import { subDays, subYears, isAfter, isBefore, isToday, startOfDay, endOfDay } from "date-fns";

// Mock data com datas
const mockConsumptionData = [
  { month: "Jan", date: new Date(2025, 0, 1), requisicoes: 1200, tokens: 450000, custo: 45.5 },
  { month: "Fev", date: new Date(2025, 1, 1), requisicoes: 1500, tokens: 520000, custo: 52.3 },
  { month: "Mar", date: new Date(2025, 2, 1), requisicoes: 1800, tokens: 680000, custo: 68.9 },
  { month: "Abr", date: new Date(2025, 3, 1), requisicoes: 2100, tokens: 750000, custo: 75.2 },
  { month: "Mai", date: new Date(2025, 4, 1), requisicoes: 2400, tokens: 820000, custo: 82.5 },
  { month: "Jun", date: new Date(2025, 5, 1), requisicoes: 2800, tokens: 950000, custo: 95.8 },
  { month: "Jul", date: new Date(2025, 6, 1), requisicoes: 3100, tokens: 1050000, custo: 105.2 },
  { month: "Ago", date: new Date(2025, 7, 1), requisicoes: 2900, tokens: 980000, custo: 98.5 },
  { month: "Set", date: new Date(2025, 8, 1), requisicoes: 3200, tokens: 1120000, custo: 112.8 },
  { month: "Out", date: new Date(2025, 9, 1), requisicoes: 3500, tokens: 1250000, custo: 125.3 },
];

const mockTopUsers = [
  { position: 1, user: "João Silva", requisicoes: 450, tokens: 185000, custo: 18.5 },
  { position: 2, user: "Maria Santos", requisicoes: 420, tokens: 172000, custo: 17.2 },
  { position: 3, user: "Pedro Costa", requisicoes: 390, tokens: 158000, custo: 15.8 },
  { position: 4, user: "Ana Oliveira", requisicoes: 350, tokens: 142000, custo: 14.2 },
  { position: 5, user: "Carlos Lima", requisicoes: 320, tokens: 135000, custo: 13.5 },
  { position: 6, user: "Beatriz Souza", requisicoes: 290, tokens: 118000, custo: 11.8 },
  { position: 7, user: "Rafael Alves", requisicoes: 275, tokens: 105000, custo: 10.5 },
  { position: 8, user: "Juliana Rocha", requisicoes: 250, tokens: 98000, custo: 9.8 },
];

const chartConfig = {
  requisicoes: {
    label: "Requisições",
    color: "hsl(var(--primary))",
  },
  tokens: {
    label: "Tokens (k)",
    color: "hsl(var(--secondary))",
  },
  custo: {
    label: "Custo (USD)",
    color: "hsl(var(--accent))",
  },
};

export const CreditsView = () => {
  const [isAddCreditsOpen, setIsAddCreditsOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("30days");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // Função para verificar se uma data está dentro do período filtrado
  const isDateInRange = (date: Date) => {
    const today = new Date();
    
    switch (filterType) {
      case "today":
        return isToday(date);
      case "7days":
        return isAfter(date, subDays(today, 7)) && isBefore(date, today);
      case "30days":
        return isAfter(date, subDays(today, 30)) && isBefore(date, today);
      case "year":
        return isAfter(date, subYears(today, 1)) && isBefore(date, today);
      case "custom":
        if (!filterStartDate || !filterEndDate) return true;
        return (
          isAfter(date, startOfDay(filterStartDate)) && 
          isBefore(date, endOfDay(filterEndDate))
        );
      default:
        return true;
    }
  };

  // Filtrar dados do gráfico
  const filteredConsumptionData = useMemo(() => {
    if (filterType === "none") return mockConsumptionData;
    return mockConsumptionData.filter(item => isDateInRange(item.date));
  }, [filterType, filterStartDate, filterEndDate]);

  // Calcular estatísticas baseadas nos dados filtrados
  const currentStats = useMemo(() => {
    const stats = filteredConsumptionData.reduce(
      (acc, item) => ({
        requisicoes: acc.requisicoes + item.requisicoes,
        tokensProcessados: acc.tokensProcessados + item.tokens,
        custoTotal: acc.custoTotal + item.custo,
      }),
      { requisicoes: 0, tokensProcessados: 0, custoTotal: 0 }
    );

    return {
      ...stats,
      limiteAtual: stats.custoTotal,
      limiteMaximo: 200,
    };
  }, [filteredConsumptionData]);

  const percentualLimite = (currentStats.limiteAtual / currentStats.limiteMaximo) * 100;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Créditos</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe seu consumo e gerencie seus créditos
            </p>
          </div>
          <Button
            onClick={() => setIsAddCreditsOpen(true)}
            className="cyber-glow gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Créditos
          </Button>
        </div>
        
        <div className="flex justify-end">
          <PeriodFilter
            onFilterChange={(filter, startDate, endDate) => {
              setFilterType(filter);
              setFilterStartDate(startDate);
              setFilterEndDate(endDate);
            }}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect border-border/50 hover:border-primary/30 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Requisições ao Codex
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">
              {currentStats.requisicoes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Mês atual</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-primary/30 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-secondary" />
              Tokens Processados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">
              {(currentStats.tokensProcessados / 1000).toFixed(0)}k
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentStats.tokensProcessados.toLocaleString()} tokens
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-primary/30 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" />
              Custo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">
              ${currentStats.custoTotal.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">USD no mês</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-border/50 hover:border-primary/30 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Limite Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold gradient-text">
                ${currentStats.limiteAtual.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                / ${currentStats.limiteMaximo}
              </span>
            </div>
            <div className="space-y-2">
              <Progress value={percentualLimite} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {percentualLimite.toFixed(1)}% utilizado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consumption Chart */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Histórico de Consumo</CardTitle>
          <CardDescription>
            Acompanhe a evolução do seu consumo nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  yAxisId="left"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  label={{ value: "Requisições / Tokens (k)", angle: -90, position: "insideLeft" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  label={{ value: "Custo (USD)", angle: 90, position: "insideRight" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="requisicoes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Requisições"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tokens"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--secondary))", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Tokens (k)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="custo"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))", r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Custo (USD)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Users Table */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Top Usuários por Consumo</CardTitle>
          <CardDescription>
            Ranking dos usuários com maior consumo no mês atual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-20 font-semibold">Posição</TableHead>
                  <TableHead className="font-semibold">Usuário</TableHead>
                  <TableHead className="text-right font-semibold">Requisições</TableHead>
                  <TableHead className="text-right font-semibold">Tokens</TableHead>
                  <TableHead className="text-right font-semibold">Custo (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTopUsers.map((user) => (
                  <TableRow
                    key={user.position}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          user.position === 1
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950"
                            : user.position === 2
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900"
                            : user.position === 3
                            ? "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950"
                            : "bg-muted text-muted-foreground"
                        } font-bold text-sm`}
                      >
                        {user.position}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.user}</TableCell>
                    <TableCell className="text-right">
                      {user.requisicoes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.tokens.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      ${user.custo.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="glass-effect border-border/50">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              💡 <span className="font-medium text-foreground">Sobre o Codex:</span> A API Codex da OpenAI transforma linguagem natural em código, permitindo automação e geração inteligente de código em múltiplas linguagens.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              ⚡ <span className="font-medium text-foreground">Custos:</span> Os valores são calculados com base no número de tokens processados. Monitoramento ativo ajuda a evitar gastos inesperados.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              🔔 <span className="font-medium text-foreground">Alertas:</span> Você será notificado automaticamente ao atingir 75%, 90% e 100% do limite configurado.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Add Credits Dialog */}
      <AddCreditsDialog
        open={isAddCreditsOpen}
        onOpenChange={setIsAddCreditsOpen}
      />
    </div>
  );
};
