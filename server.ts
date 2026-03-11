import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("phiroz.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'customer'
  );

  CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    rating REAL DEFAULT 5.0,
    category TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_id INTEGER,
    name TEXT,
    description TEXT,
    price REAL,
    category TEXT,
    image_url TEXT,
    FOREIGN KEY(vendor_id) REFERENCES vendors(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_price REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    type TEXT, -- 'local' or 'intercity'
    pickup_address TEXT,
    destination_address TEXT,
    status TEXT DEFAULT 'pending',
    tracking_id TEXT UNIQUE,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );
`);

// Seed data if empty
const vendorCount = db.prepare("SELECT COUNT(*) as count FROM vendors").get() as { count: number };
if (vendorCount.count === 0) {
  const insertVendor = db.prepare("INSERT INTO vendors (name, description, category) VALUES (?, ?, ?)");
  insertVendor.run("Young Phiroz Groceries", "Fresh groceries from the market", "Groceries");
  insertVendor.run("Phiroz Fashion", "Latest trends in clothing and shoes", "Clothing");

  const insertProduct = db.prepare("INSERT INTO products (vendor_id, name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?, ?)");
  insertProduct.run(1, "Fresh Tomatoes", "1kg of farm fresh tomatoes", 25.0, "Groceries", "https://picsum.photos/seed/tomatoes/400/400");
  insertProduct.run(1, "Zambian Maize Meal", "25kg Breakfast Meal", 280.0, "Groceries", "https://picsum.photos/seed/maize/400/400");
  insertProduct.run(2, "Gold Stitch Suit", "Premium black suit with gold accents", 1500.0, "Clothing", "https://picsum.photos/seed/suit/400/400");
}

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/support", async (req, res) => {
    const { message, history } = req.body;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: "You are Phiroz AI, a helpful assistant for the Phiroz Super App in Zambia. You help users with marketplace orders, logistics tracking, and bill payments. Be professional, friendly, and concise." }] },
          ...history.map((h: any) => ({ role: h.role, parts: [{ text: h.content }] })),
          { role: "user", parts: [{ text: message }] }
        ]
      });
      res.json({ reply: response.text });
    } catch (err) {
      res.status(500).json({ error: "AI failed" });
    }
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get("/api/vendors", (req, res) => {
    const vendors = db.prepare("SELECT * FROM vendors").all();
    res.json(vendors);
  });

  app.post("/api/orders", (req, res) => {
    const { userId, totalPrice, items } = req.body;
    const info = db.prepare("INSERT INTO orders (user_id, total_price) VALUES (?, ?)").run(userId, totalPrice);
    res.json({ orderId: info.lastInsertRowid });
  });

  app.post("/api/deliveries", (req, res) => {
    const { type, pickup, destination } = req.body;
    const trackingId = "PHZ-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    const info = db.prepare("INSERT INTO deliveries (type, pickup_address, destination_address, tracking_id) VALUES (?, ?, ?, ?)").run(type, pickup, destination, trackingId);
    res.json({ deliveryId: info.lastInsertRowid, trackingId });
  });

  app.get("/api/tracking/:id", (req, res) => {
    const delivery = db.prepare("SELECT * FROM deliveries WHERE tracking_id = ?").get(req.params.id);
    if (delivery) {
      res.json(delivery);
    } else {
      res.status(404).json({ error: "Tracking ID not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
