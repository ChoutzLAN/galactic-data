// src/utils/comnbine.ts
// Utility function to combine JSON data from two files
import { promises as fs } from 'fs';
import * as path from 'path';

async function fileExists(filePath: string): Promise<boolean> {
  return fs.access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

export async function combineJsonData(orderDataPath: string, priceDataPath: string): Promise<string> {
  try {
    const [orderDataExists, priceDataExists] = await Promise.all([
      fileExists(orderDataPath),
      fileExists(priceDataPath),
    ]);

    let orderData = orderDataExists ? await fs.readFile(orderDataPath, 'utf8').then(JSON.parse) : [];
    let priceData = priceDataExists ? await fs.readFile(priceDataPath, 'utf8').then(JSON.parse) : {};

    const combinedData = {
      orders: orderData,
      prices: priceData,
    };

    return JSON.stringify(combinedData, null, 2);
  } catch (error) {
    console.error('Error combining JSON data:', error);
    throw new Error('Failed to combine JSON data');
  }
}