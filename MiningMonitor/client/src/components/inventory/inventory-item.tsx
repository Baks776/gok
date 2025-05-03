import { Card } from "@/components/ui/card";

interface InventoryItemProps {
  item: {
    id: number;
    name: string;
    currentAmount: number;
    capacity: number;
  };
}

export default function InventoryItem({ item }: InventoryItemProps) {
  const percentage = Math.round((Number(item.currentAmount) / Number(item.capacity)) * 100);
  
  const getColorForPercentage = (percent: number) => {
    if (percent >= 60) return 'bg-secondary';
    if (percent >= 25) return 'bg-warning';
    return 'bg-accent';
  };
  
  const getTextColorForPercentage = (percent: number) => {
    if (percent >= 60) return 'text-secondary';
    if (percent >= 25) return 'text-warning';
    return 'text-accent';
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
    <Card className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{translateMaterialName(item.name)}</h3>
        <span className={`text-sm font-medium ${getTextColorForPercentage(percentage)}`}>
          {percentage}%
        </span>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`progress-bar h-full ${getColorForPercentage(percentage)} rounded-full`}
          style={{ "--progress-value": `${percentage}%` } as React.CSSProperties}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-secondary mt-2">
        <span>Примерно {Number(item.currentAmount).toLocaleString()} тонн</span>
        <span>Вместимость: {Number(item.capacity).toLocaleString()} тонн</span>
      </div>
    </Card>
  );
}
