import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertOrderSchema, insertReviewSchema, insertMessageSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup Auth
  setupAuth(app);

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
        name: "Wagyu Gold Burger",
        description: "Premium A5 Wagyu beef patty, caramelized onions, aged cheddar, and truffle aioli on a toasted brioche bun.",
        price: 650,
        category: "Meals",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      },
      {
        name: "Truffle Mushroom Pasta",
        description: "Creamy fettuccine with authentic black truffle shavings, wild forest mushrooms, and aged parmesan.",
        price: 450,
        category: "Meals",
        image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      },
      {
        name: "Premium Sushi Platter",
        description: "Assorted fresh sashimi and nigiri with premium wasabi and pickled ginger.",
        price: 890,
        category: "Meals",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      },
      {
        name: "Avocado & Egg Sourdough",
        description: "Freshly smashed Hass avocado, poached organic eggs, and microgreens on artisan sourdough.",
        price: 320,
        category: "Breakfast",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800",
        popular: false,
        available: true
      },
      {
        name: "Berry Nutella Crepes",
        description: "Thin French crepes filled with Nutella and topped with a medley of fresh seasonal berries.",
        price: 280,
        category: "Breakfast",
        image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      },
      {
        name: "Crispy Peri Peri Fries",
        description: "Hand-cut golden fries tossed in our signature peri peri spice blend.",
        price: 180,
        category: "Snacks",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800",
        popular: false,
        available: true
      },
      {
        name: "Classic Cold Brew",
        description: "12-hour slow-steeped Arabica coffee served over ice.",
        price: 220,
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800",
        popular: true,
        available: true
      },
      {
        name: "Exotic Dragon Fruit Bowl",
        description: "Fresh dragon fruit, granola, chia seeds, and honey drizzle.",
        price: 380,
        category: "Breakfast",
        image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800",
        popular: false,
        available: true
      }
    ];

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
