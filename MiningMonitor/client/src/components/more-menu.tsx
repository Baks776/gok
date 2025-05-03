import { useEffect } from "react";
import { useLocation } from "wouter";
import { Info, MapPin, Settings, HelpCircle, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MoreMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MoreMenu({ isOpen, onClose }: MoreMenuProps) {
  const [, setLocation] = useLocation();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleMenuItemClick = (path: string) => {
    setLocation(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex items-end">
      <div className="bg-white rounded-t-xl w-full p-4 flex flex-col">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
        
        <button 
          className="flex items-center py-3 border-b border-gray-200"
          onClick={() => handleMenuItemClick('/about')}
        >
          <Info className="text-secondary mr-3 h-5 w-5" />
          <span>О нас</span>
        </button>
        
        <button 
          className="flex items-center py-3 border-b border-gray-200"
          onClick={() => handleMenuItemClick('/location')}
        >
          <MapPin className="text-secondary mr-3 h-5 w-5" />
          <span>Местоположение</span>
        </button>
        
        <button 
          className="flex items-center py-3 border-b border-gray-200"
          onClick={() => handleMenuItemClick('/excel-download')}
        >
          <FileSpreadsheet className="text-secondary mr-3 h-5 w-5" />
          <span>Скачать Excel шаблон</span>
        </button>
        
        <button className="flex items-center py-3 border-b border-gray-200">
          <Settings className="text-secondary mr-3 h-5 w-5" />
          <span>Настройки</span>
        </button>
        
        <button className="flex items-center py-3 text-accent">
          <HelpCircle className="text-accent mr-3 h-5 w-5" />
          <span>Помощь и поддержка</span>
        </button>
        
        <Button
          variant="ghost"
          className="mt-4 py-3 bg-muted rounded-lg font-medium"
          onClick={onClose}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
}
