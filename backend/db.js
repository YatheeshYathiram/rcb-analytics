import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const FALLBACK_FILE = path.join(DATA_DIR, 'players.json');
const SEED_FILE = path.join(DATA_DIR, 'seed.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let isUsingFallback = false;
let fallbackData = [];

// Load fallback JSON data
function loadFallbackData() {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const content = fs.readFileSync(FALLBACK_FILE, 'utf8');
      fallbackData = JSON.parse(content);
      console.log(`[Database] Loaded ${fallbackData.length} players from local JSON file DB.`);
    } else {
      // If local database file doesn't exist, try loading from seed
      if (fs.existsSync(SEED_FILE)) {
        const content = fs.readFileSync(SEED_FILE, 'utf8');
        fallbackData = JSON.parse(content);
        fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackData, null, 2));
        console.log(`[Database] Initialized local JSON file DB from seed.json with ${fallbackData.length} players.`);
      } else {
        fallbackData = [];
        fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackData, null, 2));
        console.log('[Database] Created empty local JSON file DB.');
      }
    }
  } catch (error) {
    console.error('[Database] Error loading fallback JSON database:', error);
    fallbackData = [];
  }
}

// Save fallback JSON data
function saveFallbackData() {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackData, null, 2));
  } catch (error) {
    console.error('[Database] Error saving fallback JSON database:', error);
  }
}

// MongoDB Connection
export async function connectDb(uri) {
  const mongoUri = uri || process.env.MONGO_URI || 'mongodb://localhost:27017/rcb_analytics';
  console.log(`[Database] Attempting to connect to MongoDB: ${mongoUri.split('@').pop()}`);
  
  try {
    // Attempt Mongoose connection with a short timeout so we don't hang if Mongo isn't running
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000, 
      connectTimeoutMS: 3000
    });
    console.log('[Database] MongoDB connected successfully.');
    isUsingFallback = false;
    
    // Seed MongoDB if it's empty
    const count = await mongoose.model('Player').countDocuments();
    if (count === 0) {
      console.log('[Database] MongoDB is empty. Seeding database...');
      if (fs.existsSync(SEED_FILE)) {
        const seedContent = fs.readFileSync(SEED_FILE, 'utf8');
        const seedPlayers = JSON.parse(seedContent);
        await mongoose.model('Player').insertMany(seedPlayers);
        console.log(`[Database] Seeded MongoDB with ${seedPlayers.length} players.`);
      } else {
        console.warn('[Database] Seed file not found at', SEED_FILE);
      }
    }
  } catch (error) {
    console.warn('[Database] Failed to connect to MongoDB. Error:', error.message);
    console.warn('[Database] SWITCHING TO LOCAL JSON FALLBACK MODE.');
    isUsingFallback = true;
    loadFallbackData();
  }
}

// Check DB Status
export function getDbStatus() {
  return {
    mode: isUsingFallback ? 'JSON File Fallback' : 'MongoDB (Mongoose)',
    filePath: isUsingFallback ? FALLBACK_FILE : null,
    connected: isUsingFallback ? true : mongoose.connection.readyState === 1
  };
}

// Database CRUD interface mapping both Mongo and JSON fallback
export const PlayerDb = {
  // FIND ALL / FILTER
  find: async (query = {}) => {
    if (!isUsingFallback) {
      const Player = mongoose.model('Player');
      return await Player.find(query);
    }
    
    // Fallback simple search
    let results = [...fallbackData];
    
    if (query.role) {
      results = results.filter(p => p.role.toLowerCase() === query.role.toLowerCase());
    }
    if (query.nationality) {
      results = results.filter(p => p.nationality.toLowerCase() === query.nationality.toLowerCase());
    }
    if (query.status) {
      results = results.filter(p => p.status.toLowerCase() === query.status.toLowerCase());
    }
    if (query.name) {
      const searchName = query.name.toString().toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(searchName));
    }
    
    return results;
  },

  // FIND BY ID
  findById: async (id) => {
    if (!isUsingFallback) {
      const Player = mongoose.model('Player');
      return await Player.findById(id);
    }
    
    const player = fallbackData.find(p => p._id === id || p.id === id);
    return player || null;
  },

  // CREATE PLAYER
  create: async (data) => {
    if (!isUsingFallback) {
      const Player = mongoose.model('Player');
      return await Player.create(data);
    }
    
    const newPlayer = {
      ...data,
      _id: data._id || `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      id: data.id || `fallback_${Date.now()}`
    };
    fallbackData.push(newPlayer);
    saveFallbackData();
    return newPlayer;
  },

  // UPDATE BY ID
  findByIdAndUpdate: async (id, data, options = {}) => {
    if (!isUsingFallback) {
      const Player = mongoose.model('Player');
      return await Player.findByIdAndUpdate(id, data, { new: true, ...options });
    }
    
    const index = fallbackData.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;
    
    fallbackData[index] = {
      ...fallbackData[index],
      ...data
    };
    saveFallbackData();
    return fallbackData[index];
  },

  // DELETE BY ID
  findByIdAndDelete: async (id) => {
    if (!isUsingFallback) {
      const Player = mongoose.model('Player');
      return await Player.findByIdAndDelete(id);
    }
    
    const index = fallbackData.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;
    
    const deleted = fallbackData.splice(index, 1)[0];
    saveFallbackData();
    return deleted;
  },

  // IMPORT BULK
  insertMany: async (playersArray) => {
    if (!isUsingFallback) {
      const Player = mongoose.model('Player');
      return await Player.insertMany(playersArray);
    }
    
    const newPlayers = playersArray.map(p => ({
      ...p,
      _id: p._id || `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      id: p.id || `fallback_${Date.now()}`
    }));
    fallbackData.push(...newPlayers);
    saveFallbackData();
    return newPlayers;
  },

  // RESET FALLBACK DATA (Helper for admin imports)
  resetData: async (playersArray) => {
    if (!isUsingFallback) {
      const Player = mongoose.model('Player');
      await Player.deleteMany({});
      return await Player.insertMany(playersArray);
    }
    fallbackData = playersArray.map(p => ({
      ...p,
      _id: p._id || `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      id: p.id || `fallback_${Date.now()}`
    }));
    saveFallbackData();
    return fallbackData;
  }
};
