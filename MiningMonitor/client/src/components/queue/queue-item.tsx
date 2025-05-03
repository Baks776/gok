import { Card } from "@/components/ui/card";
import { Clock, Archive, Truck, Scale } from "lucide-react";

interface QueueItemProps {
  position: number;
  item: {
    id: number;
    company: string;
    truckId: string;
    arrivalTime: string;
    status: string;
    quantity: number;
    inventoryItem: {
      name: string;
    };
  };
}

export default function QueueItem({ position, item }: QueueItemProps) {
  const formatTime = (timestamp: string) => {
    if (!timestamp) return "Н/Д";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'loading':
        return (
          <span className="text-xs font-medium bg-success text-white px-2 py-1 rounded-full">
            Загрузка
          </span>
        );
      case 'waiting':
        return (
          <span className="text-xs font-medium bg-warning text-black px-2 py-1 rounded-full">
            Ожидание
          </span>
        );
      case 'completed':
        return (
          <span className="text-xs font-medium bg-secondary text-white px-2 py-1 rounded-full">
            Завершено
          </span>
        );
      default:
        return (
          <span className="text-xs font-medium bg-muted text-secondary px-2 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  // Перевод названий материалов на русский язык
  const translateMaterialName = (name: string) => {
    const translations: Record<string, string> = {
      '5-10mm Crushed Stone': 'Щебень 5-10мм',
      '10-20mm Crushed Stone': 'Щебень 10-20мм',
      '20-40mm Crushed Stone': 'Щебень 20-40мм',
      '40-70mm Crushed Stone': 'Щебень 40-70мм',
      'Sand': 'Песок',
      'Granite Chips': 'Гранитная крошка'
    };
    
    return translations[name] || name;
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm p-4 flex">
      <div className="bg-secondary rounded-full w-12 h-12 flex items-center justify-center text-white font-bold mr-3">
        {position}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.company}</h3>
          {getStatusBadge(item.status)}
        </div>
        
        <div className="flex text-sm text-secondary mt-1">
          <div className="mr-4 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Прибыл: {formatTime(item.arrivalTime)}
          </div>
          <div className="flex items-center">
            <Archive className="h-3 w-3 mr-1" />
            {item.inventoryItem?.name ? translateMaterialName(item.inventoryItem.name) : 'Неизвестный продукт'}
          </div>
        </div>
        
        <div className="flex text-sm text-secondary mt-1">
          <div className="mr-4 flex items-center">
            <Truck className="h-3 w-3 mr-1" />
            ID грузовика: {item.truckId}
          </div>
          <div className="flex items-center">
            <Scale className="h-3 w-3 mr-1" />
            {Number(item.quantity).toLocaleString()} тонн
          </div>
        </div>
      </div>
    </Card>
  );
}
