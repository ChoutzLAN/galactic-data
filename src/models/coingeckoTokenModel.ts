// src/models/coingeckoTokenModel.ts
import { Schema, model } from 'mongoose';

export interface CoingeckoToken {
  id: string;
  price: number;
  name: string;
  symbol: string;
  lastUpdated: string; // Last updated timestamp from CoinGecko API
  dbLastUpdated?: Date; // Timestamp for the last update in the database
}

const coingeckoTokenSchema = new Schema<CoingeckoToken>({
  id: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  lastUpdated: { type: String, required: true },
  dbLastUpdated: { type: Date, required: false } // Automatically managed, no need to set required
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'dbLastUpdated' } }); // Mongoose manages dbLastUpdated

export const CoingeckoTokenModel = model<CoingeckoToken>('CoingeckoToken', coingeckoTokenSchema);

export default CoingeckoTokenModel;