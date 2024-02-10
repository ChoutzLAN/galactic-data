// src/server/server.ts
import * as http from 'http';
import * as dotenv from 'dotenv';
import { getPrices } from '../services/coingecko.js'; // Assuming getPrices now updates the DB
import { CoingeckoToken } from '../models/coingeckoDataModel.js';
import { StarAtlasOrder } from '../models/staratlasOrderModel.js';

dotenv.config();

export async function fetchDataFromDB(): Promise<{ staratlasOrders: StarAtlasOrder[], coingeckoData: CoingeckoToken[] }> {
  const staratlasOrders = await StarAtlasOrderModel.find();
  const coingeckoData = await CoingeckoTokenModel.find();

  return { staratlasOrders, coingeckoData };
}

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // Ensure the data is up-to-date, this might involve calling getPrices directly or via scheduled tasks
    // Consider removing direct calls to update data in the request handler for better performance
    await getPrices(); // Uncomment if updates should be triggered per request (not recommended for high traffic)

    const { staratlasOrders, coingeckoData } = await fetchDataFromDB();

    // Process or combine your data as needed
    // Since you're now working directly with MongoDB documents, ensure your response structure aligns with your frontend expectations

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({ staratlasOrders, coingeckoData })); // Adjust according to your actual combined data structure
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
