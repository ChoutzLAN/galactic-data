// src/index.ts
import express from 'express';
import { connectToFirestore } from './utils/connection';

async function startApplication() {
  await connectToFirestore();
  const app = express();

  // Define routes and middleware

  const port = process.env.PORT || 8080;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

startApplication().catch(console.error);
