// src\index.ts
import { connectToFirestore } from './utils/connection.js';
import { startServer } from './server/server.js';

async function init() {
    await connectToFirestore(); // Assume this is modified to return a Promise
    startServer();
}

init().catch(console.error);