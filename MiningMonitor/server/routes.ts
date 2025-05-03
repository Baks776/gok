import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleSheetsService } from "./google-sheets";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Google Sheets service
  const googleSheets = new GoogleSheetsService();
  
  // API prefix
  const apiPrefix = "/api";
  
  // System Status API
  app.get(`${apiPrefix}/system-status`, async (req, res) => {
    try {
      const status = await storage.getSystemStatus();
      res.json(status);
    } catch (error) {
      console.error("Error fetching system status:", error);
      res.status(500).json({ message: "Failed to fetch system status" });
    }
  });
  
  // Inventory API
  app.get(`${apiPrefix}/inventory`, async (req, res) => {
    try {
      const inventory = await storage.getInventoryItems();
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });
  
  // Queue API
  app.get(`${apiPrefix}/queue`, async (req, res) => {
    try {
      const queue = await storage.getTruckQueue();
      res.json(queue);
    } catch (error) {
      console.error("Error fetching queue:", error);
      res.status(500).json({ message: "Failed to fetch queue" });
    }
  });
  
  // Queue Stats API
  app.get(`${apiPrefix}/queue/stats`, async (req, res) => {
    try {
      const stats = await storage.getQueueStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching queue stats:", error);
      res.status(500).json({ message: "Failed to fetch queue stats" });
    }
  });
  
  // Products API
  app.get(`${apiPrefix}/products`, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  
  // Orders API
  app.post(`${apiPrefix}/orders`, async (req, res) => {
    try {
      const orderData = req.body;
      const product = await storage.getProductById(orderData.productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Save order to database
      const order = await storage.createOrder(orderData);
      
      // Send to Google Sheets
      try {
        const sheetData = {
          customerName: orderData.customerName,
          phoneNumber: orderData.phoneNumber,
          productName: product.name,
          quantity: orderData.quantity,
          preferredDate: new Date(orderData.preferredDate).toLocaleDateString(),
          preferredTime: new Date(orderData.preferredDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'pending'
        };
        
        const rowId = await googleSheets.appendOrderToSheet(sheetData);
        
        // Update order with Google Sheets row ID
        if (rowId) {
          await storage.updateOrderSheetRowId(order.id, rowId);
        }
      } catch (sheetError) {
        console.error("Error saving to Google Sheets:", sheetError);
        // Continue with the response even if Google Sheets fails
      }
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  // Google Sheets API
  app.get(`${apiPrefix}/google-sheets/orders`, async (req, res) => {
    try {
      const orders = await googleSheets.getOrdersFromSheet();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders from Google Sheets:", error);
      res.status(500).json({ message: "Failed to fetch orders from Google Sheets" });
    }
  });
  
  app.post(`${apiPrefix}/google-sheets/orders`, async (req, res) => {
    try {
      const orderData = req.body;
      const rowId = await googleSheets.appendOrderToSheet(orderData);
      res.json({ rowId });
    } catch (error) {
      console.error("Error adding order to Google Sheets:", error);
      res.status(500).json({ message: "Failed to add order to Google Sheets" });
    }
  });
  
  app.post(`${apiPrefix}/google-sheets/inventory`, async (req, res) => {
    try {
      const { inventory } = req.body;
      await googleSheets.updateInventorySheet(inventory);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating inventory in Google Sheets:", error);
      res.status(500).json({ message: "Failed to update inventory in Google Sheets" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
