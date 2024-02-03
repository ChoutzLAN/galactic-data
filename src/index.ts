// src/index.ts
import { startServer } from './server/server.js'; // Assuming we move the HTTP server logic to server.ts

const PORT = process.env.PORT || 3000;

startServer(PORT);
