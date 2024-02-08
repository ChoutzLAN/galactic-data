// src/services/coingecko.ts
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import CoingeckoTokenModel from '../models/coingeckoTokenModel.js'; // Import the model

dotenv.config();

export async function getPrices(): Promise<void> {
  // Assuming TOKEN_IDS is a comma-separated string of token IDs
  const tokenIds = process.env.TOKEN_IDS;
  // Use the COINGECKO_API_URL_PUBLIC_PUBLIC environment variable
  const apiUrl = `${process.env.COINGECKO_API_URL_PUBLIC}&vs_currency=usd&ids=${tokenIds}`;
  console.log('Fetching prices from CoinGecko API...', apiUrl);

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('Fetched data is not an array:', data);
      return;
    }

    for (const tokenInfo of data) {
      await CoingeckoTokenModel.findOneAndUpdate({ id: tokenInfo.id }, {
        price: tokenInfo.current_price,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        lastUpdated: tokenInfo.last_updated
      }, { upsert: true, new: true });
    }

    console.log('Database has been updated with the latest prices.');
  } catch (error) {
    console.error('Error fetching Coingecko Data:', error);
  }
}
