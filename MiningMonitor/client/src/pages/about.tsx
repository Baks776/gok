import { Card } from "@/components/ui/card";
import { 
  Verified, 
  Recycle, 
  HardHat, 
  Construction,
  PersonStanding,
  Archive,
  Bot
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="px-4 py-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">О нас</h1>
        <p className="text-secondary text-sm">Горнодобывающий комплекс</p>
      </header>
      
      <Card className="bg-muted rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium">Наша компания</h2>
          <div className="h-8 w-auto flex items-center justify-center">
            <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="40" fill="#333333"/>
              <path d="M20 10H30V30H20V10Z" fill="#FF0000"/>
              <path d="M35 10H75V15H35V10Z" fill="#FFFFFF"/>
              <path d="M35 17.5H65V22.5H35V17.5Z" fill="#FFFFFF"/>
              <path d="M35 25H55V30H35V25Z" fill="#FFFFFF"/>
            </svg>
          </div>
        </div>
        <p className="text-secondary text-sm">
          ООО «Торговый дом «Городнянский» — производитель высококачественного известнякового щебня и минерального порошка с 2008 года.

          Мы работаем с крупными строительными компаниями и частными заказчиками, обеспечивая поставки материалов для дорожного строительства, ЖБИ и бетонных смесей.

          Наша команда гордится безупречной репутацией надежного партнера, способного выполнять заказы любого масштаба в срок.

          Мы вдохновляемся возможностью участвовать в развитии инфраструктуры страны, создавая материалы для строительства современных дорог и объектов.

          Ценности нашей компании: качество продукции, соблюдение стандартов ГОСТ, забота о клиентах и экологии. Работаем круглосуточно, чтобы обеспечить непрерывность строительных процессов наших партнеров.
        </p>
      </Card>
      
      <Card className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="font-medium mb-3">Ключевая информация</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-secondary mb-1">Годовое производство</p>
            <p className="text-lg font-medium">850 000 тонн</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-1">Зона обслуживания</p>
            <p className="text-lg font-medium">320 км</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-1">Размер автопарка</p>
            <p className="text-lg font-medium">35 грузовиков</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-1">Сотрудники</p>
            <p className="text-lg font-medium">120 специалистов</p>
          </div>
        </div>
      </Card>
      
      <h2 className="text-lg font-medium mb-3">Сертификаты и соответствие</h2>
      <Card className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full mb-2 flex items-center justify-center">
              <Verified className="text-secondary h-8 w-8" />
            </div>
            <p className="text-sm font-medium">ИСО 9001</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full mb-2 flex items-center justify-center">
              <Recycle className="text-secondary h-8 w-8" />
            </div>
            <p className="text-sm font-medium">ИСО 14001</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full mb-2 flex items-center justify-center">
              <HardHat className="text-secondary h-8 w-8" />
            </div>
            <p className="text-sm font-medium">ГОСТ Р 57621</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full mb-2 flex items-center justify-center">
              <Construction className="text-secondary h-8 w-8" />
            </div>
            <p className="text-sm font-medium">Сертификат отрасли</p>
          </div>
        </div>
      </Card>
      
      <h2 className="text-lg font-medium mb-3">Контактная информация</h2>
      <Card className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start mb-4">
          <PersonStanding className="text-accent mr-3 h-5 w-5" />
          <div>
            <h3 className="font-medium">Генеральный директор</h3>
            <p className="text-secondary">Иванов Иван</p>
            <p className="text-secondary text-sm">ivanov@gornocomplex.ru</p>
          </div>
        </div>
        
        <div className="flex items-start mb-4">
          <Archive className="text-accent mr-3 h-5 w-5" />
          <div>
            <h3 className="font-medium">Отдел продаж</h3>
            <p className="text-secondary">+7 (123) 456-78-91</p>
            <p className="text-secondary text-sm">sales@gornocomplex.ru</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Bot className="text-accent mr-3 h-5 w-5" />
          <div>
            <h3 className="font-medium">Служба поддержки</h3>
            <p className="text-secondary">+7 (123) 456-78-92</p>
            <p className="text-secondary text-sm">support@gornocomplex.ru</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
