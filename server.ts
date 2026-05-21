import express from "express";
import path from "path";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Try connecting to MongoDB if URI is provided
  const mongoURI = process.env.MONGODB_URI;
  if (mongoURI && mongoURI !== "mongodb+srv://<db_username>:<db_password>@cluster0.atlpqa2.mongodb.net/?appName=Cluster0") {
    try {
      await mongoose.connect(mongoURI);
      console.log("Connected to MongoDB successfully");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  }

  // Proxy route for PDFs to avoid CORS issues
  app.get("/api/pdf-proxy", async (req, res) => {
    const pdfUrl = req.query.url;
    if (!pdfUrl || typeof pdfUrl !== "string") {
      return res.status(400).send("Missing pdf url");
    }

    try {
      const response = await axios({
        url: pdfUrl,
        method: "GET",
        responseType: "arraybuffer", // Load fully into memory
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': 'application/pdf,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="document.pdf"`);
      res.setHeader("Content-Length", response.data.byteLength);
      // Send the buffer directly to the client
      res.send(Buffer.from(response.data));
    } catch (error) {
      console.error("Error fetching PDF via proxy:", error);
      res.status(500).send("Error fetching PDF");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "mpa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
