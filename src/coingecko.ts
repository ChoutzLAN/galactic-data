// coingecko

import fetch from 'node-fetch';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

import { Config } from './types/configTypes.js';
// Dynamic import of JSON file
const configModule = await import('../config.json', {
  assert: { type: 'json' }
});
const configuration: Config = (configModule as unknown as { default: Config }).default;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface CoinGeckoResponse {
  [key: string]: { usd: number };
}

// Define the structure of your prices object
export interface Prices {
  [key: string]: number;
}

export async function getPrices(): Promise<Prices | null> {
  const apiUrl = `${configuration.apiConfig.coingeckoApiUrl}&ids=solana,star-atlas,star-atlas-dao,usd-coin,wrapped-solana,helium,bonk,raydium,orca,step-finance,render-token`;

  if (!apiUrl) {
    console.error('API URL is undefined. Please check your .env configuration.');
    return null;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json() as CoinGeckoResponse;

    // Map over the response data to extract prices
    const prices: Prices = Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].usd;
      return acc;
    }, {} as Prices);

    // Write data to a file
    const dataDirPath = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDirPath)) {
      fs.mkdirSync(dataDirPath);
    }
    fs.writeFileSync(path.join(dataDirPath, 'tokenPricesData.json'), JSON.stringify(prices, null, 2));

    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return null;
  }
}
