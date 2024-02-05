// src/services/tokenPricesService.ts
import { promises as fs } from 'fs'; // Use fs promises for asynchronous operations
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getPrices } from '../services/coingecko.js';
import { Prices } from '../types/coingeckoTypes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirPath = path.join(__dirname, '..', '..', 'data');
const filePath = path.join(dataDirPath, 'coingeckoTokenData.json');

export async function updateTokenPricesIfNeeded(): Promise<Prices | null> {
    try {
        console.log(`Starting updateTokenPricesIfNeeded...`);
        let pricesData: Prices | null = null;

        try {
            await fs.access(dataDirPath);
            console.log(`Directory exists: ${dataDirPath}`);
        } catch {
            console.log(`Directory does not exist, creating: ${dataDirPath}`);
            await fs.mkdir(dataDirPath, { recursive: true });
        }

        try {
            await fs.access(filePath);
            const stats = await fs.stat(filePath);
            const lastModifiedTime = new Date(stats.mtime).getTime();
            const currentTime = new Date().getTime();

            if (currentTime - lastModifiedTime > 60000) {
                console.log('Updating token prices...');
                pricesData = await getPrices();
                console.log('Successfully fetched new prices data:');
                await fs.writeFile(filePath, JSON.stringify(pricesData, null, 2));
                console.log('Token prices data has been updated and written to file.');
            } else {
                console.log('Token prices data is up to date, reading from file...');
                pricesData = JSON.parse(await fs.readFile(filePath, 'utf8')) as Prices;
                console.log('Read existing token prices data from file.');
            }
        } catch (err) {
            console.log('Token prices file does not exist or another error occurred, fetching new data...');
            pricesData = await getPrices();
            console.log('Successfully fetched new prices data');
            await fs.writeFile(filePath, JSON.stringify(pricesData, null, 2));
            console.log('Token prices data has been written to new file.');
        }

        return pricesData;
    } catch (error) {
        console.error('An unexpected error occurred in updateTokenPricesIfNeeded:', error);
        return null;
    }
}
