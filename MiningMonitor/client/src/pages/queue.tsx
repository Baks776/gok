import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import QueueItem from "@/components/queue/queue-item";
import { RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

// Определение типов для данных API
interface QueueStats {
  inQueue: number;
  loading: number;
  avgWaitTime: number;
}

interface QueueItem {
  id: number;
  company: string;
  truckId: string;
  arrivalTime: string;
  status: string;
  quantity: number;
  inventoryItem: {
    name: string;
  };
}

export default function QueuePage() {
  const { data: queueData, isLoading: queueLoading } = useQuery<QueueItem[]>({
    queryKey: ['/api/queue'],
  });
  
  const { data: queueStats } = useQuery<QueueStats>({
    queryKey: ['/api/queue/stats'],
  });
  
  const refreshQueue = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/queue'] });
    queryClient.invalidateQueries({ queryKey: ['/api/queue/stats'] });
  };

  return (
    <div className="px-4 py-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Очередь грузовиков</h1>
          <p className="text-secondary text-sm">Текущий статус</p>
        </div>
        <div 
          className="bg-muted p-2 rounded-full cursor-pointer"
          onClick={refreshQueue}
        >
          <RefreshCw className="h-5 w-5 text-secondary" />
        </div>
      </header>
      
      <Card className="bg-muted rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-secondary mb-1">В очереди</p>
            <p className="text-xl font-medium">
              {queueStats?.inQueue || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-1">Загружаются</p>
            <p className="text-xl font-medium">
              {queueStats?.loading || 0}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-1">Среднее ожидание</p>
            <p className="text-xl font-medium">
              {queueStats?.avgWaitTime || 0} мин
            </p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 gap-3">
        {queueLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white animate-pulse rounded-lg shadow-sm p-4 h-32" />
          ))
        ) : queueData && queueData.length > 0 ? (
          queueData.map((item, index) => (
            <QueueItem key={item.id} item={item} position={index + 1} />
          ))
        ) : (
          <div className="text-center py-8 text-secondary">
            Нет грузовиков в очереди
          </div>
        )}
      </div>
    </div>
  );
}
