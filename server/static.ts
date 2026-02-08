import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "client/dist");

  // if frontend not built (like on Render backend), skip static hosting
  if (!fs.existsSync(distPath)) {
    console.log("Frontend build not found, skipping static hosting");
    return;
  }

  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
