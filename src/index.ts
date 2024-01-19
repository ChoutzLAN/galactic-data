// index.ts
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { getPrices, Prices } from './coingecko.js'; // Make sure to export Prices in coingecko.ts

// Construct the equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function updateTokenPricesIfNeeded(): Promise<void> {
  const filePath = path.join(__dirname, 'data', 'tokenPricesData.json');

  // Ensure that the 'data' directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`Created directory: ${dataDir}`);
}

  try {
    let pricesData: Prices | null;
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const lastModifiedTime = new Date(stats.mtime).getTime();
      const currentTime = new Date().getTime();

      // Check if last modified time is greater than 60 seconds ago
      if (currentTime - lastModifiedTime > 60000) {
        console.log('Updating token prices...');
        pricesData = await getPrices(); // Function from coingecko.ts to update the data
      } else {
        console.log('Token prices data is up to date.');
        pricesData = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Prices; // Read existing data
      }
    } else {
      console.log('Token prices file does not exist. Creating new file...');
      pricesData = await getPrices(); // Create new data
    }

    // Log the prices data to the console
    if (pricesData) {
      console.log('Token Prices:', pricesData);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

updateTokenPricesIfNeeded();
