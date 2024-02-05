// src/utils/combine.ts
import NodeCache from 'node-cache';
import { OrderData, PriceData } from '../types/configTypes'; // Adjust the import path as necessary

const cache = new NodeCache();

// Adjust the function to accept data objects directly
export function combineJsonData(orderData: OrderData, priceData: PriceData): string {
  // Cache the data for future use
  cache.set("staratlasOrderAccountData", orderData);
  cache.set("coingeckoTokenData", priceData);

  const combinedData = {
    staratlasOrderAccountData: orderData.data || [],
    staratlasOrderAccountDataFileLastUpdated: orderData.fileLastUpdated,
    coingeckoTokenData: priceData.data || {},
    coingeckoTokenDataFileLastUpdated: priceData.fileLastUpdated,
  };

  return JSON.stringify(combinedData, null, 2);
}
