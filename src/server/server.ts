// src/server/server.ts
import * as http from 'http';
import { updateTokenPricesIfNeeded } from '../services/tokenPricesService.js'; // Moving token price update logic to a service
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const __dirname = path.resolve(path.dirname('')); // Adjust according to your setup

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    if (req.url === '/favicon.ico') {
      res.writeHead(204); // No Content
      res.end();
      return;
    }
    try {
      // Update token prices if needed
      await updateTokenPricesIfNeeded();
      const filePath = path.join(__dirname, 'data', 'tokenPricesData.json');
  
      const data = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(data);
    } catch (error) {
      console.error('Error handling request:', error);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  }

export function startServer(port: number | string): void {
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
