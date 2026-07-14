import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, 'frontend', 'public', 'images');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Player names mapped to their Wikipedia titles
const PLAYER_WIKI_TITLES = {
  virat_kohli: "Virat Kohli",
  faf_du_plessis: "Faf du Plessis",
  glenn_maxwell: "Glenn Maxwell",
  dinesh_karthik: "Dinesh Karthik",
  yuzvendra_chahal: "Yuzvendra Chahal",
  ab_de_villiers: "AB de Villiers",
  mohammed_siraj: "Mohammed Siraj",
  rajat_patidar: "Rajat Patidar",
  cameron_green: "Cameron Green (cricketer)",
  yash_dayal: "Yash Dayal",
  jitesh_sharma: "Jitesh Sharma",
  bhuvneshwar_kumar: "Bhuvneshwar Kumar",
  venkatesh_iyer: "Venkatesh Iyer",
  jacob_duffy: "Jacob Duffy",
  josh_hazlewood: "Josh Hazlewood"
};

// Fetch Wikipedia infobox thumbnail URLs via public PageImages API
function fetchWikiImageUrls(titles) {
  return new Promise((resolve, reject) => {
    const titlesStr = encodeURIComponent(titles.join('|'));
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${titlesStr}&prop=pageimages&format=json&pithumbsize=600&origin=*`;

    const options = {
      headers: {
        'User-Agent': 'RCBPlayerAnalyticsDev/1.0 (contact@rcb-analytics.local) NodeJs/22'
      }
    };

    https.get(apiUrl, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            return reject(new Error(`API Status: ${res.statusCode}`));
          }
          const parsed = JSON.parse(data);
          const pages = parsed.query?.pages || {};
          const result = {};

          for (const pageId in pages) {
            const page = pages[pageId];
            if (page.thumbnail?.source) {
              result[page.title] = page.thumbnail.source;
            }
          }
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Download file following redirects
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'RCBPlayerAnalyticsDev/1.0 (contact@rcb-analytics.local) NodeJs/22'
      }
    };

    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`Status: ${res.statusCode}`));
      }

      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
      file.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('[Script] Starting player images sync to', IMAGES_DIR);
  
  const titles = Object.values(PLAYER_WIKI_TITLES);
  let urlsMap = {};
  
  try {
    console.log('[Script] Fetching player infobox image links from Wikipedia API...');
    urlsMap = await fetchWikiImageUrls(titles);
    console.log('[Script] Found images on Wiki:', Object.keys(urlsMap));
  } catch (error) {
    console.error('[Script] Failed to query Wikipedia API:', error.message);
    return;
  }

  for (const [key, title] of Object.entries(PLAYER_WIKI_TITLES)) {
    const filename = `${key}.jpg`;
    const dest = path.join(IMAGES_DIR, filename);

    // Skip if already exists (unless it is placeholder / user-supplied)
    // We want to preserve user-supplied files (which are .jpg or .png)
    // Check if files exists
    const pngDest = path.join(IMAGES_DIR, `${key}.png`);
    if (fs.existsSync(dest) || fs.existsSync(pngDest)) {
      console.log(`[Script] Skipping ${key} (already downloaded/exists)`);
      continue;
    }

    const url = urlsMap[title];
    if (!url) {
      console.warn(`[Script] No Wikipedia infobox image found for: ${title}`);
      continue;
    }

    console.log(`[Script] Downloading ${key} photo from ${url}...`);

    try {
      await downloadFile(url, dest);
      console.log(`[Script] Success: Saved ${key}.jpg`);
      console.log('[Script] Waiting 3 seconds to prevent rate-limits...');
      await new Promise(r => setTimeout(r, 3000));
    } catch (e) {
      console.error(`[Script] Failed to download ${key}:`, e.message);
    }
  }

  console.log('[Script] Sync script finished.');
}

run();
