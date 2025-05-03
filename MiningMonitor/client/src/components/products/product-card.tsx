import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    available: boolean;
    imageUrl: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  
  const handleOrderClick = () => {
    // Scroll to order form
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
      orderForm.scrollIntoView({ behavior: 'smooth' });
      
      // Pre-select this product in the dropdown
      const productSelect = document.getElementById('product') as HTMLSelectElement;
      if (productSelect) {
        productSelect.value = String(product.id);
      }
      
      toast({
        title: "Продукт выбран",
        description: `${translateProductName(product.name)} выбран в форме заказа.`,
      });
    }
  };

  // Перевод названий продуктов на русский язык
  const translateProductName = (name: string) => {
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

  // Перевод описаний продуктов на русский язык
  const translateProductDescription = (description: string) => {
    const translations: Record<string, string> = {
      'Ideal for concrete mixes and drainage applications': 'Идеален для бетонных смесей и дренажных систем',
      'Perfect for construction projects and landscaping': 'Отлично подходит для строительных проектов и ландшафтного дизайна',
      'Great for road construction and heavy-duty applications': 'Идеален для дорожного строительства и тяжелых работ',
      'Suitable for gabion baskets and drainage systems': 'Подходит для габионных конструкций и дренажных систем',
      'High-quality sand for construction and landscaping': 'Высококачественный песок для строительства и ландшафтного дизайна',
      'Premium decorative stone for landscaping projects': 'Премиальный декоративный камень для ландшафтных проектов'
    };
    
    return translations[description] || description;
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 h-40 bg-gray-200 relative">
        <img 
          src={product.imageUrl} 
          alt={translateProductName(product.name)} 
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-2 right-2 ${product.available ? 'bg-secondary' : 'bg-warning'} ${product.available ? 'text-white' : 'text-black'} text-xs px-2 py-1 rounded-md`}>
          {product.available ? 'В наличии' : 'Заканчивается'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium">{translateProductName(product.name)}</h3>
        <p className="text-secondary text-sm mt-1">{translateProductDescription(product.description)}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <div>
            <span className="text-xs text-secondary">Цена от</span>
            <p className="font-medium">{Number(product.price).toFixed(2)} ₽/тонна</p>
          </div>
          <Button 
            className="bg-accent text-white px-3 py-1.5 rounded-lg text-sm font-medium"
            onClick={handleOrderClick}
          >
            Заказать
          </Button>
        </div>
      </div>
    </Card>
  );
}
