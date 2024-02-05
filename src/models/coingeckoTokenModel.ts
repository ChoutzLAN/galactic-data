// src/models/coingeckoTokenModel.ts
import { Schema, model } from 'mongoose';

interface CoingeckoToken {
  id: string; // Assuming each token has a unique ID for database operations
  price: number;
  name: string;
  symbol: string;
  lastUpdated: string;
}

const coingeckoTokenSchema = new Schema<CoingeckoToken>({
  id: { type: String, required: true, unique: true }, // Ensure uniqueness for each token ID
  price: { type: Number, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  lastUpdated: { type: String, required: true },
});

const CoingeckoTokenModel = model<CoingeckoToken>('CoingeckoToken', coingeckoTokenSchema);

export default CoingeckoTokenModel;
