import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Seeding database...");
    
    // Check if inventory items already exist
    const existingInventoryItems = await db.query.inventoryItems.findMany();
    
    if (existingInventoryItems.length === 0) {
      console.log("Seeding inventory items...");
      
      // Insert inventory items (different types of crushed stone)
      const inventoryItemsData = [
        { name: "5-10mm Crushed Stone", currentAmount: 780, capacity: 1000 },
        { name: "10-20mm Crushed Stone", currentAmount: 450, capacity: 1000 },
        { name: "20-40mm Crushed Stone", currentAmount: 230, capacity: 1000 },
        { name: "40-70mm Crushed Stone", currentAmount: 120, capacity: 1000 },
        { name: "Sand", currentAmount: 650, capacity: 1000 },
        { name: "Granite Chips", currentAmount: 870, capacity: 1000 },
      ];
      
      await db.insert(schema.inventoryItems).values(inventoryItemsData);
    }
    
    // Check if products already exist
    const existingProducts = await db.query.products.findMany();
    
    if (existingProducts.length === 0) {
      console.log("Seeding products...");
      
      // Get inserted inventory items
      const inventoryItems = await db.query.inventoryItems.findMany();
      
      // Insert products
      const productsData = [
        { 
          name: "5-10mm Crushed Stone", 
          description: "Ideal for concrete mixes and drainage applications", 
          price: 45.00, 
          available: true, 
          imageUrl: "https://images.unsplash.com/photo-1518386427402-1090f9ad4134", 
          inventoryItemId: inventoryItems.find(item => item.name === "5-10mm Crushed Stone")?.id || 1 
        },
        { 
          name: "10-20mm Crushed Stone", 
          description: "Perfect for construction projects and landscaping", 
          price: 43.00, 
          available: true, 
          imageUrl: "https://images.unsplash.com/photo-1597484662317-c03a72448e2c", 
          inventoryItemId: inventoryItems.find(item => item.name === "10-20mm Crushed Stone")?.id || 2
        },
        { 
          name: "20-40mm Crushed Stone", 
          description: "Great for road construction and heavy-duty applications", 
          price: 40.00, 
          available: true, 
          imageUrl: "https://images.unsplash.com/photo-1616187357148-2c4db9bc0a3c", 
          inventoryItemId: inventoryItems.find(item => item.name === "20-40mm Crushed Stone")?.id || 3
        },
        { 
          name: "40-70mm Crushed Stone", 
          description: "Suitable for gabion baskets and drainage systems", 
          price: 38.00, 
          available: true, 
          imageUrl: "https://images.unsplash.com/photo-1582488809640-12f7de100f73", 
          inventoryItemId: inventoryItems.find(item => item.name === "40-70mm Crushed Stone")?.id || 4
        },
        { 
          name: "Sand", 
          description: "High-quality sand for construction and landscaping", 
          price: 35.00, 
          available: true, 
          imageUrl: "https://images.unsplash.com/photo-1589149964239-cde917d014d0", 
          inventoryItemId: inventoryItems.find(item => item.name === "Sand")?.id || 5
        },
        { 
          name: "Granite Chips", 
          description: "Premium decorative stone for landscaping projects", 
          price: 50.00, 
          available: true, 
          imageUrl: "https://images.unsplash.com/photo-1596121554362-9ac2e614a256", 
          inventoryItemId: inventoryItems.find(item => item.name === "Granite Chips")?.id || 6
        },
      ];
      
      await db.insert(schema.products).values(productsData);
    }
    
    // Check if truck queue already has entries
    const existingQueue = await db.query.truckQueue.findMany();
    
    if (existingQueue.length === 0) {
      console.log("Seeding truck queue...");
      
      // Get inserted inventory items
      const inventoryItems = await db.query.inventoryItems.findMany();
      
      // Insert truck queue
      const now = new Date();
      const truckQueueData = [
        { 
          company: "Company ABC", 
          truckId: "T-1234", 
          arrivalTime: new Date(now.getTime() - 30 * 60000).toISOString(), // 30 minutes ago
          status: "loading", 
          inventoryItemId: inventoryItems.find(item => item.name === "5-10mm Crushed Stone")?.id || 1,
          quantity: 20
        },
        { 
          company: "XYZ Construction", 
          truckId: "T-8976", 
          arrivalTime: new Date(now.getTime() - 23 * 60000).toISOString(), // 23 minutes ago
          status: "loading", 
          inventoryItemId: inventoryItems.find(item => item.name === "Sand")?.id || 5,
          quantity: 15
        },
        { 
          company: "BuildRight Inc", 
          truckId: "T-4512", 
          arrivalTime: new Date(now.getTime() - 15 * 60000).toISOString(), // 15 minutes ago
          status: "waiting", 
          inventoryItemId: inventoryItems.find(item => item.name === "20-40mm Crushed Stone")?.id || 3,
          quantity: 25
        },
        { 
          company: "Johnson Materials", 
          truckId: "T-9854", 
          arrivalTime: new Date().toISOString(),
          status: "waiting", 
          inventoryItemId: inventoryItems.find(item => item.name === "10-20mm Crushed Stone")?.id || 2,
          quantity: 18
        },
      ];
      
      await db.insert(schema.truckQueue).values(truckQueueData);
    }
    
    // Check if system status already exists
    const existingStatus = await db.query.systemStatus.findFirst();
    
    if (!existingStatus) {
      console.log("Seeding system status...");
      
      // Insert system status
      await db.insert(schema.systemStatus).values({
        status: "operational",
        currentQueueCount: 7,
        estimatedWaitTime: 45,
        dailyProduction: 2450,
        temperature: 27,
      });
    }
    
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
