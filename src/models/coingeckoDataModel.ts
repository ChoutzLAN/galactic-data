// src/models/coingeckoTokenModel.ts
import { Firestore } from '@google-cloud/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firestore = new Firestore({
  projectId: process.env.FIRESTORE_PROJECT_ID,
});

interface CoingeckoToken {
  id: string;
  price: number;
  name: string;
  symbol: string;
  lastUpdated: string;
}

class CoingeckoTokenModel {
  private collection;

  constructor() {
    this.collection = firestore.collection('CoingeckoTokens');
  }

  async create(token: CoingeckoToken): Promise<void> {
    await this.collection.doc(token.id).set(token);
  }

  async getById(id: string): Promise<CoingeckoToken | undefined> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      console.log('No such document!');
      return undefined;
    } else {
      return doc.data() as CoingeckoToken;
    }
  }

  // Add other necessary methods as needed, e.g., update, delete, etc.
}

export default CoingeckoTokenModel;
