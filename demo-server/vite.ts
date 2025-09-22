// Simplified vite setup for demo
import { type Express } from "express";

export async function setupVite(app: Express) {
  const vite = await (await import("vite")).createServer({
    server: { middlewareMode: true },
    appType: "custom",
    root: process.cwd(),
    publicDir: "client/public"
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}

export async function serveStatic(app: Express) {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  
  app.use(compression());
  app.use(sirv("dist/client", { 
    extensions: [],
    gzip: true,
    brotli: true
  }));
}

export function log(message: string) {
  const timestamp = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  
  console.log(`\x1b[90m[${timestamp}]\x1b[0m ${message}`);
}