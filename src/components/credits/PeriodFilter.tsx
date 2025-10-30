import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type FilterOption = "none" | "today" | "7days" | "30days" | "year" | "custom";

interface PeriodFilterProps {
  onFilterChange?: (filter: FilterOption, startDate?: Date, endDate?: Date) => void;
}

export const PeriodFilter = ({ onFilterChange }: PeriodFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("30days");
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const filterOptions = [
    { value: "none" as FilterOption, label: "Sem filtro" },
    { value: "today" as FilterOption, label: "Hoje" },
    { value: "7days" as FilterOption, label: "Últimos 7 dias" },
    { value: "30days" as FilterOption, label: "Últimos 30 dias" },
    { value: "year" as FilterOption, label: "Último ano" },
    { value: "custom" as FilterOption, label: "Personalizado" },
  ];

  const handleFilterSelect = (filter: FilterOption) => {
    setSelectedFilter(filter);
    
    if (filter === "custom") {
      setShowCustomDates(true);
    } else {
      setShowCustomDates(false);
      setIsOpen(false);
      onFilterChange?.(filter);
    }
  };

  const handleApplyCustomDates = () => {
    if (startDate && endDate) {
      onFilterChange?.("custom", startDate, endDate);
      setIsOpen(false);
      setShowCustomDates(false);
    }
  };

  const getFilterLabel = () => {
    if (selectedFilter === "custom" && startDate && endDate) {
      return `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`;
    }
    return filterOptions.find((opt) => opt.value === selectedFilter)?.label || "Sem filtro";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filtrar período:</span>
          <span className="font-semibold">{getFilterLabel()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {!showCustomDates ? (
          <div className="p-2 space-y-1 min-w-[200px]">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterSelect(option.value)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                  selectedFilter === option.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted"
                )}
              >
                <span>{option.label}</span>
                {selectedFilter === option.value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-none">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Inicial</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data Final</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => startDate ? date < startDate : false}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowCustomDates(false);
                    setStartDate(undefined);
                    setEndDate(undefined);
                  }}
                >
                  Voltar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleApplyCustomDates}
                  disabled={!startDate || !endDate}
                >
                  Aplicar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </PopoverContent>
    </Popover>
  );
};
