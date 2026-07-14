import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb, getDbStatus } from './db.js';

// Pre-load model to register with Mongoose
import './models/Player.js'; 
import playerRoutes from './routes/players.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check & Database Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    db: getDbStatus()
  });
});

// Routes
app.use('/api/players', playerRoutes);

// Serve the built React frontend (created by `npm run build` in /frontend,
// copied into ./public by the Dockerfile) so this single server can host
// both the API and the site — ideal for a single Cloud Run deployment.
const PUBLIC_DIR = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_DIR));

// Any non-API route falls through to the React app (client-side routing)
app.get(/^(?!\/api).*/, (req, res, next) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'), (err) => {
    if (err) next();
  });
});

// Simple test run argument validation
if (process.argv.includes('--test')) {
  console.log('[Server] Test run verification successful. Compiles fine!');
  process.exit(0);
}

// Connect Database & Start Server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rcb_analytics';

if (process.env.VERCEL) {
  // On Vercel, this file runs as a serverless function — connect to the DB
  // in the background and let Vercel invoke the exported `app` per-request
  // instead of calling app.listen().
  connectDb(MONGO_URI);
} else {
  connectDb(MONGO_URI).then(() => {
    app.listen(PORT, () => {
      console.log(`[Server] RCB Player Analytics Server running on port ${PORT}`);
      const status = getDbStatus();
      console.log(`[Server] Database status: Mode = ${status.mode}, Connected = ${status.connected}`);
    });
  }).catch(err => {
    console.error('[Server] Critical failure during startup:', err);
    process.exit(1);
  });
}

export default app;
