// src/services/tokenPricesService.ts
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { getPrices, Prices } from '../services/coingecko.js'; // Adjust the import path as necessary

// Convert the URL to a file path for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirPath = path.resolve(__dirname, '../../data'); // Adjust based on your project structure
const filePath = path.join(dataDirPath, 'tokenPricesData.json');

/**
 * Checks if the token prices data needs updating and updates if necessary.
 * If data is older than 60 seconds or doesn't exist, fetches new data.
 * Otherwise, reads the existing data from the file.
 */
export async function updateTokenPricesIfNeeded(): Promise<Prices | null> {
    try {
        let pricesData: Prices | null = null;
        
        // Ensure that the 'data' directory exists
        if (!fs.existsSync(dataDirPath)) {
            fs.mkdirSync(dataDirPath, { recursive: true });
            console.log(`Created directory: ${dataDirPath}`);
        }

        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const lastModifiedTime = new Date(stats.mtime).getTime();
            const currentTime = new Date().getTime();

            // Check if last modified time is greater than 60 seconds ago
            if (currentTime - lastModifiedTime > 60000) {
                console.log('Updating token prices...');
                pricesData = await getPrices(); // Fetch new data
                fs.writeFileSync(filePath, JSON.stringify(pricesData)); // Save new data to file
            } else {
                console.log('Token prices data is up to date.');
                pricesData = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Prices; // Read existing data
            }
        } else {
            console.log('Token prices file does not exist. Creating new file...');
            pricesData = await getPrices(); // Fetch new data
            fs.writeFileSync(filePath, JSON.stringify(pricesData)); // Save new data to file
        }

        return pricesData;
    } catch (error) {
        console.error('An error occurred while updating token prices:', error);
        return null;
    }
}
