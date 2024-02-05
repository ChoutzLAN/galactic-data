// src/services/coingecko.ts

import fetch from 'node-fetch';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
import { CoingeckoFullTokenInfoType, coingeckoTokenType } from '../types/coingeckoTypes.js';
import { Config } from '../types/configTypes.js';

// Dynamic import of JSON file
const configModule = await import('../../config.json', {
  assert: { type: 'json' }
});
const configuration: Config = (configModule as unknown as { default: Config }).default;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Type Guard function to check if the response matches the CoinGeckoTokenInfo[] structure
function isCoinGeckoTokenInfoArray(data: any): data is CoingeckoFullTokenInfoType[] {
  return Array.isArray(data) && data.every(item =>
    typeof item === 'object' &&
    'id' in item && typeof item.id === 'string' &&
    'symbol' in item && typeof item.symbol === 'string' &&
    'name' in item && typeof item.name === 'string' &&
    'image' in item && typeof item.image === 'string' &&
    'current_price' in item && typeof item.current_price === 'number' &&
    'market_cap' in item && typeof item.market_cap === 'number' &&
    'market_cap_rank' in item && (typeof item.market_cap_rank === 'number' || item.market_cap_rank === null) &&
    'fully_diluted_valuation' in item && (typeof item.fully_diluted_valuation === 'number' || item.fully_diluted_valuation === null) &&
    'total_volume' in item && typeof item.total_volume === 'number' &&
    'high_24h' in item && typeof item.high_24h === 'number' &&
    'low_24h' in item && typeof item.low_24h === 'number' &&
    'price_change_24h' in item && typeof item.price_change_24h === 'number' &&
    'price_change_percentage_24h' in item && typeof item.price_change_percentage_24h === 'number' &&
    'market_cap_change_24h' in item && typeof item.market_cap_change_24h === 'number' &&
    'market_cap_change_percentage_24h' in item && typeof item.market_cap_change_percentage_24h === 'number' &&
    'circulating_supply' in item && typeof item.circulating_supply === 'number' &&
    'total_supply' in item && (typeof item.total_supply === 'number' || item.total_supply === null) &&
    'max_supply' in item && (typeof item.max_supply === 'number' || item.max_supply === null) &&
    'ath' in item && typeof item.ath === 'number' &&
    'ath_change_percentage' in item && typeof item.ath_change_percentage === 'number' &&
    'ath_date' in item && typeof item.ath_date === 'string' &&
    'atl' in item && typeof item.atl === 'number' &&
    'atl_change_percentage' in item && typeof item.atl_change_percentage === 'number' &&
    'atl_date' in item && typeof item.atl_date === 'string' &&
    'last_updated' in item && typeof item.last_updated === 'string'
  );
}

export async function getPrices(): Promise<coingeckoTokenType | null> {
  const tokenIds = configuration.tokenIds.join(',');
  const apiUrl = `${configuration.apiConfig.coingeckoApiUrl.replace('/simple/price', '/coins/markets')}&vs_currency=usd&ids=${tokenIds}`;
  console.log('Fetching prices from CoinGecko API...', apiUrl);

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    //console.log(`Fetched data from CoinGecko:`, data);

    if (!isCoinGeckoTokenInfoArray(data)) {
      console.error('Fetched data does not match the CoinGeckoTokenInfo structure');
      return null;
    }

    const coingeckoDataParsed: coingeckoTokenType = data.reduce((acc, tokenInfo) => {
      acc[tokenInfo.id] = {
        price: tokenInfo.current_price,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        lastUpdated: tokenInfo.last_updated,
      };
      return acc;
    }, {} as coingeckoTokenType);
    //console.log(`Processed prices data:`, prices);

    const dataDirPath = path.join(__dirname, '..', '..', 'data');
    if (!fs.existsSync(dataDirPath)) {
      console.log(`Data directory does not exist, creating: ${dataDirPath}`);
      fs.mkdirSync(dataDirPath);
    }
    fs.writeFileSync(path.join(dataDirPath, 'coingeckoTokenData.json'), JSON.stringify(coingeckoDataParsed, null, 2));
    console.log('coingeckoTokenData.json has been updated with the latest prices.');

    return coingeckoDataParsed;

  } catch (error) {
    console.error('Error fetching Coingecko Data:', error);
    return null;
  }
}
