import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupVite, serveStatic, log } from './vite.js';
import { setupRoutes } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration for demo deployment
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5000',
    'http://localhost:3000',
    'https://yourusername.github.io', // Update with actual GitHub username
    'https://localhost:5000'
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

// Setup API routes
setupRoutes(app);

// Handle Vite in development or serve static files in production
if (process.env.NODE_ENV === 'production') {
  await serveStatic(app);
} else {
  await setupVite(app);
}

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '../dist/client/index.html'));
  } else {
    // Vite handles this in development
    res.status(404).send('Not found');
  }
});

app.listen(port, '0.0.0.0', () => {
  log(`Demo server running on http://0.0.0.0:${port}`);
  log('Demo mode: No external APIs required');
  log('Business listings: 50+ static demo businesses');
  log('AI scoring: Mock algorithm (deterministic)');
});