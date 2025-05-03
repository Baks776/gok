import { useQuery } from "@tanstack/react-query";
import StatusOverview from "@/components/inventory/status-overview";
import InventoryItem from "@/components/inventory/inventory-item";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Определение типов для данных API
interface SystemStatusData {
  status: string;
  currentQueueCount: number;
  estimatedWaitTime: number;
  dailyProduction: number;
  temperature: number;
  lastUpdated?: string;
}

interface InventoryItemData {
  id: number;
  name: string;
  currentAmount: number;
  capacity: number;
}

export default function InventoryPage() {
  const { toast } = useToast();
  
  const { data: statusData, isLoading: statusLoading } = useQuery<SystemStatusData>({
    queryKey: ['/api/system-status'],
  });
  
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery<InventoryItemData[]>({
    queryKey: ['/api/inventory'],
  });
  
  const refreshInventory = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
    queryClient.invalidateQueries({ queryKey: ['/api/system-status'] });
    toast({
      title: "Обновлено",
      description: "Данные запасов были обновлены",
    });
  };

  const formatLastUpdatedTime = (timestamp: string) => {
    if (!timestamp) return "Н/Д";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const lastUpdated = statusData?.lastUpdated 
    ? formatLastUpdatedTime(statusData.lastUpdated) 
    : "Н/Д";

  const statusDataDefault: SystemStatusData = {
    status: "Неизвестно",
    currentQueueCount: 0,
    estimatedWaitTime: 0,
    dailyProduction: 0,
    temperature: 0
  };

  return (
    <div className="px-4 py-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Монитор запасов</h1>
          <p className="text-secondary text-sm">Обзор в реальном времени</p>
        </div>
        <div className="flex items-center gap-2">
          {!navigator.onLine && (
            <div className="bg-warning text-primary px-2 py-1 rounded-md text-xs font-medium">
              Офлайн-режим
            </div>
          )}
        </div>
      </header>

      <StatusOverview 
        isLoading={statusLoading} 
        data={statusData || statusDataDefault} 
      />
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Уровни запасов</h2>
          <div className="text-xs text-secondary bg-white px-2 py-1 rounded-full border border-gray-200">
            Обновлено: {lastUpdated}
          </div>
        </div>
        
        {inventoryLoading ? (
          <div className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white animate-pulse rounded-lg shadow-sm p-4 h-24" />
            ))}
          </div>
        ) : (
          <div>
            {inventoryData?.map((item) => (
              <InventoryItem key={item.id} item={item} />
            ))}
          </div>
        )}
        
        <Button
          variant="outline"
          className="w-full py-3 mt-4 bg-muted text-secondary font-medium rounded-lg"
          onClick={refreshInventory}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Обновить данные запасов
        </Button>
      </div>
    </div>
  );
}
