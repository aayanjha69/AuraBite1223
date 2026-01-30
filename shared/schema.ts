import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Menu Items
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in cents
  category: text("category").notNull(), // Breakfast, Meals, Snacks, Drinks
  image: text("image").notNull(),
  popular: boolean("popular").default(false),
  available: boolean("available").default(true),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  total: integer("total").notNull(), // in cents
  status: text("status").notNull().default("pending"), // pending, confirmed, delivered
  items: jsonb("items").notNull(), // Store snapshot of items for simplicity in this demo
  createdAt: timestamp("created_at").defaultNow(),
});

// We need a schema for the order input that includes the items
export const insertOrderSchema = createInsertSchema(orders).omit({ 
  id: true, 
  status: true, 
  createdAt: true 
}).extend({
  items: z.array(z.object({
    menuItemId: z.number(),
    quantity: z.number(),
    name: z.string(),
    price: z.number(),
    customizations: z.array(z.string()).optional()
  }))
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Contact Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
