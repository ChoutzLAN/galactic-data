// src/server/server.ts
import * as http from 'http';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { combineJsonData } from '../utils/combine.js';
import { needsUpdate } from '../utils/update.js';
import { fetchParseAndWriteOrderAccounts } from '../services/galacticMarketplace.js';
import { updateTokenPricesIfNeeded } from '../services/tokenPricesService.js';
import NodeCache from 'node-cache';
import { staratlasOrderAccountType } from '../types/staratlasOrdersTypes';
import { coingeckoTokenType } from '../types/coingeckoTypes';

dotenv.config();

const cache = new NodeCache(); // Initialize cache
const __dirname = path.resolve(path.dirname(''));

async function readJsonData(filePath: string) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  try {
    const staratlasOrderPath = path.join(__dirname, 'data', 'staratlasOrderAccountData.json');
    const coinceckoDataPath = path.join(__dirname, 'data', 'coingeckoTokenData.json');

    // Check if Star Atlas order data needs updating
    if (await needsUpdate(staratlasOrderPath, 60000)) { // 60 seconds
      await fetchParseAndWriteOrderAccounts();
    }
    if (await needsUpdate(coinceckoDataPath, 60000)) { // 60 seconds
      //await fetchParseAndWriteOrderAccounts();
    }

    // Ensure the token prices data is up-to-date
    await updateTokenPricesIfNeeded(); // Update token prices if needed

    let staratlasOrders: staratlasOrderAccountType = cache.get('staratlasOrderAccountData') as staratlasOrderAccountType;
    let coingeckoData: coingeckoTokenType = cache.get('coingeckoTokenData') as coingeckoTokenType;

    if (!staratlasOrders) {
      staratlasOrders = await readJsonData(staratlasOrderPath) as staratlasOrderAccountType;
      cache.set('staratlasOrderAccountData', staratlasOrders);
    }

    if (!coingeckoData) {
      coingeckoData = await readJsonData(coinceckoDataPath) as coingeckoTokenType;
      cache.set('coingeckoTokenData', coingeckoData);
    }

    // Combine JSON data
    const combinedData = await combineJsonData(staratlasOrders, coingeckoData); // Corrected to use the proper types

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(combinedData)); // Ensure you're sending a string
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
