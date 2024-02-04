// src/server/server.ts
import * as http from 'http';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fetchParseAndWriteOrderAccounts } from '../services/galacticMarketplace.js';
import { combineJsonData } from '../utils/combine.js';
import { needsUpdate } from '../utils/update.js';
import { updateTokenPricesIfNeeded } from '../services/tokenPricesService.js'; // Import the function

dotenv.config();

const __dirname = path.resolve(path.dirname(''));

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  try {
    const orderDataPath = path.join(__dirname, 'data', 'staratlasOrderAccountData.json');
    const priceDataPath = path.join(__dirname, 'data', 'coingeckoTokenData.json');

    // Check if order data needs updating
    if (await needsUpdate(orderDataPath, 60000)) { // 60 seconds
      await fetchParseAndWriteOrderAccounts();
    }

    // Ensure the token prices data is up-to-date
    await updateTokenPricesIfNeeded(); // Update token prices if needed

    // Combine JSON data
    const combinedData = await combineJsonData(orderDataPath, priceDataPath);

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(combinedData);
  } catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
}

export function startServer(): void {
  const port = process.env.PORT || 8080; // Use the PORT environment variable or default to 8080

  const server = http.createServer((req, res) => {
      handleRequest(req, res).catch(error => {
          console.error('Unhandled error:', error);
          if (!res.headersSent) {
              res.writeHead(500);
              res.end('Internal Server Error');
          }
      });
  });

  server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
  });
}
