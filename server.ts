import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(`[SERVER] Starting in ${process.env.NODE_ENV} mode`);

  // Vite middleware for development - MUST BE AT THE TOP to intercept module requests
  if (process.env.NODE_ENV !== "production") {
    console.log("[SERVER] Initializing Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
      root: process.cwd(),
    });
    app.use(vite.middlewares);
    console.log("[SERVER] Vite middleware attached.");

    // SPA fallback for development
    app.get('*', async (req, res, next) => {
      if (req.url.includes('.') || req.url.startsWith('/api/')) {
        return next();
      }
      try {
        const template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        const html = await vite.transformIndexHtml(req.url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.url.startsWith('/src/')) {
      const fullPath = path.join(process.cwd(), req.url);
      console.log(`[DEBUG] Request for source file: ${req.url}`);
      console.log(`[DEBUG] Full path: ${fullPath}`);
      console.log(`[DEBUG] Exists: ${fs.existsSync(fullPath)}`);
    }
    next();
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      provider: "firebase",
      env: process.env.NODE_ENV,
      cwd: process.cwd(),
      dirname: __dirname
    });
  });

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });

  // Serve public directory
  app.use(express.static(path.resolve(__dirname, "public")));

  if (process.env.NODE_ENV === "production") {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> SERVER STARTUP SUCCESSFUL (FIREBASE MODE) <<<`);
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
