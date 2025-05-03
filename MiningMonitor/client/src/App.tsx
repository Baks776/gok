import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import InventoryPage from "@/pages/inventory";
import QueuePage from "@/pages/queue";
import ProductsPage from "@/pages/products";
import AboutPage from "@/pages/about";
import LocationPage from "@/pages/location";
import HomePage from "@/pages/home";
import ExcelDownloadPage from "@/pages/excel-download";
import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import MoreMenu from "@/components/more-menu";

/**
 * Компонент маршрутизации приложения.
 * Обрабатывает навигацию между страницами и состояние подключения к сети.
 */
function Router() {
  // Состояние для открытия/закрытия дополнительного меню
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  // Состояние для отслеживания подключения к сети
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Обработчик изменения статуса подключения к сети
    const handleOnlineStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    // Добавляем слушатели событий для отслеживания статуса сети
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    // Устанавливаем начальное состояние
    setIsOffline(!navigator.onLine);

    // Удаляем слушатели при размонтировании компонента
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-auto pb-16">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/inventory" component={InventoryPage} />
          <Route path="/queue" component={QueuePage} />
          <Route path="/products" component={ProductsPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/location" component={LocationPage} />
          <Route path="/excel-download" component={ExcelDownloadPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      {/* Нижняя навигационная панель */}
      <Navigation onMoreClick={() => setIsMoreMenuOpen(true)} isOffline={isOffline} />
      {/* Дополнительное меню */}
      <MoreMenu isOpen={isMoreMenuOpen} onClose={() => setIsMoreMenuOpen(false)} />
    </div>
  );
}

/**
 * Главный компонент приложения.
 * Обертывает приложение провайдерами для управления состоянием и уведомлениями.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
