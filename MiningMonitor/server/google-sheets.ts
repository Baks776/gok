import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

/**
 * Сервис для работы с Google Таблицами
 * 
 * Этот класс обеспечивает интеграцию с Google Sheets API для записи и чтения
 * данных о заказах и состоянии запасов.
 */
export class GoogleSheetsService {
  private doc: GoogleSpreadsheet | null = null;
  private jwt: JWT | null = null;
  private initialized: boolean = false;
  // ID таблицы Google Sheets (значение по умолчанию используется для демонстрации)
  private readonly SPREADSHEET_ID = this.extractSpreadsheetId(process.env.GOOGLE_SHEETS_ID) || '1KO4eRodge8UQoSN0MDv0q_QdJUITlfhwKsOPssMK9lc';
  
  /**
   * Извлекает ID таблицы из полного URL Google Sheets
   * @param url Полный URL или ID таблицы
   * @returns Чистый ID таблицы
   */
  private extractSpreadsheetId(url: string | undefined): string | undefined {
    if (!url) return undefined;
    
    // Если URL содержит полный адрес Google Sheets
    if (url.includes('docs.google.com/spreadsheets/d/')) {
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // Если передан уже чистый ID
    return url;
  }
  
  constructor() {
    this.initializeSheets();
  }
  
  /**
   * Инициализирует подключение к Google Sheets
   * Настраивает аутентификацию и загружает информацию о таблице
   */
  private async initializeSheets() {
    try {
      // Проверяем наличие всех необходимых переменных окружения
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.log("Переменные окружения для Google Sheets не настроены, используется демо-режим");
        this.initialized = true;
        return;
      }
      
      // Инициализация JWT для аутентификации
      this.jwt = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      
      // Подключение к Google Таблице
      this.doc = new GoogleSpreadsheet(this.SPREADSHEET_ID, this.jwt);
      await this.doc.loadInfo();
      
      this.initialized = true;
      console.log("Сервис Google Таблиц успешно инициализирован");
    } catch (error) {
      console.error("Ошибка инициализации Google Таблиц:", error);
      this.initialized = false;
    }
  }
  
