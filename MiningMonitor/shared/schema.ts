import { pgTable, text, serial, integer, timestamp, decimal, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// Inventory items (different types of crushed stone)
export const inventoryItems = pgTable('inventory_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  currentAmount: decimal('current_amount', { precision: 10, scale: 2 }).notNull(),
  capacity: decimal('capacity', { precision: 10, scale: 2 }).notNull(),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

export const inventoryItemsInsertSchema = createInsertSchema(inventoryItems, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  currentAmount: (schema) => schema.min(0, "Current amount cannot be negative"),
  capacity: (schema) => schema.min(1, "Capacity must be greater than 0"),
});

export type InventoryItemInsert = z.infer<typeof inventoryItemsInsertSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  available: boolean('available').notNull().default(true),
  imageUrl: text('image_url').notNull(),
  inventoryItemId: integer('inventory_item_id').references(() => inventoryItems.id).notNull(),
});

export const productsInsertSchema = createInsertSchema(products, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
  price: (schema) => schema.min(0, "Price cannot be negative"),
});

export type ProductInsert = z.infer<typeof productsInsertSchema>;
export type Product = typeof products.$inferSelect;

export const productsRelations = relations(products, ({ one }) => ({
  inventoryItem: one(inventoryItems, {
    fields: [products.inventoryItemId],
    references: [inventoryItems.id],
  })
}));

// Truck Queue
export const truckQueue = pgTable('truck_queue', {
  id: serial('id').primaryKey(),
  company: text('company').notNull(),
  truckId: text('truck_id').notNull(),
  arrivalTime: timestamp('arrival_time').defaultNow().notNull(),
  status: text('status').notNull().default('waiting'), // 'waiting', 'loading', 'completed'
  inventoryItemId: integer('inventory_item_id').references(() => inventoryItems.id).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
});

export const truckQueueInsertSchema = createInsertSchema(truckQueue, {
  company: (schema) => schema.min(2, "Company name must be at least 2 characters"),
  truckId: (schema) => schema.min(2, "Truck ID must be at least 2 characters"),
  quantity: (schema) => schema.min(0, "Quantity cannot be negative"),
});

export type TruckQueueInsert = z.infer<typeof truckQueueInsertSchema>;
export type TruckQueueItem = typeof truckQueue.$inferSelect;

export const truckQueueRelations = relations(truckQueue, ({ one }) => ({
  inventoryItem: one(inventoryItems, {
    fields: [truckQueue.inventoryItemId],
    references: [inventoryItems.id],
  })
}));

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  preferredDate: timestamp('preferred_date').notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'confirmed', 'completed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  sheetRowId: text('sheet_row_id'), // To track the row ID in Google Sheets
});

export const ordersInsertSchema = createInsertSchema(orders, {
  customerName: (schema) => schema.min(2, "Customer name must be at least 2 characters"),
  phoneNumber: (schema) => schema.min(5, "Phone number must be at least 5 characters"),
  quantity: (schema) => schema.min(0, "Quantity cannot be negative"),
});

export type OrderInsert = z.infer<typeof ordersInsertSchema>;
export type Order = typeof orders.$inferSelect;

export const ordersRelations = relations(orders, ({ one }) => ({
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  })
}));

// System status
export const systemStatus = pgTable('system_status', {
  id: serial('id').primaryKey(),
  status: text('status').notNull().default('operational'), // 'operational', 'maintenance', 'issue'
  currentQueueCount: integer('current_queue_count').notNull().default(0),
  estimatedWaitTime: integer('estimated_wait_time').notNull().default(0), // in minutes
  dailyProduction: decimal('daily_production', { precision: 10, scale: 2 }).notNull().default('0'),
  temperature: decimal('temperature', { precision: 5, scale: 1 }),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
});

export const systemStatusInsertSchema = createInsertSchema(systemStatus);
export type SystemStatusInsert = z.infer<typeof systemStatusInsertSchema>;
export type SystemStatusItem = typeof systemStatus.$inferSelect;
