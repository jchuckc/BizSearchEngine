// Simplified demo server - no external dependencies required
import express, { type Request, Response, NextFunction } from "express";
import { registerDemoRoutes } from "./routes.js";
import { log } from "./vite.js";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration for demo deployment
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5001',
    'http://localhost:3000',
    'https://yourusername.github.io', // Update with actual GitHub username
    'https://localhost:5001'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerDemoRoutes(app);

  // Error handling
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ 
      error: message,
      mode: 'demo',
      timestamp: new Date().toISOString()
    });
  });

  // Development mode setup
  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./vite.js");
    await setupVite(app);
  } else {
    // Production mode - serve static files
    const { serveStatic } = await import("./vite.js");
    serveStatic(app);
  }

  const port = Number(process.env.PORT) || 5001;
  server.listen(port, "0.0.0.0", () => {
    log(`Demo server running on http://0.0.0.0:${port}`);
    log(`Demo mode: No external APIs required`);
    log(`Business listings: 50+ static demo businesses`);
    log(`AI scoring: Mock algorithm (deterministic)`);
  });
})();