  /**
   * Проверяет инициализацию сервиса и пытается переинициализировать при необходимости
   * Выбрасывает ошибку, если инициализация не удалась
   */
  private async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeSheets();
    }
    
    if (!this.initialized) {
      throw new Error("Сервис Google Таблиц не удалось инициализировать");
    }
  }
  
  /**
   * Добавляет данные заказа в таблицу заказов
   * @param orderData - Данные заказа для добавления
   * @returns ID строки в Google Таблице
   */
  async appendOrderToSheet(orderData: {
    customerName: string;    // Имя клиента
    phoneNumber: string;     // Номер телефона
    productName: string;     // Название продукта
    quantity: number;        // Количество
    preferredDate: string;   // Предпочтительная дата
    preferredTime: string;   // Предпочтительное время
    status: string;          // Статус заказа
  }) {
    await this.ensureInitialized();
    
    try {
      // Если API не настроен, возвращаем имитацию ID строки
      if (!this.doc) {
        console.log("Google Sheets API не настроен, используется демо-режим");
        return `mock-row-${Date.now()}`;
      }
      
      // Ищем или создаем лист "Заказы"
      let sheet = this.doc.sheetsByTitle['Заказы'];
      if (!sheet) {
        sheet = await this.doc.addSheet({ title: 'Заказы' });
        await sheet.setHeaderRow([
          'ID', 'Имя клиента', 'Телефон', 'Продукт', 'Количество', 
          'Предпочтительная дата', 'Предпочтительное время', 'Статус', 'Дата создания'
        ]);
      }
      
      const rows = await sheet.getRows();
      const rowNumber = rows.length + 2; // +2 из-за нулевого индекса и строки заголовка
      const rowId = Date.now().toString();
      
      await sheet.addRow({
        'ID': rowId,
        'Имя клиента': orderData.customerName,
        'Телефон': orderData.phoneNumber,
        'Продукт': orderData.productName,
        'Количество': orderData.quantity,
        'Предпочтительная дата': orderData.preferredDate,
        'Предпочтительное время': orderData.preferredTime,
        'Статус': orderData.status,
        'Дата создания': new Date().toLocaleString('ru')
      });
      
      return rowId;
    } catch (error) {
      console.error("Ошибка при добавлении данных в Google Таблицы:", error);
      // В случае ошибки возвращаем имитацию ID строки, чтобы приложение продолжало работать
      return `mock-row-${Date.now()}`;
    }
  }
  
  /**
   * Получает список заказов из таблицы заказов
   * @returns Массив данных заказов
   */
  async getOrdersFromSheet() {
    await this.ensureInitialized();
    
    try {
      // Если API не настроен, возвращаем пустой массив
      if (!this.doc) {
        console.log("Google Sheets API не настроен, используется демо-режим");
        return [];
      }
      
      // Ищем лист "Заказы"
      const sheet = this.doc.sheetsByTitle['Заказы'];
      if (!sheet) {
        console.log("Лист 'Заказы' не найден в Google Таблице");
        return [];
      }
      
      // Получаем все строки с данными
      const rows = await sheet.getRows();
      
      // Преобразуем строки в объекты заказов
      return rows.map(row => {
        // Используем метод get() для получения значений
        return {
          id: row.get('ID') || '',
          customerName: row.get('Имя клиента') || '',
          phoneNumber: row.get('Телефон') || '',
          product: row.get('Продукт') || '',
          quantity: parseInt(row.get('Количество') || '0'),
          preferredDate: row.get('Предпочтительная дата') || '',
          preferredTime: row.get('Предпочтительное время') || '',
          status: row.get('Статус') || 'pending',
          createdAt: row.get('Дата создания') || new Date().toLocaleString('ru'),
          rowIndex: row.rowIndex // публичное свойство
        };
      });
    } catch (error) {
      console.error("Ошибка при чтении данных из Google Таблиц:", error);
      // В случае ошибки возвращаем пустой массив, чтобы приложение продолжало работать
      return [];
    }
  }
  
  /**
   * Обновляет данные запасов в таблице запасов
   * @param inventoryData - Массив данных о запасах для обновления
   * @returns true в случае успеха
   */
  async updateInventorySheet(inventoryData: Array<{
    id: number;             // ID товара
    name: string;           // Название
    currentAmount: number;  // Текущее количество
    capacity: number;       // Максимальная вместимость
  }>) {
    await this.ensureInitialized();
    
    try {
      // Если API не настроен, возвращаем true
      if (!this.doc) {
        console.log("Google Sheets API не настроен, используется демо-режим");
        return true;
      }
      
      // Ищем или создаем лист "Запасы"
      let sheet = this.doc.sheetsByTitle['Запасы'];
      if (!sheet) {
        sheet = await this.doc.addSheet({ title: 'Запасы' });
        await sheet.setHeaderRow([
          'ID', 'Название', 'Текущее количество', 'Вместимость', 'Процент заполнения', 'Последнее обновление'
        ]);
      }
      
      // Очистка существующих строк
      const rows = await sheet.getRows();
      for (const row of rows) {
        await row.delete();
      }
      
      // Добавление новых строк
      for (const item of inventoryData) {
        const percentage = Math.round((Number(item.currentAmount) / Number(item.capacity)) * 100);
        await sheet.addRow({
          'ID': item.id,
          'Название': item.name,
          'Текущее количество': item.currentAmount,
          'Вместимость': item.capacity,
          'Процент заполнения': `${percentage}%`,
          'Последнее обновление': new Date().toLocaleString('ru')
        });
      }
      
      console.log("Данные запасов успешно обновлены в Google Таблицах");
      return true;
    } catch (error) {
      console.error("Ошибка при обновлении запасов в Google Таблицах:", error);
      // В случае ошибки возвращаем true, чтобы приложение продолжало работать
      return true;
    }
  }
  
  /**
   * Получает данные о запасах из таблицы
   * @returns Массив данных о запасах
   */
  async getInventoryFromSheet() {
    await this.ensureInitialized();
    
    try {
      // Если API не настроен, возвращаем пустой массив
      if (!this.doc) {
        console.log("Google Sheets API не настроен, используется демо-режим");
        return [];
      }
      
      // Ищем лист "Запасы"
      const sheet = this.doc.sheetsByTitle['Запасы'];
      if (!sheet) {
        console.log("Лист 'Запасы' не найден в Google Таблице");
        return [];
      }
      
      // Получаем все строки с данными
      const rows = await sheet.getRows();
      
      // Преобразуем строки в объекты запасов
      return rows.map(row => ({
        id: parseInt(row['ID']) || 0,
        name: row['Название'] || '',
        currentAmount: parseInt(row['Текущее количество']) || 0,
        capacity: parseInt(row['Вместимость']) || 0,
        percentageFull: row['Процент заполнения'] || '0%',
        lastUpdated: row['Последнее обновление'] || new Date().toLocaleString('ru')
      }));
    } catch (error) {
      console.error("Ошибка при чтении данных запасов из Google Таблиц:", error);
      // В случае ошибки возвращаем пустой массив, чтобы приложение продолжало работать
      return [];
    }
  }
}
