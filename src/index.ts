// src/index.ts
import { startServer } from './server/server.js'; // Assuming we move the HTTP server logic to server.ts
startServer();
import { connectToDatabase } from './utils/connection.js';
connectToDatabase().catch(console.error);