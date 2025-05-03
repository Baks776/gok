import { Link, useLocation } from "wouter";
import { BarChart2, Truck, FileSliders, Info, Home } from "lucide-react";

interface NavigationProps {
  onMoreClick: () => void;
  isOffline: boolean;
}

export default function Navigation({ onMoreClick, isOffline }: NavigationProps) {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 flex justify-around items-center">
      <Link href="/" className={`flex flex-col items-center justify-center w-1/5 py-1 ${isActive('/') ? 'active-nav-button' : 'inactive-nav-button'}`}>
        <Home className={`${isActive('/') ? 'text-accent' : 'text-secondary'} h-5 w-5`} />
        <span className={`text-xs mt-1 ${isActive('/') ? 'font-medium' : ''}`}>Главная</span>
      </Link>
      
      <Link href="/inventory" className={`flex flex-col items-center justify-center w-1/5 py-1 ${isActive('/inventory') ? 'active-nav-button' : 'inactive-nav-button'}`}>
        <BarChart2 className={`${isActive('/inventory') ? 'text-accent' : 'text-secondary'} h-5 w-5`} />
        <span className={`text-xs mt-1 ${isActive('/inventory') ? 'font-medium' : ''}`}>Запасы</span>
      </Link>
      
      <Link href="/queue" className={`flex flex-col items-center justify-center w-1/5 py-1 ${isActive('/queue') ? 'active-nav-button' : 'inactive-nav-button'}`}>
        <Truck className={`${isActive('/queue') ? 'text-accent' : 'text-secondary'} h-5 w-5`} />
        <span className={`text-xs mt-1 ${isActive('/queue') ? 'font-medium' : ''}`}>Очередь</span>
      </Link>
      
      <Link href="/products" className={`flex flex-col items-center justify-center w-1/5 py-1 ${isActive('/products') ? 'active-nav-button' : 'inactive-nav-button'}`}>
        <FileSliders className={`${isActive('/products') ? 'text-accent' : 'text-secondary'} h-5 w-5`} />
        <span className={`text-xs mt-1 ${isActive('/products') ? 'font-medium' : ''}`}>Продукты</span>
      </Link>
      
      <button 
        onClick={onMoreClick}
        className={`flex flex-col items-center justify-center w-1/5 py-1 ${isActive('/about') || isActive('/location') ? 'active-nav-button' : 'inactive-nav-button'}`}
      >
        <Info className={`${isActive('/about') || isActive('/location') ? 'text-accent' : 'text-secondary'} h-5 w-5`} />
        <span className={`text-xs mt-1 ${isActive('/about') || isActive('/location') ? 'font-medium' : ''}`}>Ещё</span>
      </button>
    </nav>
  );
}
