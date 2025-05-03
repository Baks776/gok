import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusOverviewProps {
  isLoading: boolean;
  data: {
    status: string;
    currentQueueCount: number;
    estimatedWaitTime: number;
    dailyProduction: number;
    temperature: number;
  };
}

export default function StatusOverview({ isLoading, data }: StatusOverviewProps) {
  if (isLoading) {
    return (
      <Card className="bg-muted rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </Card>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
      case 'работает':
        return 'bg-success text-white';
      case 'maintenance':
      case 'обслуживание':
        return 'bg-warning text-black';
      case 'issue':
      case 'проблема':
        return 'bg-destructive text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getStatusText = (status: string) => {
    if (!status) return 'Неизвестно';
    
    switch (status.toLowerCase()) {
      case 'operational':
        return 'Работает';
      case 'maintenance':
        return 'Обслуживание';
      case 'issue':
        return 'Проблема';
      default:
        return status;
    }
  };

  return (
    <Card className="bg-muted rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-medium">Статус системы</h2>
        <span className={`${getStatusBadgeClass(data.status)} text-xs px-2 py-1 rounded-full`}>
          {getStatusText(data.status)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-secondary mb-1">Текущая очередь</p>
          <p className="text-xl font-medium">{data.currentQueueCount || 0} грузовиков</p>
        </div>
        <div>
          <p className="text-xs text-secondary mb-1">Примерное время ожидания</p>
          <p className="text-xl font-medium">{data.estimatedWaitTime || 0} мин</p>
        </div>
        <div>
          <p className="text-xs text-secondary mb-1">Производство сегодня</p>
          <p className="text-xl font-medium">
            {typeof data.dailyProduction === 'number' 
              ? data.dailyProduction.toLocaleString() 
              : Number(data.dailyProduction).toLocaleString()} тонн
          </p>
        </div>
        <div>
          <p className="text-xs text-secondary mb-1">Температура</p>
          <p className="text-xl font-medium">
            {data.temperature !== undefined ? `${data.temperature}°C` : 'Н/Д'}
          </p>
        </div>
      </div>
    </Card>
  );
}
