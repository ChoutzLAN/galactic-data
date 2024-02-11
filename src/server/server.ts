// src\server\server.ts
import * as http from 'http';
import * as dotenv from 'dotenv';
import { db } from '../utils/connection.js'; // Import Firestore connection utility

dotenv.config();

export async function fetchDataFromFirestore(): Promise<any> {
  // Firestore collection references
  const staratlasOrdersCollection = db.collection('starAtlasOrders');
  const coingeckoDataCollection = db.collection('coingeckoTokens');

  // Fetch data from Firestore
  const staratlasOrdersSnapshot = await staratlasOrdersCollection.get();
  const coingeckoDataSnapshot = await coingeckoDataCollection.get();

  // Map documents to array of data
  const staratlasOrders = staratlasOrdersSnapshot.docs.map(doc => doc.data());
  const coingeckoData = coingeckoDataSnapshot.docs.map(doc => doc.data());

  return { staratlasOrders, coingeckoData };
}

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const { staratlasOrders, coingeckoData } = await fetchDataFromFirestore();
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({ staratlasOrders, coingeckoData })); // Ensure the response structure matches your frontend
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
