import { db } from "@db";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { 
  inventoryItems, 
  products, 
  truckQueue, 
  orders, 
  systemStatus 
} from "@shared/schema";

export const storage = {
  // Inventory functions
  async getInventoryItems() {
    return await db.query.inventoryItems.findMany({
      orderBy: (inventoryItems, { asc }) => [asc(inventoryItems.name)]
    });
  },
  
  async getInventoryItemById(id: number) {
    return await db.query.inventoryItems.findFirst({
      where: eq(inventoryItems.id, id)
    });
  },
  
  async updateInventoryItem(id: number, data: { currentAmount: number }) {
    const [updated] = await db
      .update(inventoryItems)
      .set({
        currentAmount: data.currentAmount,
        lastUpdated: new Date()
      })
      .where(eq(inventoryItems.id, id))
      .returning();
      
    return updated;
  },
  
  // Product functions
  async getProducts() {
    return await db.query.products.findMany({
      orderBy: (products, { asc }) => [asc(products.name)],
      with: {
        inventoryItem: true
      }
    });
  },
  
  async getProductById(id: number) {
    return await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        inventoryItem: true
      }
    });
  },
  
  // Truck queue functions
  async getTruckQueue() {
    return await db.query.truckQueue.findMany({
      orderBy: (truckQueue, { asc }) => [asc(truckQueue.arrivalTime)],
      with: {
        inventoryItem: true
      }
    });
  },
  
  async getQueueStats() {
    const queue = await db.query.truckQueue.findMany();
    
    // Count by status
    const inQueue = queue.filter(item => item.status === 'waiting').length;
    const loading = queue.filter(item => item.status === 'loading').length;
    
    // Calculate average wait time
    let totalWaitTime = 0;
    let count = 0;
    
    for (const item of queue) {
      if (item.status !== 'completed') {
        const waitTime = Math.round((new Date().getTime() - new Date(item.arrivalTime).getTime()) / 60000); // in minutes
        totalWaitTime += waitTime;
        count++;
      }
    }
    
    const avgWaitTime = count > 0 ? Math.round(totalWaitTime / count) : 0;
    
    return {
      inQueue,
      loading,
      avgWaitTime
    };
  },
  
  async addTruckToQueue(data: {
    company: string;
    truckId: string;
    inventoryItemId: number;
    quantity: number;
  }) {
    const [inserted] = await db
      .insert(truckQueue)
      .values({
        ...data,
        arrivalTime: new Date(),
        status: 'waiting'
      })
      .returning();
      
    // Update system status
    await db
      .update(systemStatus)
      .set({
        currentQueueCount: sql`${systemStatus.currentQueueCount} + 1`,
        lastUpdated: new Date()
      })
      .where(eq(systemStatus.id, 1));
      
    return inserted;
  },
  
  async updateTruckStatus(id: number, status: string) {
    const [updated] = await db
      .update(truckQueue)
      .set({
        status
      })
      .where(eq(truckQueue.id, id))
      .returning();
      
    // If status is 'completed', adjust inventory and update system status
    if (status === 'completed') {
      const truck = await db.query.truckQueue.findFirst({
        where: eq(truckQueue.id, id),
        with: {
          inventoryItem: true
        }
      });
      
      if (truck) {
        // Reduce inventory
        await db
          .update(inventoryItems)
          .set({
            currentAmount: sql`${inventoryItems.currentAmount} - ${truck.quantity}`,
            lastUpdated: new Date()
          })
          .where(eq(inventoryItems.id, truck.inventoryItemId));
          
        // Update system status
        await db
          .update(systemStatus)
          .set({
            currentQueueCount: sql`${systemStatus.currentQueueCount} - 1`,
            dailyProduction: sql`${systemStatus.dailyProduction} + ${truck.quantity}`,
            lastUpdated: new Date()
          })
          .where(eq(systemStatus.id, 1));
      }
    }
    
    return updated;
  },
  
  // Orders functions
  async createOrder(data: {
    customerName: string;
    phoneNumber: string;
    productId: number;
    quantity: number;
    preferredDate: string;
  }) {
    const [inserted] = await db
      .insert(orders)
      .values({
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        productId: data.productId,
        quantity: data.quantity,
        preferredDate: new Date(data.preferredDate),
        status: 'pending',
        createdAt: new Date()
      })
      .returning();
      
    return inserted;
  },
  
  async getOrders() {
    return await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        product: true
      }
    });
  },
  
  async updateOrderStatus(id: number, status: string) {
    const [updated] = await db
      .update(orders)
      .set({
        status
      })
      .where(eq(orders.id, id))
      .returning();
      
    return updated;
  },
  
  async updateOrderSheetRowId(id: number, sheetRowId: string) {
    const [updated] = await db
      .update(orders)
      .set({
        sheetRowId
      })
      .where(eq(orders.id, id))
      .returning();
      
    return updated;
  },
  
  // System status functions
  async getSystemStatus() {
    const status = await db.query.systemStatus.findFirst({
      where: eq(systemStatus.id, 1)
    });
    
    return status || {
      status: 'unknown',
      currentQueueCount: 0,
      estimatedWaitTime: 0,
      dailyProduction: 0,
      temperature: 0,
      lastUpdated: new Date()
    };
  },
  
  async updateSystemStatus(data: {
    status?: string;
    currentQueueCount?: number;
    estimatedWaitTime?: number;
    dailyProduction?: number;
    temperature?: number;
  }) {
    const [updated] = await db
      .update(systemStatus)
      .set({
        ...data,
        lastUpdated: new Date()
      })
      .where(eq(systemStatus.id, 1))
      .returning();
      
    return updated;
  }
};
