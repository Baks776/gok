import { Card } from "@/components/ui/card";
import { MapPin, Clock, Phone, Navigation } from "lucide-react";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function LocationPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize Google Maps
    // Note: In a real implementation, you would load the Google Maps API
    // and initialize the map here. For now, we'll simply create a placeholder.
    const loadMap = () => {
      if (mapRef.current && navigator.onLine) {
        // This is where the Google Maps API would be used to render a map
        // Example code (would require a Google Maps API key):
        /*
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 12,
        });
        
        const marker = new window.google.maps.Marker({
          position: { lat: 37.7749, lng: -122.4194 },
          map,
          title: "Горный комплекс"
        });
        */
      }
    };
    
    loadMap();
  }, []);

  return (
    <div>
      <div className="h-60 bg-gray-200 relative">
        <div
          ref={mapRef}
          className="w-full h-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundColor: "#e5e5e5" }}
        >
          {/* Placeholder for Google Maps */}
          <div className="text-secondary">
            <MapPin className="mx-auto h-8 w-8 mb-2" />
            <p>Загрузка карты...</p>
            <p className="text-xs">Здесь будет отображена интерактивная карта</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <button className="bg-white p-2 rounded-full shadow-md">
            <Navigation className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">Наше местоположение</h1>
        <p className="text-secondary mb-4">Горнодобывающий комплекс</p>
        
        <Card className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-start mb-4">
            <MapPin className="text-accent mr-3 h-5 w-5" />
            <div>
              <h3 className="font-medium">Адрес</h3>
              <p className="text-secondary">ул. Горная 123, Промышленный район<br />Индустриальная зона, 12345</p>
            </div>
          </div>
          
          <div className="flex items-start mb-4">
            <Clock className="text-accent mr-3 h-5 w-5" />
            <div>
              <h3 className="font-medium">Часы работы</h3>
              <p className="text-secondary">Понедельник - Пятница: 7:00 - 18:00<br />Суббота: 8:00 - 14:00<br />Воскресенье: Выходной</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Phone className="text-accent mr-3 h-5 w-5" />
            <div>
              <h3 className="font-medium">Контакты</h3>
              <p className="text-secondary">Телефон: +7 (123) 456-78-90<br />Эл. почта: info@gornocomplex.ru</p>
            </div>
          </div>
        </Card>
        
        <h2 className="text-lg font-medium mb-3">Как добраться</h2>
        
        <Card className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-medium mb-2">Из центра города</h3>
          <ol className="text-secondary pl-5 list-decimal">
            <li className="mb-1">Следуйте по Главной улице на север 8 км</li>
            <li className="mb-1">Поверните направо на Промышленное шоссе</li>
            <li className="mb-1">Продолжайте движение 3 км</li>
            <li>Наш комплекс будет слева, с четкими указателями</li>
          </ol>
        </Card>
        
        <Card className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-medium mb-2">С шоссе М-1</h3>
          <ol className="text-secondary pl-5 list-decimal">
            <li className="mb-1">Съезд 25 в сторону Промышленного района</li>
            <li className="mb-1">Поверните налево на улицу Горную</li>
            <li className="mb-1">Продолжайте движение 2,5 км</li>
            <li>Наш комплекс будет справа после железнодорожного переезда</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
