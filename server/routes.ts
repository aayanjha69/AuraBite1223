import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertOrderSchema, insertReviewSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Menu Routes
  app.get(api.menu.list.path, async (_req, res) => {
    const items = await storage.getMenuItems();
    res.json(items);
  });

  app.get(api.menu.get.path, async (req, res) => {
    const item = await storage.getMenuItem(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  });

  // Order Routes
  app.post(api.orders.create.path, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid order data", details: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Review Routes
  app.get(api.reviews.list.path, async (_req, res) => {
    const reviews = await storage.getReviews();
    res.json(reviews);
  });

  app.post(api.reviews.create.path, async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid review data", details: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Contact Routes
  app.post(api.contact.create.path, async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid contact data", details: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingItems = await storage.getMenuItems();
  if (existingItems.length === 0) {
    console.log("Seeding database...");
    
    // Seed Menu Items
    const menuItems = [
      {
        name: "Classic Aura Burger",
        description: "Premium beef patty, cheddar cheese, lettuce, tomato, special sauce on a brioche bun.",
        price: 1299, // $12.99
        category: "Meals",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      },
      {
        name: "Spicy Chicken Deluxe",
        description: "Crispy chicken breast, spicy mayo, pickles, slaw on a toasted bun.",
        price: 1150, // $11.50
        category: "Meals",
        image: "https://images.unsplash.com/photo-1615557960916-5f4791effe9d?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      },
      {
        name: "Margherita Supreme",
        description: "Fresh basil, mozzarella di bufala, san marzano tomato sauce, olive oil.",
        price: 1400, // $14.00
        category: "Meals",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800",
        popular: false,
        available: true
      },
      {
        name: "Truffle Mushroom Pizza",
        description: "Wild mushrooms, truffle oil, mozzarella, thyme, white sauce base.",
        price: 1650, // $16.50
        category: "Meals",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      },
      {
        name: "Crispy Onion Rings",
        description: "Golden fried onion rings served with ranch dipping sauce.",
        price: 550, // $5.50
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800",
        popular: false,
        available: true
      },
      {
        name: "Loaded Fries",
        description: "French fries topped with melted cheese, bacon bits, and green onions.",
        price: 750, // $7.50
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1585109649139-3668018951a6?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      },
      {
        name: "Sunrise Smoothie",
        description: "Mango, pineapple, banana, orange juice blend.",
        price: 600, // $6.00
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800",
        popular: false,
        available: true
      },
      {
        name: "Iced Caramel Macchiato",
        description: "Espresso, vanilla syrup, milk, caramel drizzle over ice.",
        price: 500, // $5.00
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1461023058943-48dbf1399f98?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      },
      {
        name: "Avocado Toast",
        description: "Sourdough bread, smashed avocado, poached egg, chili flakes.",
        price: 950, // $9.50
        category: "Breakfast",
        image: "https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&w=800",
        popular: false,
        available: true
      },
      {
        name: "Berry Pancakes",
        description: "Fluffy pancakes topped with fresh berries, maple syrup, and whipped cream.",
        price: 1050, // $10.50
        category: "Breakfast",
        image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      }
    ];

    // Note: Since we don't have a direct insertMany method in our storage interface (to keep it simple),
    // we'll access db directly here or add it to storage. For now, db access for seeding is fine.
    // Actually, I'll just iterate for simplicity.
    for (const item of menuItems) {
      await db.insert(schema.menuItems).values(item);
    }

    // Seed Reviews
    const sampleReviews = [
      { name: "Sarah J.", rating: 5, comment: "Best burger I've ever had! The atmosphere is great too." },
      { name: "Mike T.", rating: 4, comment: "Pizza was delicious, delivery was a bit slow but worth it." },
      { name: "Emily R.", rating: 5, comment: "Love the vegan options. The avocado toast is to die for!" }
    ];

    for (const review of sampleReviews) {
      await db.insert(schema.reviews).values(review);
    }

    console.log("Database seeded successfully!");
  }
}

import { db } from "./db";
import * as schema from "@shared/schema";
