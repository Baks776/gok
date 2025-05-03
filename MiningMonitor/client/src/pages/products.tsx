import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/products/product-card";
import OrderForm from "@/components/products/order-form";

// Определение типов для данных API
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl: string;
  inventoryItemId: number;
  inventoryItem?: {
    name: string;
    currentAmount: number;
  };
}

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  return (
    <div className="px-4 py-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Продукты</h1>
          <p className="text-secondary text-sm">Доступные материалы</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 gap-4 mb-8">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white animate-pulse rounded-lg shadow-sm p-4 h-64" />
          ))
        ) : products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center py-8 text-secondary">
            Продукты не найдены
          </div>
        )}
      </div>
      
      <OrderForm products={products || []} />
    </div>
  );
}
