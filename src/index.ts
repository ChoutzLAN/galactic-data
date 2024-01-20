// index.ts
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { getPrices, Prices } from './coingecko.js'; // Make sure to export Prices in coingecko.ts
import * as http from 'http';
dotenv.config();

//import { Config } from './types/configTypes.js';

// // Dynamic import of JSON file for configuration
// const configModule = await import('../config.json', {
//   assert: { type: 'json' }
// });
// const configuration: Config = (configModule as unknown as { default: Config }).default;

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

    // // Log the prices data to the console
    // if (pricesData) {
    //   console.log('Token Prices:', pricesData);
    // }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Create a simple HTTP server that responds with the token prices JSON data
const server = http.createServer(async (req, res) => {
  // Update token prices if needed
  const filePath = path.join(__dirname, 'data', 'tokenPricesData.json');

  await updateTokenPricesIfNeeded();

  // Read the token prices data from the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error reading the token prices file.');
      return;
    }

    // Set the Content-Type header and serve the JSON data
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(data);
  });
});

// Specify the port to listen on
const PORT = process.env.PORT || 8080;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
